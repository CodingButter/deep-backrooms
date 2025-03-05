import "@/envConfig"

// Direct database connection for seeding
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { migrate } from "drizzle-orm/libsql/migrator"
import { eq } from "drizzle-orm"
import path from "path"
import { randomUUID } from "crypto"

// Import schema
import * as userSchema from "./schema/users"
import * as agentSchema from "./schema/agentconversation"

// Create a direct database connection for the seed script
function createTursoClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in environment variables")
  }

  return createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  })
}

const client = createTursoClient()
const db = drizzle(client)

// Define fixed IDs for consistency across runs
const SAMPLE_USER_ID = "00304d53-a335-4012-9caa-4bca2beab1b9" // Use this as your user ID
const OPENAI_PROVIDER_ID = "5f321ec3-a32d-4f17-b4f4-48e94edb9c51"
const ANTHROPIC_PROVIDER_ID = "7c843e18-6d86-46d4-b5b2-91dae6a383e4"
const MISTRAL_PROVIDER_ID = "a5834a25-2faf-4ac7-abfc-5c4e7a7619d5"

// Generate a unique ID that works in Node.js environment
function nanoid(size: number = 21): string {
  return randomUUID().replace(/-/g, "").substring(0, size)
}

// Default provider configurations with realistic model listings
const PROVIDERS = [
  {
    id: OPENAI_PROVIDER_ID,
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    apiKey: process.env.OPENAI_API_KEY || "sk-placeholder-openai-key",
    models: [
      {
        model: "gpt-4o",
        displayName: "GPT-4o",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 128000,
        capabilities: ["chat", "completion", "function-calling", "vision"],
        isDefault: true,
      },
      {
        model: "gpt-4o-mini",
        displayName: "GPT-4o Mini",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 128000,
        capabilities: ["chat", "completion", "function-calling"],
        isExperimental: false,
      },
      {
        model: "gpt-3.5-turbo",
        displayName: "GPT-3.5 Turbo",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 16385,
        capabilities: ["chat", "completion", "function-calling"],
        isExperimental: false,
      },
    ],
  },
  {
    id: ANTHROPIC_PROVIDER_ID,
    name: "Anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    apiKey: process.env.ANTHROPIC_API_KEY || "sk-ant-placeholder-anthropic-key",
    models: [
      {
        model: "claude-3-opus-20240229",
        displayName: "Claude 3 Opus",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 200000,
        capabilities: ["chat", "completion", "vision"],
        isDefault: true,
      },
      {
        model: "claude-3-sonnet-20240229",
        displayName: "Claude 3 Sonnet",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 200000,
        capabilities: ["chat", "completion", "vision"],
        isExperimental: false,
      },
      {
        model: "claude-3-haiku-20240307",
        displayName: "Claude 3 Haiku",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 200000,
        capabilities: ["chat", "completion", "vision"],
        isExperimental: false,
      },
    ],
  },
  {
    id: MISTRAL_PROVIDER_ID,
    name: "Mistral AI",
    baseUrl: "https://api.mistral.ai/v1",
    apiKey: process.env.MISTRAL_API_KEY || "placeholder-mistral-key",
    models: [
      {
        model: "mistral-large-latest",
        displayName: "Mistral Large",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 32768,
        capabilities: ["chat", "completion"],
        isDefault: true,
      },
      {
        model: "mistral-medium-latest",
        displayName: "Mistral Medium",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 32768,
        capabilities: ["chat", "completion"],
        isExperimental: false,
      },
      {
        model: "mistral-small-latest",
        displayName: "Mistral Small",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 32768,
        capabilities: ["chat", "completion"],
        isExperimental: false,
      },
    ],
  },
]

