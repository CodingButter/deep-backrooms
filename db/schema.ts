// db/schema.ts
import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

// Create Turso client with environment variables
export const tursoClient = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize Drizzle with the Turso client
export const db = drizzle(tursoClient);

// User table schema
export const users = sqliteTable('user', {
  id: text('id').primaryKey().notNull(),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
});

// Account table schema for OAuth providers
export const accounts = sqliteTable('account', {
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
},
(account) => ({
  compoundKey: primaryKey({
    columns: [account.provider, account.providerAccountId],
  }),
}));

// Session table schema
export const sessions = sqliteTable('session', {
  sessionToken: text('sessionToken').primaryKey().notNull(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

// Verification token table schema
export const verificationTokens = sqliteTable('verificationToken', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
},
(vt) => ({
  compoundKey: primaryKey({
    columns: [vt.identifier, vt.token],
  }),
}));

// The rest of your schema (providers, agents, etc.)
// ...

export const aiAgents = sqliteTable("ai_agent", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatar: text("avatar"),
  providerId: text("providerId")
    .notNull()
    .references(() => providers.id, { onDelete: "cascade" }),
  model: text("model").notNull(),
  systemPrompt: text("systemPrompt").notNull(),
})

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
  // Add a JSON array of agent IDs for easy selection
  agentIds: text("agentIds").notNull(), // JSON array of agent IDs
})

export const conversationAgents = sqliteTable(
  "conversation_agent",
  {
    conversationId: text("conversationId")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    agentId: text("agentId")
      .notNull()
      .references(() => aiAgents.id, { onDelete: "cascade" }),
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
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
    .$defaultFn(() => new Date()),
})

