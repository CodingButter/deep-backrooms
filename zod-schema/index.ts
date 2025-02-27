// zod-schema/index.ts
import {
  accounts,
  sessions,
  verificationTokens,
  authenticators,
  conversations,
  conversationAgents,
  users,
  providers,
  aiProviders,
  providerModels,
  agents,
} from "@/db/schema"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import * as z from "zod"

// Helper function to handle JSON strings or objects
const jsonSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([
    schema,
    z.string().transform((str, ctx) => {
      try {
        return JSON.parse(str)
      } catch (e) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid JSON string",
        })
        return z.NEVER
      }
    }),
  ])

// For "users" table
export const insertUserSchema = createInsertSchema(users, {
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),
  image: z.string().url("Profile image must be a valid URL").nullable().optional(),
  emailVerified: z.number().nullable().optional(),
})
export const selectUserSchema = createSelectSchema(users)

// For "accounts" table
export const insertAccountSchema = createInsertSchema(accounts, {
  userId: z.string().uuid("Invalid user ID format"),
  type: z.string().min(1, "Account type is required"),
  provider: z.string().min(1, "Provider is required"),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
  refresh_token: z.string().nullable().optional(),
  access_token: z.string().nullable().optional(),
  expires_at: z.number().nullable().optional(),
  token_type: z.string().nullable().optional(),
  scope: z.string().nullable().optional(),
  id_token: z.string().nullable().optional(),
  session_state: z.string().nullable().optional(),
})
export const selectAccountSchema = createSelectSchema(accounts)

export const insertSessionSchema = createInsertSchema(sessions, {
  sessionToken: z.string().min(1, "Session token is required"),
  userId: z.string().uuid("Invalid user ID format"),
  expires: z.date().min(new Date(), "Expiration date must be in the future"),
})
export const selectSessionSchema = createSelectSchema(sessions)

// For "verificationTokens" table
export const insertVerificationTokenSchema = createInsertSchema(verificationTokens, {
  identifier: z.string().min(1, "Identifier is required").email("Identifier must be a valid email"),
  token: z.string().min(1, "Token is required"),
  expires: z.number().min(Date.now(), "Expiration date must be in the future"),
})
export const selectVerificationTokenSchema = createSelectSchema(verificationTokens)

// For "authenticators" table
export const insertAuthenticatorSchema = createInsertSchema(authenticators, {
  credentialID: z.string().min(1, "Credential ID is required"),
  userId: z.string().uuid("Invalid user ID format"),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
  credentialPublicKey: z.string().min(1, "Credential public key is required"),
  counter: z.number().nonnegative("Counter must be a non-negative number"),
  credentialDeviceType: z.string().min(1, "Credential device type is required"),
  credentialBackedUp: z.boolean(),
  transports: z.string().nullable().optional(),
})
export const selectAuthenticatorSchema = createSelectSchema(authenticators)

// For "conversations" table
export const insertConversationSchema = createInsertSchema(conversations, {
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  userId: z.string().uuid("Invalid user ID format"),
  messages: z.string().transform((val, ctx) => {
    try {
      const parsed = JSON.parse(val)
      if (!Array.isArray(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Messages must be an array",
        })
        return z.NEVER
      }

      // Optional: Validate message structure if needed
      parsed.forEach((message) => {
        messageSchema.parse(message)
      })

      return parsed
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Messages must be valid JSON",
      })
      return []
    }
  }),
  agentIds: z.string().transform((val, ctx) => {
    try {
      const parsed = JSON.parse(val)
      if (!Array.isArray(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Agent IDs must be an array",
        })
        return z.NEVER
      }

      // Validate that each ID is a valid UUID
      parsed.forEach((id) => {
        if (typeof id !== "string" || !z.string().uuid().safeParse(id).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Each agent ID must be a valid UUID",
          })
        }
      })

      return parsed
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Agent IDs must be valid JSON",
      })
      return []
    }
  }),
  coverImage: z.string().url("Cover image must be a valid URL").nullable().optional(),
  updatedAt: z
    .number()
    .optional()
    .default(() => new Date().getTime()),
})
export const selectConversationSchema = createSelectSchema(conversations)