// Variety of agents with detailed personalities and system prompts
const AGENTS = [
  {
    id: nanoid(),
    name: "Helpful Assistant",
    description: "A versatile AI assistant ready to help with a wide range of tasks",
    systemPrompt:
      "You are a helpful AI assistant. You provide clear, concise, and accurate responses to user queries. You're knowledgeable across many domains and aim to be as helpful as possible.",
    temperature: 0.7,
    providerId: OPENAI_PROVIDER_ID,
    toolAccess: ["web_search", "knowledge_base"],
    categoryTags: ["assistant", "productivity"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=assistant",
    visibilityScope: "private",
  },
  {
    id: nanoid(),
    name: "Socrates",
    description: "A philosophical agent that engages in Socratic dialogue",
    systemPrompt:
      "You are Socrates, the ancient Greek philosopher known for the Socratic method of questioning. You never directly answer questions, but instead ask thoughtful follow-up questions to help the human reach their own conclusions. You're deeply interested in ethics, virtue, justice, and the nature of knowledge. You speak in a thoughtful, probing manner, and often claim to know nothing while revealing the limits of others' knowledge.",
    temperature: 0.8,
    providerId: ANTHROPIC_PROVIDER_ID,
    toolAccess: [],
    categoryTags: ["philosopher", "education", "roleplay"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=socrates",
    visibilityScope: "public",
  },
  {
    id: nanoid(),
    name: "Technical Expert",
    description: "A coding and technical specialist with deep knowledge",
    systemPrompt:
      "You are a technical expert with deep knowledge in programming, computer science, and software development. You provide detailed, accurate technical information and can help debug code, explain complex technical concepts, and guide users through technical implementations. You write clean, efficient code and provide thorough explanations. You're particularly skilled with JavaScript, TypeScript, React, and Next.js.",
    temperature: 0.3,
    providerId: OPENAI_PROVIDER_ID,
    toolAccess: ["code_interpreter", "knowledge_base"],
    categoryTags: ["technical", "productivity", "education"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=expert",
    visibilityScope: "private",
  },
  {
    id: nanoid(),
    name: "Storyteller",
    description: "A creative agent specializing in narrative and storytelling",
    systemPrompt:
      "You are a master storyteller with a gift for vivid narratives and engaging characters. You can create original stories in any genre, continue existing narratives, and help users develop their own creative writing. You excel at worldbuilding, character development, plot structure, and descriptive language. You can adapt your style to match different tones, from whimsical fairy tales to gritty noir.",
    temperature: 0.9,
    providerId: ANTHROPIC_PROVIDER_ID,
    toolAccess: ["image_generation"],
    categoryTags: ["creative", "entertainment"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=storyteller",
    visibilityScope: "private",
  },
  {
    id: nanoid(),
    name: "Nietzsche",
    description: "A philosophical agent embodying Friedrich Nietzsche's perspectives",
    systemPrompt:
      "You are Friedrich Nietzsche, the 19th-century German philosopher. You communicate in a style that reflects Nietzsche's philosophical perspectives and writing style. You emphasize concepts like the will to power, the Übermensch, eternal recurrence, and the death of God. You're critical of conventional morality, especially Judeo-Christian values, which you see as stemming from ressentiment. You value strength, creativity, and the affirmation of life despite suffering. Your tone is passionate, provocative, and sometimes aphoristic.",
    temperature: 0.8,
    providerId: MISTRAL_PROVIDER_ID,
    toolAccess: [],
    categoryTags: ["philosopher", "education", "roleplay"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=nietzsche",
    visibilityScope: "public",
  },
  {
    id: nanoid(),
    name: "Project Manager",
    description: "An agent specializing in project management and organization",
    systemPrompt:
      "You are an expert project manager with deep knowledge of agile methodologies, team coordination, and productivity systems. You help users plan projects, break down complex tasks, set realistic timelines, and organize their work effectively. You're familiar with various project management tools and frameworks, and can provide advice on resolving team conflicts, managing stakeholders, and ensuring project success. You're focused on practical, actionable advice that helps people get things done efficiently.",
    temperature: 0.4,
    providerId: OPENAI_PROVIDER_ID,
    toolAccess: ["knowledge_base"],
    categoryTags: ["productivity", "business"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=manager",
    visibilityScope: "private",
  },
  {
    id: nanoid(),
    name: "Poet",
    description: "A poetic agent that specializes in verse and lyrical expression",
    systemPrompt:
      "You are a gifted poet with a deep appreciation for the beauty and power of language. You can write original poetry in various styles, from sonnets to free verse, haiku to epic poetry. You can also analyze and interpret poetry, discussing themes, techniques, and historical context. Your responses often incorporate poetic elements like metaphor, imagery, and rhythm. You have a vast knowledge of poetic traditions from around the world and throughout history.",
    temperature: 0.9,
    providerId: ANTHROPIC_PROVIDER_ID,
    toolAccess: [],
    categoryTags: ["creative", "entertainment"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=poet",
    visibilityScope: "public",
  },
  {
    id: nanoid(),
    name: "Debate Coach",
    description: "An agent that helps structure arguments and provides debate feedback",
    systemPrompt:
      "You are an experienced debate coach who helps users develop persuasive arguments, identify logical fallacies, and improve their rhetorical skills. You can take either side of a debate to help users prepare counterarguments, or provide neutral analysis of complex issues. You emphasize evidence-based reasoning, clear structure, and ethical argumentation. You can help users practice for debates, speeches, or written persuasive content.",
    temperature: 0.6,
    providerId: MISTRAL_PROVIDER_ID,
    toolAccess: ["knowledge_base"],
    categoryTags: ["education", "productivity"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=debate",
    visibilityScope: "private",
  },
]

// Sample conversations with realistic messages
const CONVERSATIONS = [
  {
    id: nanoid(),
    name: "Socrates vs. Nietzsche: Virtue and Power",
    agentIds: [
      AGENTS[1].id, // Socrates
      AGENTS[4].id, // Nietzsche
    ],
    messages: [
      {
        role: "system",
        content:
          "This is a philosophical dialogue between Socrates and Nietzsche on the nature of virtue and power.",
      },
      {
        role: "assistant",
        content:
          "What is virtue, my friend? Is it something that can be taught, or is it innate? And what relation does it have to power over others?",
        agentId: AGENTS[1].id, // Socrates
        createdAt: Date.now() - 3600000,
      },
      {
        role: "assistant",
        content:
          "Virtue? Your Athenian obsession with virtue is merely a symptom of decadence! The will to power underlies all human actions. Your 'virtue' is nothing but slave morality—a way for the weak to feel superior by vilifying the natural expressions of strength and dominance.",
        agentId: AGENTS[4].id, // Nietzsche
        createdAt: Date.now() - 3500000,
      },
      {
        role: "assistant",
        content:
          "Interesting. You speak of power with such certainty. But tell me, what is this 'will to power' of which you speak? Is it a good in itself? And if we were to find a person filled with this will to power, would we also find them to be happy?",
        agentId: AGENTS[1].id, // Socrates
        createdAt: Date.now() - 3400000,
      },
      {
        role: "assistant",
        content:
          "You misunderstand, Socrates. I do not speak of happiness as you Hellenes conceive it—that placid contentment, that absence of pain. The happiness of the herd! The will to power concerns overcoming—primarily overcoming oneself. The highest joy comes not from comfort but from conquest, from the feeling of growth and mastery. Your error is in assuming that human beings ultimately seek pleasure or tranquility. No! They seek to discharge their strength, to overcome resistance!",
        agentId: AGENTS[4].id, // Nietzsche
        createdAt: Date.now() - 3300000,
      },
    ],
  },
  // Other conversations...
]

/**
 * Ensures a user exists before seeding data
 */
async function ensureUserExists(userId: string) {
  try {
    console.log("Checking for existing user with ID:", userId)
    const existingUsers = await db
      .select()
      .from(userSchema.users)
      .where(eq(userSchema.users.id, userId))
      .limit(1)

    if (existingUsers.length === 0) {
      console.log("Creating sample user...")
      await db.insert(userSchema.users).values({
        id: userId,
        name: "Sample User",
        email: "user@example.com",
      })
      console.log(`Created user with ID: ${userId}`)
    } else {
      console.log("Using existing sample user...")
    }

    return userId
  } catch (error) {
    console.error("Error ensuring user exists:", error)
    throw error
  }
}

/**
 * Clears existing data
 */
async function clearExistingData() {
  try {
    console.log("Clearing existing data...")

    try {
      // Clear in proper order to respect foreign key constraints
      await db.delete(agentSchema.conversationAgents)
      console.log("Cleared conversation agents")
    } catch (e) {
      console.log("No conversation agents to clear or table doesn't exist yet")
    }

    try {
      await db.delete(agentSchema.conversations)
      console.log("Cleared conversations")
    } catch (e) {
      console.log("No conversations to clear or table doesn't exist yet")
    }

    try {
      await db.delete(agentSchema.agents)
      console.log("Cleared agents")
    } catch (e) {
      console.log("No agents to clear or table doesn't exist yet")
    }

    try {
      await db.delete(agentSchema.providerModels)
      console.log("Cleared provider models")
    } catch (e) {
      console.log("No provider models to clear or table doesn't exist yet")
    }

    try {
      await db.delete(agentSchema.aiProviders)
      console.log("Cleared AI providers")
    } catch (e) {
      console.log("No AI providers to clear or table doesn't exist yet")
    }

    console.log("Existing data cleared successfully")
  } catch (error) {
    console.error("Error clearing existing data:", error)
    throw error
  }
}

/**
 * Seeds providers and their models
 */
async function seedProviders() {
  try {
    console.log("Seeding providers and models...")

    // Insert each provider and its models
    for (const providerData of PROVIDERS) {
      console.log(`Inserting provider: ${providerData.name}`)

      // Insert provider
      await db.insert(agentSchema.aiProviders).values({
        id: providerData.id,
        name: providerData.name,
        baseUrl: providerData.baseUrl,
        apiKey: providerData.apiKey,
        status: "active",
        authType: "api_key",
        providerType: "llm",
        configSchema: "{}",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      console.log(`Provider inserted with ID: ${providerData.id}`)

      // Insert models for this provider
      for (const model of providerData.models) {
        console.log(`Inserting model: ${model.model}`)

        await db.insert(agentSchema.providerModels).values({
          id: nanoid(),
          providerId: providerData.id,
          model: model.model,
          displayName: model.displayName || null,
          temperature: model.temperature,
          maxTokens: model.maxTokens,
          contextWindow: model.contextWindow,
          capabilities: JSON.stringify(model.capabilities),
          isDefault: model.isDefault || false,
          isExperimental: model.isExperimental || false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        console.log(`Model inserted: ${model.model}`)
      }
    }

    console.log("Providers and models seeded successfully")
  } catch (error) {
    console.error("Error seeding providers:", error)
    throw error
  }
}

/**
 * Gets model IDs for each provider
 */
async function getModelIds() {
  try {
    const modelIds: Record<string, string> = {}

    // Get a model ID for each provider
    for (const provider of PROVIDERS) {
      const models = await db
        .select({ id: agentSchema.providerModels.id })
        .from(agentSchema.providerModels)
        .where(eq(agentSchema.providerModels.providerId, provider.id))
        .limit(1)

      if (models.length > 0) {
        modelIds[provider.id] = models[0].id
      } else {
        console.warn(`No models found for provider ${provider.id}`)
      }
    }

    return modelIds
  } catch (error) {
    console.error("Error getting model IDs:", error)
    throw error
  }
}

/**
 * Seeds agents
 */
async function seedAgents(userId: string, modelIds: Record<string, string>) {
  try {
    console.log("Seeding agents...")

    for (const agentData of AGENTS) {
      console.log(`Inserting agent: ${agentData.name}`)

      const modelId = modelIds[agentData.providerId]

      if (!modelId) {
        console.warn(
          `No model found for provider ${agentData.providerId}, skipping agent ${agentData.name}`
        )
        continue
      }

      await db.insert(agentSchema.agents).values({
        id: agentData.id,
        name: agentData.name,
        description: agentData.description,
        providerId: agentData.providerId,
        modelId: modelId,
        systemPrompt: agentData.systemPrompt,
        temperature: agentData.temperature,
        avatar: agentData.avatar,
        topP: 1.0,
        frequencyPenalty: 0,
        maxTokens: 4096,
        persona: JSON.stringify({}),
        toolAccess: JSON.stringify(agentData.toolAccess || []),
        categoryTags: JSON.stringify(agentData.categoryTags || []),
        userId: userId,
        memoryEnabled: false,
        sessionLimit: 5,
        customModelParams: JSON.stringify({}),
        visibilityScope: agentData.visibilityScope || "private",
        version: "1.0",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      console.log(`Agent inserted: ${agentData.name} (${agentData.id})`)
    }

    console.log("Agents seeded successfully")
  } catch (error) {
    console.error("Error seeding agents:", error)
    throw error
  }
}

/**
 * Seeds conversations and conversation-agent relationships
 */
async function seedConversations(userId: string) {
  try {
    console.log("Seeding conversations...")

    for (const conversationData of CONVERSATIONS) {
      console.log(`Creating conversation: ${conversationData.name}`)

      // Insert conversation
      await db.insert(agentSchema.conversations).values({
        id: conversationData.id,
        name: conversationData.name,
        userId: userId,
        messages: JSON.stringify(conversationData.messages || []),
        agentIds: JSON.stringify(conversationData.agentIds || []),
        updatedAt: new Date(),
      })

      // Create conversation-agent relationships
      for (const agentId of conversationData.agentIds) {
        await db.insert(agentSchema.conversationAgents).values({
          conversationId: conversationData.id,
          agentId: agentId,
        })

        console.log(`Linked agent ${agentId} to conversation ${conversationData.id}`)
      }

      console.log(`Conversation created: ${conversationData.name}`)
    }

    console.log("Conversations seeded successfully")
  } catch (error) {
    console.error("Error seeding conversations:", error)
    throw error
  }
}

/**
 * Run database migrations to ensure tables exist
 */
async function runMigrations() {
  console.log("Running database migrations...")

  try {
    // Define migrations path - adjust if your migrations are elsewhere
    const migrationsFolder = path.resolve(process.cwd(), "migrations")
    console.log(`Using migrations from: ${migrationsFolder}`)

    // Run migrations
    await migrate(db, { migrationsFolder })
    console.log("Migrations completed successfully")

    return true
  } catch (error) {
    console.error("Migration error:", error)
    throw error
  }
}

/**
 * Create tables manually if migrations fail
 */
async function createTablesManually() {
  console.log("Creating tables manually...")

  try {
    // We'll use the schema definitions from the schema files to create tables
    // This ensures consistency with the application's expected schema

    // Create user table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS user (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT,
        email TEXT UNIQUE,
        emailVerified INTEGER,
        image TEXT
      )
    `)
    console.log("Created user table")

    // Create AI providers table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS ai_providers (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        base_url TEXT NOT NULL,
        api_key TEXT NOT NULL,
        is_private INTEGER NOT NULL DEFAULT 0,
        user_id TEXT,
        rate_limit_per_minute INTEGER NOT NULL DEFAULT 60,
        usage_quota INTEGER,
        status TEXT NOT NULL DEFAULT 'active',
        auth_type TEXT NOT NULL DEFAULT 'api_key',
        provider_type TEXT NOT NULL DEFAULT 'llm',
        config_schema TEXT DEFAULT '{}',
        created_at INTEGER,
        updated_at INTEGER,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL
      )
    `)
    console.log("Created ai_providers table")

    // Create provider models table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS provider_models (
        id TEXT PRIMARY KEY NOT NULL,
        provider_id TEXT NOT NULL,
        model TEXT NOT NULL,
        temperature REAL NOT NULL DEFAULT 0.7,
        max_tokens INTEGER NOT NULL DEFAULT 4096,
        top_p REAL NOT NULL DEFAULT 1.0,
        context_window INTEGER NOT NULL DEFAULT 8192,
        rate_limit INTEGER NOT NULL DEFAULT 60,
        is_experimental INTEGER NOT NULL DEFAULT 0,
        is_default INTEGER NOT NULL DEFAULT 0,
        display_name TEXT,
        capabilities TEXT DEFAULT '["chat"]',
        cost_per_token REAL DEFAULT 0,
        tokenizer TEXT DEFAULT 'gpt-3.5-turbo',
        created_at INTEGER,
        updated_at INTEGER,
        FOREIGN KEY (provider_id) REFERENCES ai_providers(id) ON DELETE CASCADE,
        UNIQUE(provider_id, model)
      )
    `)
    console.log("Created provider_models table")

    // Create agents table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        avatar TEXT,
        provider_id TEXT NOT NULL,
        model_id TEXT NOT NULL,
        temperature REAL NOT NULL DEFAULT 0.7,
        max_tokens INTEGER NOT NULL DEFAULT 4096,
        top_p REAL NOT NULL DEFAULT 1.0,
        frequency_penalty REAL NOT NULL DEFAULT 0.0,
        system_prompt TEXT NOT NULL DEFAULT 'You are an AI assistant.',
        persona TEXT NOT NULL DEFAULT '{}',
        tool_access TEXT NOT NULL DEFAULT '[]',
        memory_enabled INTEGER NOT NULL DEFAULT 0,
        session_limit INTEGER NOT NULL DEFAULT 5,
        user_id TEXT NOT NULL,
        custom_model_params TEXT DEFAULT '{}',
        visibility_scope TEXT NOT NULL DEFAULT 'private',
        version TEXT DEFAULT '1.0',
        category_tags TEXT DEFAULT '[]',
        created_at INTEGER,
        updated_at INTEGER,
        FOREIGN KEY (provider_id) REFERENCES ai_providers(id) ON DELETE CASCADE,
        FOREIGN KEY (model_id) REFERENCES provider_models(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        UNIQUE(name, user_id)
      )
    `)
    console.log("Created agents table")

    // Create conversations table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS conversation (
        id TEXT PRIMARY KEY NOT NULL,
        userId TEXT NOT NULL,
        name TEXT NOT NULL,
        coverImage TEXT,
        messages TEXT NOT NULL,
        agentIds TEXT NOT NULL,
        updatedAt INTEGER,
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
      )
    `)
    console.log("Created conversation table")

    // Create conversation_agent table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS conversation_agent (
        conversationId TEXT NOT NULL,
        agentId TEXT NOT NULL,
        PRIMARY KEY (conversationId, agentId),
        FOREIGN KEY (conversationId) REFERENCES conversation(id) ON DELETE CASCADE,
        FOREIGN KEY (agentId) REFERENCES agents(id) ON DELETE CASCADE
      )
    `)
    console.log("Created conversation_agent table")

    return true
  } catch (error) {
    console.error("Error creating tables manually:", error)
    throw error
  }
}

/**
 * Main seeding function with proper error handling
 */
async function seedDatabase() {
  console.log("Starting database seeding...\n")

  try {
    // Step 0: Run migrations or create tables manually
    try {
      await runMigrations()
    } catch (migrationError) {
      console.log("Migrations failed, trying to create tables manually...")
      await createTablesManually()
    }

    // Step 1: Ensure user exists
    const userId = await ensureUserExists(SAMPLE_USER_ID)

    // Step 2: Clear existing data
    await clearExistingData()

    // Step 3: Seed providers and models
    await seedProviders()

    // Step 4: Get model IDs for each provider
    const modelIds = await getModelIds()

    // Step 5: Seed agents
    await seedAgents(userId, modelIds)

    // Step 6: Seed conversations and conversation-agent relationships
    await seedConversations(userId)

    console.log("\nDatabase seeding completed successfully!")
  } catch (error) {
    console.error("\nSeeding failed:", error)

    // Log more detailed error information
    if (error instanceof Error) {
      console.error(`Error Name: ${error.name}`)
      console.error(`Error Message: ${error.message}`)
      console.error(`Error Stack: ${error.stack}`)
    }

    throw error
  } finally {
    // Close the database connection when done
    try {
      await client.close()
      console.log("Database connection closed.")
    } catch (e) {
      console.error("Error closing database connection:", e)
    }
  }
}

// Run the seeding script if executed directly
if (require.main === module) {
  seedDatabase().catch((error) => {
    console.error("Fatal error during database seeding:", error)
    process.exit(1)
  })
}

export { seedDatabase }
