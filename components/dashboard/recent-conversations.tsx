// components/dashboard/recent-conversations.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, ArrowRight, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

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
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (conversations.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-primary" />
            Recent Conversations
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <p className="text-muted-foreground text-center mb-4">No conversations yet</p>
          <Button asChild>
            <Link href="/dashboard/conversations/new">Start a Conversation</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-primary" />
          Recent Conversations
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 overflow-hidden">
        <motion.div className="space-y-2" variants={container} initial="hidden" animate="show">
          {conversations.map((conversation) => (
            <motion.div key={conversation.id} variants={item}>
              <ConversationItem conversation={conversation} />
            </motion.div>
          ))}
        </motion.div>
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

  // Split the formatted date into date and time parts
  const [datePart, timePart] = formattedDate.split(", ")

  return (
    <Link href={`/dashboard/conversations/${conversation.id}`}>
      <div className="flex items-start gap-4 p-2 rounded-md hover:bg-muted transition-colors">
        <div className="flex -space-x-2 h-10">
          {conversation.agents.slice(0, 3).map((agent, index) => (
            <Avatar
              key={agent.id}
              className={`border-2 border-background h-8 w-8 ${
                index === 0 ? "z-30" : index === 1 ? "z-20" : "z-10"
              }`}
            >
              <AvatarImage src={agent.avatar || undefined} alt={agent.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {agent.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {conversation.agents.length > 3 && (
            <Avatar className="border-2 border-background h-8 w-8 z-0">
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                +{conversation.agents.length - 3}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              <span>{conversation.messageCount || 0} messages</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{datePart}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{timePart}</span>
            </div>
          </div>
        </div>
        <div className="rounded-full h-6 w-6 bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
          <ArrowRight className="h-3 w-3 text-primary" />
        </div>
      </div>
    </Link>
  )
}
