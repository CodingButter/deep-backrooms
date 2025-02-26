// app/dashboard/page.tsx
import { auth } from "@/auth"
import { db } from "@/db/schema"
import { aiAgents, conversations, providers } from "@/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DashboardStats } from "@/components/dashboard/stats"
import { RecentConversations } from "@/components/dashboard/recent-conversations"
import { DashboardCharts } from "@/components/dashboard/charts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Plus, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Dashboard - Deep Backrooms",
}

export default async function DashboardPage() {
  const session = await auth()

  // Fetch user's agents
  const agents = await db
    .select()
    .from(aiAgents)
    .where(eq(aiAgents.userId, session?.user?.id || ""))

  // Fetch recent conversations with pagination
  const recentConversations = await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, session?.user?.id || ""))
    .orderBy(conversations.updatedAt)
    .limit(5)

  // Fetch providers
  const userProviders = await db.select().from(providers)

  // Calculate statistics
  const totalAgents = agents.length
  const totalConversations = recentConversations.length
  const totalProviders = userProviders.length
  const activeProviders = userProviders.filter((p) => p.active).length

  // Process conversations for display
  const processedConversations = recentConversations.map((conversation) => {
    const agentIds = JSON.parse(conversation.agentIds || "[]")
    const messageArray = JSON.parse(conversation.messages || "[]")

    return {
      id: conversation.id,
      name: conversation.name,
      coverImage: conversation.coverImage,
      updatedAt: conversation.updatedAt,
      messageCount: messageArray.length,
      agents: agents
        .filter((agent) => agentIds.includes(agent.id))
        .map((agent) => ({
          id: agent.id,
          name: agent.name,
          avatar: agent.avatar,
        })),
    }
  })

  return (
    <div className="flex flex-col max-w-screen-2xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session?.user?.name || "User"}</p>
        </div>
      </div>
      <div className="space-y-8">
        <DashboardStats
          totalAgents={totalAgents}
          totalConversations={totalConversations}
          totalProviders={totalProviders}
          activeProviders={activeProviders}
          apiUsage={65} // This would be calculated from actual usage data
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="overview" className="h-full">
              <TabsList className="mb-4 bg-background/60 border">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="agents">Agents</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="min-h-[400px]">
                <DashboardCharts />
              </TabsContent>

              <TabsContent value="usage">
                <div className="rounded-lg border bg-card text-card-foreground p-6 h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Detailed usage analytics coming soon
                    </p>
                    <Button asChild variant="outline">
                      <Link href="/dashboard/analytics">
                        View Analytics
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="agents">
                <div className="rounded-lg border bg-card text-card-foreground p-6 h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Agent performance metrics coming soon
                    </p>
                    <Button asChild variant="outline">
                      <Link href="/dashboard/agents">
                        Manage Agents
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <RecentConversations conversations={processedConversations} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <ActionCard
            title="Explore Backrooms"
            description="Enter the spatial interface to explore agent conversations"
            href="/dashboard/backrooms"
            icon={
              <div className="bg-amber-500/10 p-3 rounded-md">
                <Bot className="h-6 w-6 text-amber-500" />
              </div>
            }
          />
          <ActionCard
            title="Create Agent Templates"
            description="Design reusable agent templates for quick deployment"
            href="/dashboard/agents/templates"
            icon={
              <div className="bg-blue-500/10 p-3 rounded-md">
                <Bot className="h-6 w-6 text-blue-500" />
              </div>
            }
          />
          <ActionCard
            title="Manage Providers"
            description="Configure AI providers and API connections"
            href="/dashboard/providers"
            icon={
              <div className="bg-green-500/10 p-3 rounded-md">
                <Bot className="h-6 w-6 text-green-500" />
              </div>
            }
          />
          <ActionCard
            title="View Documentation"
            description="Learn how to create effective agent interactions"
            href="/docs/providers-agents"
            icon={
              <div className="bg-purple-500/10 p-3 rounded-md">
                <Bot className="h-6 w-6 text-purple-500" />
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}

function ActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border bg-card text-card-foreground p-6 transition-all hover:shadow-md hover:-translate-y-1 flex flex-col"
    >
      <div className="flex items-start gap-4">
        {icon}
        <div className="space-y-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  )
}
