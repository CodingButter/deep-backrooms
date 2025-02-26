// lib/providers/openai.ts
import OpenAI from "openai"
import { messageSchema } from "@/zod-schema"

type Provider = {
  id: string
  name: string
  baseUrl: string
  apiKey: string
  organizationId?: string | null
  models: Array<{
    id: string
    name: string
  }>
  defaults?: {
    temperature?: number
    max_tokens?: number
    top_p?: number
    frequency_penalty?: number
    presence_penalty?: number
  } | null
}

type Message = {
  role: "user" | "assistant" | "system"
  content: string
}

/**
 * Creates an OpenAI client instance for a provider
 */
export function createOpenAIClient(provider: Provider): OpenAI {
  return new OpenAI({
    apiKey: provider.apiKey,
    baseURL: provider.baseUrl,
    organization: provider.organizationId || undefined,
  })
}

/**
 * Tests a provider's connection by listing models
 */
export async function testOpenAIProvider(provider: Provider): Promise<boolean> {
  try {
    const openai = createOpenAIClient(provider)
    await openai.models.list()
    return true
  } catch (error) {
    console.error("OpenAI provider test failed:", error)
    return false
  }
}

/**
 * Gets available models from the OpenAI API
 */
export async function getOpenAIModels(
  provider: Provider
): Promise<Array<{ id: string; name: string }>> {
  try {
    const openai = createOpenAIClient(provider)
    const response = await openai.models.list()

    return response.data.map((model) => ({
      id: model.id,
      name: model.id,
    }))
  } catch (error) {
    console.error("Failed to get OpenAI models:", error)
    return []
  }
}

/**
 * Sends a message to the OpenAI API and returns the response
 */
export async function sendMessageToOpenAI(
  provider: Provider,
  model: string,
  messages: Message[],
  systemPrompt?: string
): Promise<Message | null> {
  try {
    // Validate all messages
    messages.forEach((message) => {
      messageSchema.parse(message)
    })

    const openai = createOpenAIClient(provider)

    // Prepare the messages array, adding system prompt if provided
    const apiMessages = systemPrompt
      ? [{ role: "system", content: systemPrompt }, ...messages]
      : messages

    // Get default parameters or use reasonable defaults
    const defaults = provider.defaults || {}

    const response = await openai.chat.completions.create({
      model,
      messages: apiMessages,
      temperature: defaults.temperature ?? 0.7,
      max_tokens: defaults.max_tokens,
      top_p: defaults.top_p ?? 1,
      frequency_penalty: defaults.frequency_penalty ?? 0,
      presence_penalty: defaults.presence_penalty ?? 0,
    })

    if (response.choices && response.choices.length > 0) {
      const message = response.choices[0].message

      return {
        role: "assistant",
        content: message.content || "",
      }
    }

    throw new Error("No response from OpenAI API")
  } catch (error) {
    console.error("Failed to send message to OpenAI:", error)
    return null
  }
}

/**
 * Streams a message from the OpenAI API
 */
export async function streamMessageFromOpenAI(
  provider: Provider,
  model: string,
  messages: Message[],
  systemPrompt?: string,
  onChunk?: (chunk: string) => void
): Promise<Message | null> {
  try {
    // Validate all messages
    messages.forEach((message) => {
      messageSchema.parse(message)
    })

    const openai = createOpenAIClient(provider)

    // Prepare the messages array, adding system prompt if provided
    const apiMessages = systemPrompt
      ? [{ role: "system", content: systemPrompt }, ...messages]
      : messages

    // Get default parameters or use reasonable defaults
    const defaults = provider.defaults || {}

    const stream = await openai.chat.completions.create({
      model,
      messages: apiMessages,
      temperature: defaults.temperature ?? 0.7,
      max_tokens: defaults.max_tokens,
      top_p: defaults.top_p ?? 1,
      frequency_penalty: defaults.frequency_penalty ?? 0,
      presence_penalty: defaults.presence_penalty ?? 0,
      stream: true,
    })

    let fullContent = ""

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ""
      if (content) {
        fullContent += content
        if (onChunk) {
          onChunk(content)
        }
      }
    }

    return {
      role: "assistant",
      content: fullContent,
    }
  } catch (error) {
    console.error("Failed to stream message from OpenAI:", error)
    return null
  }
}
