// db/schema.ts
import { integer, sqliteTable, text, primaryKey, uniqueIndex, real } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

// Create Turso client with environment variables
export const tursoClient = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

// Initialize Drizzle with the Turso client
export const db = drizzle(tursoClient)

// User table schema
export const users = sqliteTable("user", {
  id: text("id").primaryKey().notNull(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
})

// Account table schema for OAuth providers
export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
)

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})

// Verification token table schema
export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })]
)

export const conversations = sqliteTable("conversation", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  coverImage: text("coverImage"),
  messages: text("messages").notNull(), // JSON array of messages
  agentIds: text("agentIds").notNull(), // JSON array of agent IDs
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
})

export const conversationAgents = sqliteTable(
  "conversation_agent",
  {
    conversationId: text("conversationId")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    agentId: text("agentId")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.conversationId, table.agentId] })]
)

export const providers = sqliteTable("provider", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  baseUrl: text("baseUrl").notNull(),
  apiKey: text("apiKey").notNull(),
  organizationId: text("organizationId"),
  models: text("models").notNull(), // JSON array of available models
  defaults: text("defaults"), // JSON for default settings
  rateLimits: text("rateLimits"), // JSON for rate limiting info
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
})

export const authenticators = sqliteTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: integer("credentialBackedUp", { mode: "boolean" }).notNull(),
    transports: text("transports"),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.credentialID],
    }),
    uniqueIndex("authenticator_credentialID_unique").on(table.credentialID),
  ]
)

// AI Providers table
export const aiProviders = sqliteTable(
  "ai_providers",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    baseUrl: text("base_url").notNull(),
    apiKey: text("api_key").notNull(),
    isPrivate: integer("is_private", { mode: "boolean" }).notNull().default(false),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    rateLimitPerMinute: integer("rate_limit_per_minute").notNull().default(60),
    usageQuota: integer("usage_quota"),
    status: text("status", { enum: ["active", "disabled", "degraded"] })
      .notNull()
      .default("active"),
    authType: text("auth_type", { enum: ["api_key", "oauth", "custom"] })
      .notNull()
      .default("api_key"),
    providerType: text("provider_type", { enum: ["llm", "image", "embedding", "multi"] })
      .notNull()
      .default("llm"),
    configSchema: text("config_schema").default("{}"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  },
  (table) => [uniqueIndex("ai_providers_name_idx").on(table.name)]
)

// Provider Models table
export const providerModels = sqliteTable(
  "provider_models",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    providerId: text("provider_id")
      .notNull()
      .references(() => aiProviders.id, { onDelete: "cascade" }),
    model: text("model").notNull(),
    temperature: real("temperature").notNull().default(0.7),
    maxTokens: integer("max_tokens").notNull().default(4096),
    topP: real("top_p").notNull().default(1.0),
    contextWindow: integer("context_window").notNull().default(8192),
    rateLimit: integer("rate_limit").notNull().default(60),
    isExperimental: integer("is_experimental", { mode: "boolean" }).notNull().default(false),
    isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false),
    displayName: text("display_name"),
    capabilities: text("capabilities").default('["chat"]'),
    costPerToken: real("cost_per_token").default(0),
    tokenizer: text("tokenizer").default("gpt-3.5-turbo"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  },
  (table) => [uniqueIndex("model_provider_idx").on(table.providerId, table.model)]
)

// Merged agents table with fields from ai_agent
export const agents = sqliteTable(
  "agents",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    description: text("description"),
    avatar: text("avatar"), // Added from ai_agent
    providerId: text("provider_id")
      .notNull()
      .references(() => aiProviders.id, { onDelete: "cascade" }),
    modelId: text("model_id")
      .notNull()
      .references(() => providerModels.id, { onDelete: "cascade" }),
    temperature: real("temperature").notNull().default(0.7),
    maxTokens: integer("max_tokens").notNull().default(4096),
    topP: real("top_p").notNull().default(1.0),
    frequencyPenalty: real("frequency_penalty").notNull().default(0.0),
    systemPrompt: text("system_prompt").notNull().default("You are an AI assistant."),
    persona: text("persona").notNull().default("{}"),
    toolAccess: text("tool_access").notNull().default("[]"),
    memoryEnabled: integer("memory_enabled", { mode: "boolean" }).notNull().default(false),
    sessionLimit: integer("session_limit").notNull().default(5),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    customModelParams: text("custom_model_params").default("{}"),
    visibilityScope: text("visibility_scope", { enum: ["private", "team", "public"] })
      .notNull()
      .default("private"),
    version: text("version").default("1.0"),
    categoryTags: text("category_tags").default("[]"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  },
  (table) => [uniqueIndex("name_user_idx").on(table.name, table.userId)]
)

// Relations setup
export const aiProvidersRelations = relations(aiProviders, ({ many }) => ({
  models: many(providerModels),
  agents: many(agents),
}))

export const providerModelsRelations = relations(providerModels, ({ one, many }) => ({
  provider: one(aiProviders, {
    fields: [providerModels.providerId],
    references: [aiProviders.id],
  }),
  agents: many(agents),
}))

export const agentsRelations = relations(agents, ({ one, many }) => ({
  provider: one(aiProviders, {
    fields: [agents.providerId],
    references: [aiProviders.id],
  }),
  model: one(providerModels, {
    fields: [agents.modelId],
    references: [providerModels.id],
  }),
  user: one(users, {
    fields: [agents.userId],
    references: [users.id],
  }),
  conversations: many(conversationAgents, {
    relationName: "agent_conversations",
  }),
}))

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  agents: many(conversationAgents, {
    relationName: "conversation_agents",
  }),
}))

export const conversationAgentsRelations = relations(conversationAgents, ({ one }) => ({
  conversation: one(conversations, {
    fields: [conversationAgents.conversationId],
    references: [conversations.id],
    relationName: "conversation_agents",
  }),
  agent: one(agents, {
    fields: [conversationAgents.agentId],
    references: [agents.id],
    relationName: "agent_conversations",
  }),
}))

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  conversations: many(conversations),
  agents: many(agents),
}))
