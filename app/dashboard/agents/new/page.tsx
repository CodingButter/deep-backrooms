// app/dashboard/agents/new/page.tsx
import { auth } from "@/auth"
import { aiAgents, db } from "@/db/schema"
import { eq } from "drizzle-orm"

export const metadata = {
  title: "Manage Agents - Deep Backrooms",
}

export default async function AgentsPage() {
  const session = await auth()

  // Fetch user's agents
  const agents = await db
    .select()
    .from(aiAgents)
    .where(eq(aiAgents.userId, session?.user?.id || ""))

  return <div className="container mx-auto px-4 py-8">{/* Page Title */}</div>
}
