// drizzle.config.ts
// drizzle.config.ts
import "@/envConfig"

import type { Config } from "drizzle-kit";
console.log({ DATABASE_URL: process.env.DATABASE_URL, TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN });
export default {
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "default_database_url",
    authToken: process.env.TURSO_AUTH_TOKEN ?? "default_auth_token",
  },
