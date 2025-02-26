// components/conversations/ConversationCard.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type Message = {
  id?: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt?: number
}

type Agent = {
  id: string
  name: string
  avatar?: string | null
}

type Conversation = {
  id: string
  name: string
  messages: Message[]
  agents: Agent[]
  coverImage?: string | null
  createdAt: number
  updatedAt: number
}

type ConversationCardProps = {
  conversation: Conversation
  onDelete?: (id: string) => Promise<void>
}

export default function ConversationCard({ conversation, onDelete }: ConversationCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get the last message that isn't a system message
  const lastMessage = [...conversation.messages]
    .reverse()
    .find((message) => message.role !== "system")

  // Format the timestamp
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleDeleteClick = () => {
    setConfirmDelete(true)
  }

  const handleCancelDelete = () => {
    setConfirmDelete(false)
  }

  const handleConfirmDelete = async () => {
    if (!onDelete) return

    setIsDeleting(true)
    setError(null)

    try {
      await onDelete(conversation.id)
      setConfirmDelete(false)
    } catch (err) {
      setError(err.message || "Failed to delete conversation")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow">
      <div className="h-32 relative bg-gradient-to-r from-gray-100 to-gray-200">
        {conversation.coverImage && (
          <Image
            src={conversation.coverImage}
            alt={conversation.name}
            fill
            style={{ objectFit: "cover" }}
          />
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg truncate pr-4">{conversation.name}</h3>
          <span className="text-xs text-gray-500">{formatDate(conversation.updatedAt)}</span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {conversation.agents.map((agent) => (
            <div
              key={agent.id}
              className="inline-flex items-center bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-xs"
            >
              {agent.avatar && (
                <div className="w-4 h-4 rounded-full overflow-hidden mr-1">
                  <Image src={agent.avatar} alt={agent.name} width={16} height={16} />
                </div>
              )}
              {agent.name}
            </div>
          ))}
        </div>

        {lastMessage && (
          <div className="mt-3 text-sm text-gray-600">
            <p className="line-clamp-2">
              <span className="font-medium">{lastMessage.role === "user" ? "You" : "AI"}: </span>
              {lastMessage.content}
            </p>
          </div>
        )}

        <div className="mt-4 pt-2 border-t flex justify-between">
          {confirmDelete ? (
            <div className="flex space-x-2 items-center">
              <span className="text-sm text-red-600">Confirm delete?</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link href={`/conversations/${conversation.id}`}>
                <Button size="sm">Open</Button>
              </Link>
              {onDelete && (
                <Button variant="outline" size="sm" onClick={handleDeleteClick}>
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>

        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      </div>
    </div>
  )
}
