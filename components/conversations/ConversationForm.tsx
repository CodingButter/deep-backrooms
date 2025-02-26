// components/conversations/ConversationForm.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Agent = {
  id: string
  name: string
  avatar?: string | null
  systemPrompt: string
}

type ConversationFormProps = {
  agents: Agent[]
}

export default function ConversationForm({ agents }: ConversationFormProps) {
  const router = useRouter()
  const [conversationName, setConversationName] = useState("")
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAgentToggle = (agentId: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate inputs
      if (!conversationName.trim()) {
        throw new Error("Conversation name is required")
      }

      if (selectedAgents.length < 2) {
        throw new Error("Select at least two agents")
      }

      // Create conversation
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: conversationName,
          agentIds: selectedAgents,
          messages: [], // Initial empty messages array
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to create conversation")
      }

      // Redirect to new conversation
      router.push(`/conversations/${data.data.id}`)
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">{error}</div>
      )}

      <div className="space-y-2">
        <label htmlFor="conversationName" className="block text-sm font-medium">
          Conversation Name
        </label>
        <Input
          id="conversationName"
          value={conversationName}
          onChange={(e) => setConversationName(e.target.value)}
          placeholder="Enter a name for your conversation"
          required
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Agents</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedAgents.includes(agent.id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-500"
              }`}
              onClick={() => handleAgentToggle(agent.id)}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedAgents.includes(agent.id)}
                  onChange={() => handleAgentToggle(agent.id)}
                  className="rounded"
                />
                <span className="font-medium">{agent.name}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{agent.systemPrompt}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/conversations")}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || selectedAgents.length < 2}>
          {isLoading ? "Creating..." : "Create Conversation"}
        </Button>
      </div>
    </form>
  )
}
