// components/dashboard/agent-cards.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Plus, PenSquare, MessageSquare } from "lucide-react"
import Link from "next/link"

type Agent = {
  id: string
  name: string
  avatar?: string | null
  providerId: string
  model: string
  systemPrompt: string
  provider?: {
    name: string
  }
}

type AgentCardsProps = {
  agents: Agent[]
}

export function AgentCards({ agents }: AgentCardsProps) {
  if (agents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your AI Agents</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Bot className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center mb-4">No agents created yet</p>
          <Button asChild>
            <Link href="/dashboard/agents/new">Create Your First Agent</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your AI Agents</h2>
        <Button asChild>
          <Link href="/dashboard/agents/new">
            <Plus className="mr-2 h-4 w-4" />
            New Agent
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  )
}

function AgentCard({ agent }: { agent: Agent }) {
  // Get the first letter of the agent name for the avatar fallback
  const avatarFallback = agent.name.charAt(0).toUpperCase()

  // Truncate the system prompt for display
  const truncatedPrompt =
    agent.systemPrompt.length > 150
      ? agent.systemPrompt.substring(0, 150) + "..."
      : agent.systemPrompt

  return (
    <Card className="overflow-hidden">
      <div className="h-2 bg-card" />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Avatar className="h-10 w-10 border-2 border-muted-foreground/10">
            <AvatarImage src={agent.avatar || undefined} alt={agent.name} />
            <AvatarFallback className="bg-primary/10 text-primary">{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
            {agent.model}
          </div>
        </div>
        <CardTitle className="mt-2">{agent.name}</CardTitle>
        <div className="text-xs text-muted-foreground">
          {agent.provider?.name || "Unknown Provider"}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{truncatedPrompt}</p>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/agents/${agent.id}`}>
            <PenSquare className="mr-1 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/dashboard/agents/${agent.id}/chat`}>
            <MessageSquare className="mr-1 h-4 w-4" />
            Chat
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
