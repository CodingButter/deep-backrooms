// app/dashboard/page.tsx
import { auth } from "@/auth"
import { db } from "@/db/schema"
import { aiAgents, conversations, providers } from "@/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, MessageSquare, Building, Plus, BarChart3, Activity, Clock, Star } from "lucide-react"
import { DashboardStats } from "@/components/dashboard/stats"
import { DashboardCharts } from "@/components/dashboard/charts"
import { RecentConversations } from "@/components/dashboard/recent-conversations"
import { AgentCards } from "@/components/dashboard/agent-cards"

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

  // Fetch recent conversations
  const recentConversations = await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, session?.user?.id || ""))
    .orderBy(conversations.updatedAt)
    .limit(5)

  // Fetch providers
  const userProviders = await db.select().from(providers)

  // Calculate some statistics
  const totalAgents = agents.length
  const totalConversations = recentConversations.length
  const totalProviders = userProviders.length
  const activeProviders = userProviders.filter((p) => p.active).length

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session?.user?.name || "User"}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/agents/new">
              <Plus className="h-4 w-4 mr-1" />
              New Agent
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/conversations/new">
              <Plus className="h-4 w-4 mr-1" />
              New Conversation
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-md">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Agents</p>
                <h2 className="text-3xl font-bold">{totalAgents}</h2>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-md">
                <MessageSquare className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversations</p>
                <h2 className="text-3xl font-bold">{totalConversations}</h2>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500/10 p-3 rounded-md">
                <Building className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Providers</p>
                <h2 className="text-3xl font-bold">
                  {activeProviders}/{totalProviders}
                </h2>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-500/10 p-3 rounded-md">
                <Activity className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">API Usage</p>
                <h2 className="text-3xl font-bold">65%</h2>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-md">
                  {/* This would be replaced with an actual chart component */}
                  <BarChart3 className="h-10 w-10 text-muted" />
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ActivityItem
                  icon={<Bot className="h-4 w-4" />}
                  title="New agent created"
                  description="You created 'Customer Support Agent'"
                  timestamp="2 hours ago"
                />
                <ActivityItem
                  icon={<MessageSquare className="h-4 w-4" />}
                  title="Conversation started"
                  description="Between 'Socrates' and 'Aristotle'"
                  timestamp="3 hours ago"
                />
                <ActivityItem
                  icon={<Star className="h-4 w-4" />}
                  title="Conversation favorited"
                  description="You favorited 'Philosophy Debate'"
                  timestamp="1 day ago"
                />
                <ActivityItem
                  icon={<Building className="h-4 w-4" />}
                  title="Provider updated"
                  description="OpenAI API settings updated"
                  timestamp="2 days ago"
                />
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="agents">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                id={agent.id}
                name={agent.name}
                avatar={agent.avatar}
                systemPrompt={agent.systemPrompt}
                model={agent.model}
              />
            ))}
            <Card className="flex flex-col items-center justify-center border-dashed p-6 h-[220px]">
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm mb-4">Create a new agent</p>
              <Button asChild size="sm">
                <Link href="/dashboard/agents/new">Create Agent</Link>
              </Button>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="conversations">
          <div className="grid gap-4">
            {recentConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                id={conversation.id}
                name={conversation.name}
                coverImage={conversation.coverImage}
                updatedAt={conversation.updatedAt}
              />
            ))}
            <Card className="flex flex-col items-center justify-center border-dashed p-6">
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm mb-4">Start a new conversation</p>
              <Button asChild size="sm">
                <Link href="/dashboard/conversations/new">New Conversation</Link>
              </Button>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="providers">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {userProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                id={provider.id}
                name={provider.name}
                baseUrl={provider.baseUrl}
                active={Boolean(provider.active)}
              />
            ))}
            <Card className="flex flex-col items-center justify-center border-dashed p-6 h-[180px]">
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm mb-4">Add a new provider</p>
              <Button asChild size="sm">
                <Link href="/dashboard/providers/new">Add Provider</Link>
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ActivityItem({
  icon,
  title,
  description,
  timestamp,
}: {
  icon: React.ReactNode
  title: string
  description: string
  timestamp: string
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-muted p-2 rounded-full">{icon}</div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{timestamp}</p>
      </div>
    </div>
  )
}

function AgentCard({
  id,
  name,
  avatar,
  systemPrompt,
  model,
}: {
  id: string
  name: string
  avatar?: string | null
  systemPrompt: string
  model: string
}) {
  return (
    <Card className="overflow-hidden">
      <div className="h-2 bg-primary" />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <div className="bg-primary/10 p-1 rounded-md">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">Model: {model}</p>
        <p className="text-sm line-clamp-3">{systemPrompt}</p>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/agents/${id}`}>Edit</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/dashboard/agents/${id}/chat`}>Chat</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function ConversationCard({
  id,
  name,
  coverImage,
  updatedAt,
}: {
  id: string
  name: string
  coverImage?: string | null
  updatedAt?: number
}) {
  // Format the timestamp
  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown date"

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md">{name}</CardTitle>
        <div className="text-xs text-muted-foreground">{formattedDate}</div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">AI Conversation</span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button className="w-full" asChild size="sm">
          <Link href={`/dashboard/conversations/${id}`}>Open Conversation</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function ProviderCard({
  id,
  name,
  baseUrl,
  active,
}: {
  id: string
  name: string
  baseUrl: string
  active: boolean
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-500/10 p-1 rounded-md">
              <Building className="h-4 w-4 text-green-500" />
            </div>
            <span>{name}</span>
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs ${
              active ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"
            }`}
          >
            {active ? "Active" : "Inactive"}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground truncate">{baseUrl}</p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button className="w-full" variant="outline" asChild size="sm">
          <Link href={`/dashboard/providers/${id}`}>Manage Provider</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
