// app/api/conversations/[id]/messages/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db/schema/agentconversation"
import { conversations, aiAgents } from "@/db/schema/agentconversation"
import { eq, and } from "drizzle-orm"
import { messageSchema } from "@/zod-schema"
import { z } from "zod"

type OpenAIResponse = {
  choices: Array<{
    message: {
      content: string
      role: string
    }
  }>
}

async function generateAIResponse(agents: any[], messages: any[], systemPrompt: string) {
  // Placeholder for AI response generation
  // TODO: Implement actual AI provider integration
  return {
    role: "assistant",
    content: "This is a mock AI response",
    agentId: agents[0].id,
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Parse and validate incoming message
    const body = await request.json()
    const newMessage = messageSchema.parse({
      ...body,
      role: "user",
      createdAt: Date.now(),
    })

    // Fetch conversation details
    const [conversation] = await db
      .select({
        id: conversations.id,
        userId: conversations.userId,
        messages: conversations.messages,
        agentIds: conversations.agentIds,
      })
      .from(conversations)
      .where(and(eq(conversations.id, params.id), eq(conversations.userId, session.user.id)))
      .limit(1)

    if (!conversation) {
      return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 })
    }

    // Parse existing messages and agent IDs
    const existingMessages = JSON.parse(conversation.messages || "[]")
    const agentIds = JSON.parse(conversation.agentIds || "[]")

    // Fetch agents for the conversation
    const agents = await db.select().from(aiAgents).where(eq(aiAgents.userId, session.user.id))

    // Add user message to conversation
    const updatedMessages = [...existingMessages, newMessage]

    // Generate AI response
    const aiResponse = await generateAIResponse(agents, updatedMessages, "")

    // Add AI response to messages
    updatedMessages.push(aiResponse)

    // Update conversation in database
    await db
      .update(conversations)
      .set({
        messages: JSON.stringify(updatedMessages),
        updatedAt: Date.now(),
      })
      .where(eq(conversations.id, conversation.id))

    return NextResponse.json({
      success: true,
      data: {
        messages: updatedMessages,
        newMessageId: aiResponse.id,
      },
    })
  } catch (error) {
    console.error("Message generation error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to process message" },
      { status: 500 }
    )
  }
}
