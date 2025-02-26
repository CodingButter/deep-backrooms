// types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // NextAuth
      NEXTAUTH_URL: string
      NEXTAUTH_SECRET: string

      // OAuth Providers
      GITHUB_CLIENT_ID: string
      GITHUB_CLIENT_SECRET: string
      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string

      // Database
      DATABASE_URL: string
      TURSO_AUTH_TOKEN?: string

      // API Keys
      OPENAI_API_KEY?: string
      ANTHROPIC_API_KEY?: string

      // Deployment
      VERCEL_URL?: string
      VERCEL_ENV?: "production" | "preview" | "development"

      // Other
      NODE_ENV: "development" | "production" | "test"
    }
  }
}
