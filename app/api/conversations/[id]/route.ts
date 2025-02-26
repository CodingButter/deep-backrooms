// app/api/conversations/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/schema"
import { conversations, conversationAgents, aiAgents } from "@/db/schema"
import { insertConversationSchema, messageSchema } from "@/zod-schema"
import { auth } from "@/auth"
import { eq, and, inArray } from "drizzle-orm"

interface Params {
  params: {
    id: string
  }
}

/**
 * GET /api/conversations/[id]
 * Get a single conversation with all details
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Get the conversation
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.userId, session.user.id)))
      .limit(1)

    if (!conversation) {
      return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 })
    }

    // Get the agents for this conversation
    const conversationAgentRecords = await db
      .select({ agentId: conversationAgents.agentId })
      .from(conversationAgents)
      .where(eq(conversationAgents.conversationId, conversation.id))

    const agentIds = conversationAgentRecords.map((record) => record.agentId)

    // Get full agent details
    const agents = agentIds.length
      ? await db.select().from(aiAgents).where(inArray(aiAgents.id, agentIds))
      : []

    // Parse messages and agent IDs from JSON strings
    const messages = JSON.parse(conversation.messages)
    const parsedAgentIds = JSON.parse(conversation.agentIds)

    return NextResponse.json({
      success: true,
      data: {
        ...conversation,
        messages,
        agentIds: parsedAgentIds,
        agents,
      },
    })
  } catch (error) {
    console.error("Failed to fetch conversation:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch conversation" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/conversations/[id]
 * Update an existing conversation
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const json = await request.json()

    // Don't allow changing userId
    const { userId, ...updateData } = json

    // Check if the conversation exists and belongs to the user
    const [existingConversation] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.userId, session.user.id)))
      .limit(1)

    if (!existingConversation) {
      return NextResponse.json(
        { success: false, error: "Conversation not found or unauthorized" },
        { status: 404 }
      )
    }

    // Handle special case for messages - append to existing messages
    if (updateData.messages) {
      const existingMessages = JSON.parse(existingConversation.messages)
      const newMessages = Array.isArray(updateData.messages)
        ? updateData.messages
        : JSON.parse(updateData.messages)

      // Validate new messages
      for (const message of newMessages) {
        messageSchema.parse(message)
      }

      // Combine messages
      updateData.messages = JSON.stringify([...existingMessages, ...newMessages])
    }

    // Handle special case for agentIds - if provided
    if (updateData.agentIds) {
      // Convert to array if needed
      const agentIdsArray = Array.isArray(updateData.agentIds)
        ? updateData.agentIds
        : JSON.parse(updateData.agentIds)

      updateData.agentIds = JSON.stringify(agentIdsArray)

      // Update conversation-agent mappings
      await db.transaction(async (tx) => {
        // Delete existing mappings
        await tx.delete(conversationAgents).where(eq(conversationAgents.conversationId, id))

        // Create new mappings
        if (agentIdsArray.length > 0) {
          await tx.insert(conversationAgents).values(
            agentIdsArray.map((agentId) => ({
              conversationId: id,
              agentId,
            }))
          )
        }
      })
    }

    // Validate and update
    const partialSchema = insertConversationSchema.partial()
    const validatedData = partialSchema.parse(updateData)

    const [updatedConversation] = await db
      .update(conversations)
      .set(validatedData)
      .where(eq(conversations.id, id))
      .returning()

    return NextResponse.json({
      success: true,
      data: {
        ...updatedConversation,
        messages: JSON.parse(updatedConversation.messages),
        agentIds: JSON.parse(updatedConversation.agentIds),
      },
    })
  } catch (error) {
    console.error("Failed to update conversation:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to update conversation" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/conversations/[id]
 * Delete a conversation
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Check if the conversation exists and belongs to the user
    const [existingConversation] = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.userId, session.user.id)))
      .limit(1)

    if (!existingConversation) {
      return NextResponse.json(
        { success: false, error: "Conversation not found or unauthorized" },
        { status: 404 }
      )
    }

    // Delete the conversation and its relationships in a transaction
    await db.transaction(async (tx) => {
      // Delete conversation-agent mappings first (foreign key constraint)
      await tx.delete(conversationAgents).where(eq(conversationAgents.conversationId, id))

      // Delete the conversation
      await tx.delete(conversations).where(eq(conversations.id, id))
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete conversation:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete conversation" },
      { status: 500 }
    )
  }
}