// For "conversationAgents" table
export const insertConversationAgentSchema = createInsertSchema(conversationAgents, {
  conversationId: z.string().uuid("Invalid conversation ID format"),
  agentId: z.string().uuid("Invalid agent ID format"),
})
export const selectConversationAgentSchema = createSelectSchema(conversationAgents)

// For "providers" table
export const insertProviderSchema = createInsertSchema(providers, {
  name: z
    .string()
    .min(1, "Provider name is required")
    .max(50, "Provider name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9 _-]+$/,
      "Provider name can only contain alphanumeric characters, spaces, underscores, and hyphens"
    ),
  baseUrl: z
    .string()
    .url("Base URL must be a valid URL")
    .max(255, "Base URL must be less than 255 characters")
    .refine((url) => {
      try {
        new URL(url)
        return true
      } catch (e) {
        return false
      }
    }, "Base URL must be a valid URL"),
  apiKey: z
    .string()
    .min(1, "API key is required")
    .max(1024, "API key must be less than 1024 characters"),
  organizationId: z
    .string()
    .max(255, "Organization ID must be less than 255 characters")
    .nullable()
    .optional(),
  models: z.string().transform((val, ctx) => {
    try {
      const parsed = JSON.parse(val)
      if (!Array.isArray(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Models must be an array",
        })
        return z.NEVER
      }

      // Validate each model object structure
      for (const model of parsed) {
        if (typeof model !== "object" || model === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Each model must be an object",
          })
          return z.NEVER
        }

        if (typeof model.id !== "string" || model.id.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Each model must have a non-empty string ID",
          })
          return z.NEVER
        }

        if (typeof model.name !== "string" || model.name.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Each model must have a non-empty string name",
          })
          return z.NEVER
        }
      }

      return parsed
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Models must be valid JSON",
      })
      return []
    }
  }),
  defaults: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (!val) return null
      try {
        const parsed = JSON.parse(val)
        if (typeof parsed !== "object" || parsed === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Defaults must be an object",
          })
          return z.NEVER
        }
        return parsed
      } catch (e) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Defaults must be valid JSON",
        })
        return null
      }
    }),
  rateLimits: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (!val) return null
      try {
        const parsed = JSON.parse(val)
        if (typeof parsed !== "object" || parsed === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Rate limits must be an object",
          })
          return z.NEVER
        }

        // Check for required rate limit properties
        if (typeof parsed.requestsPerMinute !== "number" || parsed.requestsPerMinute < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Rate limits must include a non-negative requestsPerMinute",
          })
          return z.NEVER
        }

        if (typeof parsed.tokensPerMinute !== "number" || parsed.tokensPerMinute < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Rate limits must include a non-negative tokensPerMinute",
          })
          return z.NEVER
        }

        return parsed
      } catch (e) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Rate limits must be valid JSON",
        })
        return null
      }
    }),
  active: z.boolean().default(true),
  createdAt: z
    .number()
    .optional()
    .default(() => new Date().getTime()),
  updatedAt: z
    .number()
    .optional()
    .default(() => new Date().getTime()),
})

export const updateProviderSchema = insertProviderSchema.partial().extend({
  id: z.string().uuid("Invalid provider ID format"),
  updatedAt: z.number().default(() => new Date().getTime()),
})

export const selectProviderSchema = createSelectSchema(providers)

