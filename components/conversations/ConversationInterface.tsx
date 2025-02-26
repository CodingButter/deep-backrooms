// components/conversations/ConversationInterface.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { messageSchema } from "@/zod-schema"
import { z } from "zod"

type Message = z.infer<typeof messageSchema>

type Agent = {
  id: string
  name: string
  avatar?: string | null
  providerId: string
  model: string
  systemPrompt: string
}

type ConversationInterfaceProps = {
  conversationId: string
  initialMessages: Message[]
  agents: Agent[]
  conversationName: string
  coverImage?: string | null
}

export default function ConversationInterface({
  conversationId,
  initialMessages,
  agents,
  conversationName,
  coverImage,
}: ConversationInterfaceProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    // TODO: Implement message sending logic
    // This will involve:
    // 1. Creating a new user message
    // 2. Calling API to generate agent responses
    // 3. Updating conversation messages
  }

  const renderMessages = () => {
    return messages.map((message, index) => {
      const agent =
        message.role === "user"
          ? { name: "You", avatar: null }
          : agents.find((a) => a.id === message.agentId)

      return (
        <div
          key={index}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
        >
          <div className="flex items-start space-x-2">
            {message.role !== "user" && agent?.avatar && (
              <Image
                src={agent.avatar}
                alt={agent.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div
              className={`p-3 rounded-lg max-w-md ${
                message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-background border-b p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {coverImage && (
            <Image
              src={coverImage}
              alt={conversationName}
              width={50}
              height={50}
              className="rounded"
            />
          )}
          <h1 className="text-xl font-semibold">{conversationName}</h1>
        </div>
        <Button variant="outline" onClick={() => router.push("/conversations")}>
          Back to Conversations
        </Button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 conversation-container">
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="border-t p-4 bg-background">
        <div className="flex space-x-2">
          <div className="flex-1">
            {/* TODO: Add message input component */}
            <textarea placeholder="Type a message..." className="w-full rounded-lg border p-2" />
          </div>
          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  )
}
