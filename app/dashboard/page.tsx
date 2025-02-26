// app/dashboard/page.tsx
import { auth } from "@/auth";
import { db } from "@/db/schema";
import { aiAgents, conversations, providers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Dashboard - Deep Backrooms"
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // Fetch user's agents
  const agents = await db
    .select()
    .from(aiAgents)
    .where(eq(aiAgents.userId, session.user.id));

  // Fetch recent conversations
  const recentConversations = await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, session.user.id))
    .orderBy(conversations.updatedAt)
    .limit(5);

  // Fetch providers
  const userProviders = await db
    .select()
    .from(providers);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {session.user.name || 'User'}
        </h1>
        <p className="text-muted-foreground">
          Explore your AI agents and conversations in the Deep Backrooms
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Agents Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Your Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Total Agents: {agents.length}
              </p>
              <div className="flex justify-between items-center">
                <Link href="/agents">
                  <Button variant="outline">Manage Agents</Button>
                </Link>
                <Link href="/agents/new">
                  <Button>Create Agent</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversations Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Total Conversations: {recentConversations.length}
              </p>
              <div className="space-y-2">
                {recentConversations.map(conversation => (
                  <div 
                    key={conversation.id} 
                    className="text-sm truncate hover:text-primary"
                  >
                    <Link href={`/conversations/${conversation.id}`}>
                      {conversation.name}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <Link href="/conversations">
                  <Button variant="outline">View All</Button>
                </Link>
                <Link href="/conversations/new">
                  <Button>New Conversation</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Providers Overview */}
        <Card>
          <CardHeader>
            <CardTitle>AI Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Total Providers: {userProviders.length}
              </p>
              <div className="space-y-2">
                {userProviders.map(provider => (
                  <div 
                    key={provider.id} 
                    className="text-sm flex justify-between items-center"
                  >
                    <span>{provider.name}</span>
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${provider.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    `}>
                      {provider.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <Link href="/providers">
                  <Button variant="outline">Manage Providers</Button>
                </Link>
                <Link href="/providers/new">
                  <Button>Add Provider</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}