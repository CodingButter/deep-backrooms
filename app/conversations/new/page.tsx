// app/conversations/new/page.tsx
import { auth } from "@/auth";
import { db } from "@/db/schema";
import { aiAgents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ConversationForm from "@/components/conversations/ConversationForm";

export const metadata = {
  title: "Create New Conversation"
};

export default async function NewConversationPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // Fetch user's agents
  const agents = await db
    .select()
    .from(aiAgents)
    .where(eq(aiAgents.userId, session.user.id));

  // Redirect if no agents exist
  if (agents.length < 2) {
    redirect("/agents/new");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Conversation</h1>
      <ConversationForm agents={agents} />
    </div>
  );
}