// AI Providers schemas
export const insertAiProviderSchema = createInsertSchema(aiProviders, {
  name: z.string().min(1, "Provider name is required"),
  baseUrl: z.string().url("Base URL must be a valid URL"),
  apiKey: z.string().min(1, "API key is required"),
  isPrivate: z.boolean().default(false),
  userId: z.string().uuid().nullable().optional(),
  rateLimitPerMinute: z.number().int().positive().default(60),
  usageQuota: z.number().int().positive().nullable().optional(),
  status: z.enum(["active", "disabled", "degraded"]).default("active"),
  authType: z.enum(["api_key", "oauth", "custom"]).default("api_key"),
  providerType: z.enum(["llm", "image", "embedding", "multi"]).default("llm"),
  configSchema: jsonSchema(z.record(z.any())).default({}),
})
export const selectAiProviderSchema = createSelectSchema(aiProviders)
export const updateAiProviderSchema = insertAiProviderSchema.partial()

// Provider Models schemas
export const insertProviderModelSchema = createInsertSchema(providerModels, {
  providerId: z.string().uuid("Provider ID must be a valid UUID"),
  model: z.string().min(1, "Model name is required"),
  displayName: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().int().positive().default(4096),
  topP: z.number().min(0).max(1).default(1.0),
  contextWindow: z.number().int().positive().default(8192),
  rateLimit: z.number().int().positive().default(60),
  isExperimental: z.boolean().default(false),
  isDefault: z.boolean().default(false),
  capabilities: jsonSchema(z.array(z.string())).default(["chat"]),
  costPerToken: z.number().min(0).default(0),
  tokenizer: z.string().default("gpt-3.5-turbo"),
})
export const selectProviderModelSchema = createSelectSchema(providerModels)
export const updateProviderModelSchema = insertProviderModelSchema.partial()

// Agent schemas - merged from ai_agent
export const insertAgentSchema = createInsertSchema(agents, {
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  avatar: z.string().url("Avatar must be a valid URL").nullable().optional(),
  providerId: z.string().uuid("Invalid provider ID format"),
  modelId: z.string().uuid("Invalid model ID format"),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().int().positive().default(4096),
  topP: z.number().min(0).max(1).default(1.0),
  frequencyPenalty: z.number().min(-2).max(2).default(0.0),
  systemPrompt: z.string().min(1, "System prompt is required").default("You are an AI assistant."),
  persona: jsonSchema(z.record(z.any())).default({}),
  toolAccess: jsonSchema(z.array(z.string())).default([]),
  memoryEnabled: z.boolean().default(false),
  sessionLimit: z.number().int().positive().default(5),
  userId: z.string().uuid("Invalid user ID format"),
  customModelParams: jsonSchema(z.record(z.any())).default({}),
  visibilityScope: z.enum(["private", "team", "public"]).default("private"),
  version: z.string().default("1.0"),
  categoryTags: jsonSchema(z.array(z.string())).default([]),
})
export const selectAgentSchema = createSelectSchema(agents)
export const updateAgentSchema = insertAgentSchema.partial()

// Schema for validating message format
export const messageSchema = z.object({
  id: z.string().uuid("Invalid message ID format").optional(),
  role: z.enum(["user", "assistant", "system"], {
    errorMap: () => ({ message: "Role must be one of: user, assistant, system" }),
  }),
  content: z.string().min(1, "Message content is required"),
  createdAt: z
    .number()
    .optional()
    .default(() => new Date().getTime()),
  agentId: z.string().uuid("Invalid agent ID format").optional(),
})

// Schema for validating an array of messages
export const messagesArraySchema = z.array(messageSchema)

// Response Schemas
export const apiResponseSchema = z
  .object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.success === false && !data.error) {
        return false
      }
      return true
    },
    {
      message: "Error message is required when success is false",
      path: ["error"],
    }
  )

// Utility Schema for Provider Model Testing
export const testProviderConnectionSchema = z.object({
  providerId: z.string().uuid("Provider ID must be a valid UUID"),
})

// Schema for Provider Model Capabilities
export const modelCapabilitiesSchema = z.enum([
  "chat",
  "completion",
  "embedding",
  "image-generation",
  "fine-tuning",
  "function-calling",
  "vision",
  "audio-transcription",
  "audio-generation",
])
