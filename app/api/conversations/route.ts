// app/api/conversations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/schema";
import { conversations, conversationAgents, aiAgents } from "@/db/schema";
import { insertConversationSchema } from "@/zod-schema";
import { auth } from "@/auth";
import { eq, and, inArray } from "drizzle-orm";

/**
 * GET /api/conversations
 * List all conversations for the current user
 */
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all conversations for the user
    const userConversations = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, session.user.id));
      
    // For each conversation, get the associated agents
    const conversationsWithAgents = await Promise.all(
      userConversations.map(async (conversation) => {
        // Get the agent IDs for this conversation
        const conversationAgentRecords = await db
          .select({ agentId: conversationAgents.agentId })
          .from(conversationAgents)
          .where(eq(conversationAgents.conversationId, conversation.id));
        
        const agentIds = conversationAgentRecords.map(record => record.agentId);
        
        // Get the agent details
        const agents = agentIds.length 
          ? await db
              .select()
              .from(aiAgents)
              .where(inArray(aiAgents.id, agentIds))
          : [];
          
        return {
          ...conversation,
          agents,
          messages: JSON.parse(conversation.messages)
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      data: conversationsWithAgents 
    });
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations
 * Create a new conversation
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const json = await request.json();
    
    // Extract agentIds from the request
    const { agentIds = [], ...conversationData } = json;
    
    // Validate conversation data
    const validatedData = insertConversationSchema.parse({
      ...conversationData,
      userId: session.user.id,
      // Ensure messages is a stringified array
      messages: typeof conversationData.messages === 'string' 
        ? conversationData.messages 
        : JSON.stringify(conversationData.messages || []),
      // Ensure agentIds is a stringified array
      agentIds: JSON.stringify(agentIds)
    });

    // Check if all agents exist and belong to the user
    if (agentIds.length > 0) {
      const agents = await db
        .select({ id: aiAgents.id })
        .from(aiAgents)
        .where(
          and(
            inArray(aiAgents.id, agentIds),
            eq(aiAgents.userId, session.user.id)
          )
        );
        
      if (agents.length !== agentIds.length) {
        return NextResponse.json(
          { success: false, error: "One or more agents not found or unauthorized" },
          { status: 404 }
        );
      }
    }

    // Start a transaction to create the conversation and agent relationships
    const [conversation] = await db.transaction(async (tx) => {
      // Create the conversation
      const [newConversation] = await tx
        .insert(conversations)
        .values(validatedData)
        .returning();
        
      // Create the conversation-agent relationships
      if (agentIds.length > 0) {
        await tx
          .insert(conversationAgents)
          .values(
            agentIds.map(agentId => ({
              conversationId: newConversation.id,
              agentId
            }))
          );
      }
      
      return [newConversation];
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        ...conversation,
        messages: JSON.parse(conversation.messages),
        agentIds: JSON.parse(conversation.agentIds)
      } 
    });
  } catch (error) {
    console.error("Failed to create conversation:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}