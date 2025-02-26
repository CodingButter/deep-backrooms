// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";

// Export the NextAuth handler functions for API routes
export const { GET, POST } = handlers;