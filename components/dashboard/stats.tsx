// components/dashboard/stats.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bot, MessageSquare, Building, Activity } from "lucide-react"

type StatsProps = {
  totalAgents: number
  totalConversations: number
  totalProviders: number
  activeProviders: number
  apiUsage?: number
}

export function DashboardStats({
  totalAgents,
  totalConversations,
  totalProviders,
  activeProviders,
  apiUsage = 65, // Default value for demo
}: StatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <h2 className="text-3xl font-bold">{apiUsage}%</h2>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
