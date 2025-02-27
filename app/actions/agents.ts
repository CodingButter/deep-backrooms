"use server"

import { db } from "@/db/schema"
import { aiAgents, providers } from "@/db/schema"
import { insertAiAgentSchema } from "@/zod-schema"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { nanoid } from "@/lib/nanoid"
import { eq } from "drizzle-orm"
import { z } from "zod"

export type AgentFormState = {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

export async function createAgent(
  prevState: AgentFormState | null,
  formData: FormData
): Promise<AgentFormState> {
  // Check authentication
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "You must be signed in to create an agent" }
  }

  // Extract form data
  const name = formData.get("name") as string
  const providerId = formData.get("providerId") as string
  const model = formData.get("model") as string
  const systemPrompt = formData.get("systemPrompt") as string
  const avatar = (formData.get("avatar") as string) || null

  // Create agent data object
  const agentData = {
    id: nanoid(),
    userId: session.user.id,
    name,
    providerId,
    model,
    systemPrompt,
    avatar,
  }

  try {
    // Validate data using Zod schema
    const validatedData = insertAiAgentSchema.parse(agentData)

    // Verify that the provider exists - using try/catch for better Edge compatibility
    try {
      const providerExists = await db
        .select({ id: providers.id })
        .from(providers)
        .where(eq(providers.id, providerId))
        .limit(1)

      if (!providerExists.length) {
        return { success: false, message: "Selected provider not found" }
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
      return { success: false, message: "Error verifying provider" }
    }

    // Insert agent into database
    await db.insert(aiAgents).values(validatedData)

    // Return success
    return { success: true }
  } catch (error) {
    console.error("Failed to create agent:", error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}

      error.errors.forEach((err) => {
        const field = err.path[0] as string
        errors[field] = errors[field] || []
        errors[field].push(err.message)
      })

      return {
        success: false,
        message: "Validation failed",
        errors,
      }
    }

    // Generic error
    return { success: false, message: "Failed to create agent" }
  }
}
