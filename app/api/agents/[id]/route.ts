// app/api/agents/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/schema";
import { aiAgents } from "@/db/schema";
import { insertAiAgentSchema } from "@/zod-schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";

interface Params {
  params: {
    id: string;
  };
}

/**
 * GET /api/agents/[id]
 * Get an individual agent by ID
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    
    const [agent] = await db
      .select()
      .from(aiAgents)
      .where(
        and(
          eq(aiAgents.id, id),
          eq(aiAgents.userId, session.user.id)
        )
      )
      .limit(1);

    if (!agent) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: agent });
  } catch (error) {
    console.error("Failed to fetch agent:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch agent" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/agents/[id]
 * Update an existing agent
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const json = await request.json();
    
    // Omit userId from updates to prevent ownership transfer
    const { userId, ...updateData } = json;
    
    // Validate the data
    const partialSchema = insertAiAgentSchema.partial();
    const validatedData = partialSchema.parse(updateData);

    // Check if the agent exists and belongs to the user
    const [existingAgent] = await db
      .select({ id: aiAgents.id })
      .from(aiAgents)
      .where(
        and(
          eq(aiAgents.id, id),
          eq(aiAgents.userId, session.user.id)
        )
      )
      .limit(1);

    if (!existingAgent) {
      return NextResponse.json(
        { success: false, error: "Agent not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update the agent
    const [updatedAgent] = await db
      .update(aiAgents)
      .set(validatedData)
      .where(eq(aiAgents.id, id))
      .returning();

    return NextResponse.json({ success: true, data: updatedAgent });
  } catch (error) {
    console.error("Failed to update agent:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to update agent" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agents/[id]
 * Delete an agent
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    
    // Check if the agent exists and belongs to the user
    const [existingAgent] = await db
      .select({ id: aiAgents.id })
      .from(aiAgents)
      .where(
        and(
          eq(aiAgents.id, id),
          eq(aiAgents.userId, session.user.id)
        )
      )
      .limit(1);

    if (!existingAgent) {
      return NextResponse.json(
        { success: false, error: "Agent not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the agent
    await db.delete(aiAgents).where(eq(aiAgents.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete agent:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete agent" },
      { status: 500 }
    );
  }
}