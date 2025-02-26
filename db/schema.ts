// db/schema.ts
import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import type { AdapterAccountType } from "next-auth/adapters"
 
const client = createClient({
  url: process.env.DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN,
})
export const db = drizzle(client)
 
export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
})
 
export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
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
  (account) => [primaryKey({ columns: [account.provider, account.providerAccountId] })]
)
 
export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})
 
export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (verificationToken) => [primaryKey({
    columns: [verificationToken.identifier, verificationToken.token]
  })]
)
 
export const authenticators = sqliteTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: integer("credentialBackedUp", {
      mode: "boolean",
    }).notNull(),
    transports: text("transports"),
  },
  (authenticator) => [primaryKey({ columns: [authenticator.userId, authenticator.credentialID] })]
)

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

