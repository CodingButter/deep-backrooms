// app/api/agents/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/schema"
import { aiAgents, providers } from "@/db/schema"
import { insertAiAgentSchema, apiResponseSchema } from "@/zod-schema"
import { auth } from "@/auth"
import { eq } from "drizzle-orm"

/**
 * GET /api/agents
 * List all agents for the current user
 */
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const userAgents = await db.select().from(aiAgents).where(eq(aiAgents.userId, session.user.id))

    return NextResponse.json({ success: true, data: userAgents })
  } catch (error) {
    console.error("Failed to fetch agents:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch agents" }, { status: 500 })
  }
}

/**
 * POST /api/agents
 * Create a new AI agent
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const json = await request.json()
    const validatedData = insertAiAgentSchema.parse({
      ...json,
      userId: session.user.id,
    })

    // Verify that the provider exists
    const providerExists = await db
      .select({ id: providers.id })
      .from(providers)
      .where(eq(providers.id, validatedData.providerId))
      .limit(1)

    if (!providerExists.length) {
      return NextResponse.json({ success: false, error: "Provider not found" }, { status: 404 })
    }

    const [agent] = await db.insert(aiAgents).values(validatedData).returning()

    return NextResponse.json({ success: true, data: agent })
  } catch (error) {
    console.error("Failed to create agent:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: false, error: "Failed to create agent" }, { status: 500 })
  }
}
