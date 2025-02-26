// components/dashboard/recent-conversations.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"

type Conversation = {
  id: string
  name: string
  coverImage?: string | null
  updatedAt?: number | null
  agents: Array<{
    id: string
    name: string
    avatar?: string | null
  }>
  messageCount?: number
}

type RecentConversationsProps = {
  conversations: Conversation[]
}

export function RecentConversations({ conversations }: RecentConversationsProps) {
  if (conversations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Conversations</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center mb-4">No conversations yet</p>
          <Button asChild>
            <Link href="/dashboard/conversations/new">Start a Conversation</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Conversations</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <ConversationItem key={conversation.id} conversation={conversation} />
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="ghost" className="w-full" asChild>
          <Link href="/dashboard/conversations">
            View All Conversations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function ConversationItem({ conversation }: { conversation: Conversation }) {
  // Format the timestamp
  const formattedDate = conversation.updatedAt
    ? new Date(conversation.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown date"

  return (
    <Link href={`/dashboard/conversations/${conversation.id}`}>
      <div className="flex items-start gap-4 p-2 rounded-md hover:bg-muted transition-colors">
        <div className="flex -space-x-2">
          {conversation.agents.slice(0, 3).map((agent, index) => (
            <Avatar key={agent.id} className="border-2 border-background h-8 w-8">
              <AvatarImage src={agent.avatar || undefined} alt={agent.name} />
              <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
          {conversation.agents.length > 3 && (
            <Avatar className="border-2 border-background h-8 w-8">
              <AvatarFallback>+{conversation.agents.length - 3}</AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
          <p className="text-muted-foreground text-xs">
            {conversation.messageCount || 0} messages • {formattedDate}
          </p>
        </div>
      </div>
    </Link>
  )
}
