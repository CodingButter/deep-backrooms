// db/seed.ts
import "@/envConfig"
import { aiProviders, providerModels, agents, db } from "@/db/schema/agentconversation"
import { nanoid } from "@/lib/nanoid"

// Default provider configurations
const PROVIDERS = [
  {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    apiKey: process.env.OPENAI_API_KEY || "placeholder_openai_key",
    models: [
      {
        model: "gpt-4o",
        displayName: "GPT-4o",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 4096,
        capabilities: ["chat", "completion"],
        isDefault: true,
      },
      {
        model: "o3-mini",
        displayName: "GPT-o3-Mini",
        temperature: 0.5,
        maxTokens: 8192,
        contextWindow: 8192,
        capabilities: ["chat", "completion", "function-calling"],
        isExperimental: false,
      },
    ],
  },
]

// Default agent templates
const DEFAULT_AGENTS = [
  {
    name: "Helpful Assistant",
    description: "A versatile AI assistant ready to help with a wide range of tasks",
    systemPrompt:
      "You are a helpful AI assistant. You provide clear, concise, and accurate responses to user queries. You're knowledgeable across many domains and aim to be as helpful as possible.",
    temperature: 0.7,
    toolAccess: ["web_search", "knowledge_base"],
    categoryTags: ["assistant", "productivity"],
  },
]

async function seedDatabase() {
  console.log("Starting database seeding...\n")

  try {
    await db.transaction(async (tx) => {
      console.log("Clearing existing data...")
      // Clear existing data
      await tx.delete(agents)
      await tx.delete(providerModels)
      await tx.delete(aiProviders)

      // Insert providers with their models
      for (const providerData of PROVIDERS) {
        console.log(`Inserting provider: ${providerData.name}`)

        // Insert provider
        const [provider] = await tx
          .insert(aiProviders)
          .values({
            name: providerData.name,
            baseUrl: providerData.baseUrl,
            apiKey: providerData.apiKey,
          })
          .returning()

        console.log(`Provider inserted with ID: ${provider.id}`)

        // Insert models for this provider
        const insertedModels = []
        for (const model of providerData.models) {
          console.log(`Inserting model: ${model.model}`)
          const [insertedModel] = await tx
            .insert(providerModels)
            .values({
              providerId: provider.id,
              model: model.model,
              displayName: model.displayName,
              temperature: model.temperature,
              maxTokens: model.maxTokens,
              contextWindow: model.contextWindow,
              capabilities: JSON.stringify(model.capabilities),
              isDefault: model.isDefault || false,
              isExperimental: model.isExperimental || false,
            })
            .returning()

          insertedModels.push(insertedModel)
          console.log(`Model inserted with ID: ${insertedModel.id}`)
        }

        // Insert default agents
        for (const agentData of DEFAULT_AGENTS) {
          console.log(`Inserting agent: ${agentData.name}`)

          // Use the first inserted model
          const selectedModel = insertedModels[0]
          if (!selectedModel) {
            throw new Error(`No models found for provider ${provider.name}`)
          }

          await tx.insert(agents).values({
            id: nanoid(),
            name: agentData.name,
            description: agentData.description,
            providerId: provider.id,
            modelId: selectedModel.id,
            systemPrompt: agentData.systemPrompt,
            temperature: agentData.temperature,
            avatar: null,
            toolAccess: JSON.stringify(agentData.toolAccess),
            categoryTags: JSON.stringify(agentData.categoryTags),
            userId: "00304d53-a335-4012-9caa-4bca2beab1b9", // Provided user ID
            topP: 1.0,
            frequencyPenalty: 0,
            maxTokens: 4096,
            persona: JSON.stringify({}),
            memoryEnabled: false,
            sessionLimit: 5,
            customModelParams: JSON.stringify({}),
            visibilityScope: "private",
            version: "1.0",
          })

          console.log(`Agent inserted successfully`)
        }
      }

      console.log("\nDatabase seeding completed successfully!")
    })
  } catch (error) {
    console.error("\nSeeding failed:", error)

    // Log more detailed error information
    if (error instanceof Error) {
      console.error(`Error Name: ${error.name}`)
      console.error(`Error Message: ${error.message}`)
      console.error(`Error Stack: ${error.stack}`)
    }

    throw error
  }
}

// Run the seeding script
seedDatabase().catch(console.error)

export { seedDatabase }
