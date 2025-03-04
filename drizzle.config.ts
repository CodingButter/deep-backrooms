// drizzle.config.ts
// drizzle.config.ts
import "@/envConfig"

import type { Config } from "drizzle-kit"

export default {
  schema: "./db",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "default_database_url",
    authToken: process.env.TURSO_AUTH_TOKEN ?? "default_auth_token",
  },
} satisfies Config
