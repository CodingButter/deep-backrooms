// app/dashboard/conversations/[id]/page.tsx
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/db/schema"
import { conversations, conversationAgents, aiAgents } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import ConversationInterface from "@/components/conversations/ConversationInterface"

type ConversationPageProps = {
  params: {
    id: string
  }
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    return notFound()
  }

  // Fetch conversation with associated agents
  const [conversation] = await db
    .select({
      id: conversations.id,
      name: conversations.name,
      userId: conversations.userId,
      messages: conversations.messages,
      agentIds: conversations.agentIds,
      coverImage: conversations.coverImage,
    })
    .from(conversations)
    .where(and(eq(conversations.id, params.id), eq(conversations.userId, session.user.id)))
    .limit(1)

  if (!conversation) {
    return notFound()
  }

  // Fetch associated agents
  const conversationAgentRecords = await db
    .select({ agentId: conversationAgents.agentId })
    .from(conversationAgents)
    .where(eq(conversationAgents.conversationId, conversation.id))

  const agentIds = conversationAgentRecords.map((record) => record.agentId)

  const agents = agentIds.length
    ? await db.select().from(aiAgents).where(eq(aiAgents.userId, session.user.id))
    : []

  // Parse messages and agent IDs
  const parsedMessages = JSON.parse(conversation.messages || "[]")
  const parsedAgentIds = JSON.parse(conversation.agentIds || "[]")

  return (
    <ConversationInterface
      conversationId={conversation.id}
      initialMessages={parsedMessages}
      agents={agents}
      conversationName={conversation.name}
      coverImage={conversation.coverImage}
    />
  )
}

export async function generateMetadata({ params }: ConversationPageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    return { title: "Conversation Not Found" }
  }

  const [conversation] = await db
    .select({ name: conversations.name })
    .from(conversations)
    .where(and(eq(conversations.id, params.id), eq(conversations.userId, session.user.id)))
    .limit(1)

  return {
    title: conversation ? `${conversation.name} - Conversation` : "Conversation",
  }
}
