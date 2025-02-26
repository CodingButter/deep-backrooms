// app/dashboard/conversations/new/page.tsx
import { auth } from "@/auth"
import { db } from "@/db/schema"
import { aiAgents } from "@/db/schema"
import { eq } from "drizzle-orm"
import ConversationForm from "@/components/conversations/ConversationForm"

export const metadata = {
  title: "Create New Conversation",
}

export default async function NewConversationPage() {
  const session = await auth()

  // Fetch user's agents
  const agents = await db
    .select()
    .from(aiAgents)
    .where(eq(aiAgents.userId, session?.user?.id || ""))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Conversation</h1>
      {agents.length >= 2 ? (
        <ConversationForm agents={agents} />
      ) : (
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            You need at least two agents to create a conversation.
          </p>
          <a href="/agents/new" className="text-primary hover:underline">
            Create Agents
          </a>
        </div>
      )}
    </div>
  )
}
