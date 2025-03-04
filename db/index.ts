import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

export function createTursoClient() {
  if (!process?.env?.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set")
  }

  return createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
}

// Validate database configuration
function validateDatabaseConfig() {
  const dbUrl = process.env.DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!dbUrl) {
    console.error("❌ DATABASE_URL is not set in the environment variables")
    throw new Error("DATABASE_URL is required")
  }

  if (!authToken) {
    console.warn("⚠️ TURSO_AUTH_TOKEN is not set. This may cause connection issues.")
  }

  return { url: dbUrl, authToken }
}

declare global {
  var tursoClient: ReturnType<typeof createClient> | null
  var db: ReturnType<typeof drizzle> | null
}

// Initialize Turso client with error handling
function initializeTursoClient() {
  try {
    const config = validateDatabaseConfig()

    const client = createTursoClient()

    return client
  } catch (error) {
    console.error("Failed to create Turso client:", error)
    throw error
  }
}

// Lazy initialization of global client and db
globalThis.tursoClient = globalThis.tursoClient ?? initializeTursoClient()
globalThis.db = globalThis.db ?? drizzle(globalThis.tursoClient)

export const db = globalThis.db || "No database connection"
