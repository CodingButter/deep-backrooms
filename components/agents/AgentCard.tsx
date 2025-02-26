// components/agents/AgentCard.tsx
import Link from "next/link"

interface Agent {
  id: string
  name: string
  personality: string
  provider: string
}

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="agent-card">
      <h2>{agent.name}</h2>
      <p>Provider: {agent.provider}</p>
      <p>Personality: {agent.personality.substring(0, 50)}...</p>
      <Link href={`/agents/${agent.id}`}>View Details</Link>
    </div>
  )
}
