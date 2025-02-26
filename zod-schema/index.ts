// zod-schema/index.ts
// ...existing code...

import {
  accounts,
  sessions,
  verificationTokens,
  authenticators,
  aiAgents,
  conversations,
  conversationAgents,
  users,
  providers,
} from "@/db/schema"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import * as z from "zod"

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

// For "aiAgents" table
export const insertAiAgentSchema = createInsertSchema(aiAgents, {
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  providerId: z.string().uuid("Invalid provider ID format"),
  model: z
    .string()
    .min(1, "Model is required")
    .max(50, "Model name must be less than 50 characters"),
  systemPrompt: z
    .string()
    .min(1, "System prompt is required")
    .max(4000, "System prompt must be less than 4000 characters"),
  avatar: z.string().url("Avatar must be a valid URL").nullable().optional(),
  userId: z.string().uuid("Invalid user ID format"),
})
export const selectAiAgentSchema = createSelectSchema(aiAgents)

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

// Helper schema for validating API responses
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

// Schema for provider authentication test
export const providerTestSchema = z.object({
  providerId: z.string().uuid("Invalid provider ID format"),
})

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
})

// Schema for validating an array of messages
export const messagesArraySchema = z.array(messageSchema)
