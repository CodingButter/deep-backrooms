// lib/agents.ts
import { db } from "@/db/schema/agentconversation"

export async function getAgents(): Promise<Agent[]> {
  return await db.agent.findMany()
}
