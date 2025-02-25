// drizzle.config.ts
import "@/envConfig"

import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;