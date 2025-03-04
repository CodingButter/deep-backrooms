"use server"

import { z } from "zod"
import { db } from "@/db"
import { agents } from "@/db/schema/agentconversation"
import { insertAgentSchema } from "@/zod-schema"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Define the schema for agent creation form validation
export const agentFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  providerId: z.string().min(1, "Provider is required"),
  modelId: z.string().min(1, "Model is required"),
  systemPrompt: z.string().min(10, "System prompt must be at least 10 characters"),
  temperature: z.coerce.number().min(0).max(2).default(0.7),
  maxTokens: z.coerce.number().int().positive().default(4096),
  topP: z.coerce.number().min(0).max(1).default(1.0),
  frequencyPenalty: z.coerce.number().min(-2).max(2).default(0),
  memoryEnabled: z.boolean().default(false),
  avatar: z.string().url().optional().or(z.literal("")),
  toolAccess: z.array(z.string()).default([]),
  sessionLimit: z.coerce.number().int().positive().default(5),
  visibilityScope: z.enum(["private", "team", "public"]).default("private"),
  categoryTags: z.array(z.string()).default([]),
})

export type AgentFormValues = z.infer<typeof agentFormSchema>

export type CreateAgentState = {
  errors?: {
    name?: string[]
    description?: string[]
    providerId?: string[]
    modelId?: string[]
    systemPrompt?: string[]
    temperature?: string[]
    maxTokens?: string[]
    topP?: string[]
    frequencyPenalty?: string[]
    memoryEnabled?: string[]
    avatar?: string[]
    toolAccess?: string[]
    sessionLimit?: string[]
    visibilityScope?: string[]
    categoryTags?: string[]
    _form?: string[]
  }
  message?: string | null
}

export async function createAgent(
  userId: string,
  prevState: CreateAgentState,
  formData: FormData
): Promise<CreateAgentState> {
  // Prepare the submission data from FormData
  const rawData: Record<string, any> = {
    name: formData.get("name"),
    description: formData.get("description"),
    providerId: formData.get("providerId"),
    modelId: formData.get("modelId"),
    systemPrompt: formData.get("systemPrompt"),
    temperature: formData.get("temperature"),
    maxTokens: formData.get("maxTokens"),
    topP: formData.get("topP"),
    frequencyPenalty: formData.get("frequencyPenalty"),
    memoryEnabled: formData.get("memoryEnabled") === "true",
    avatar: formData.get("avatar"),
    sessionLimit: formData.get("sessionLimit"),
    visibilityScope: formData.get("visibilityScope"),
  }

  // Handle array values
  const toolAccessArr = formData.getAll("toolAccess")
  rawData.toolAccess = toolAccessArr.length > 0 ? toolAccessArr : []

  const categoryTagsArr = formData.getAll("categoryTags")
  rawData.categoryTags = categoryTagsArr.length > 0 ? categoryTagsArr : []

  // Validate the form data
  const validationResult = agentFormSchema.safeParse(rawData)

  if (!validationResult.success) {
    // Return validation errors
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message: "Form validation failed. Please check the form for errors.",
    }
  }

  try {
    // Prepare the agent data for insertion
    const agentData = {
      ...validationResult.data,
      userId,
      toolAccess: JSON.stringify(validationResult.data.toolAccess || []),
      categoryTags: JSON.stringify(validationResult.data.categoryTags || []),
      persona: JSON.stringify({}), // Default empty persona
      customModelParams: JSON.stringify({}), // Default empty customParams
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert the agent into the database
    await db.insert(agents).values(agentData)

    // Revalidate the agents list page
    revalidatePath("/dashboard/agents")

    // Redirect to the agents page
    redirect("/dashboard/agents")
  } catch (error) {
    console.error("Failed to create agent:", error)

    // Return a generic error message
    return {
      errors: {
        _form: ["Failed to create agent. Please try again."],
      },
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
