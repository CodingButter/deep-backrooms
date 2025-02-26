// lib/env.ts
import { z } from "zod"

// Schema for environment variables
const envSchema = z.object({
  // NextAuth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),

  // OAuth Providers
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  // Database
  DATABASE_URL: z.string().min(1),
  TURSO_AUTH_TOKEN: z.string().optional(),

  // API Keys (optional)
  OPENAI_API_KEY: z.string().optional(),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

// Function to validate environment variables
export function validateEnv() {
  try {
    const env = envSchema.parse(process.env)
    return { env, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter((err) => err.code === "invalid_type" && err.received === "undefined")
        .map((err) => err.path.join("."))

      if (missingVars.length > 0) {
        console.error(`❌ Missing environment variables: ${missingVars.join(", ")}`)
      } else {
        console.error("❌ Invalid environment variables:", error.errors)
      }

      return { env: null, error }
    }

    console.error("❌ Unknown error validating environment variables:", error)
    return { env: null, error: error as Error }
  }
}

// Validate environment variables early
const { env, error } = validateEnv()
