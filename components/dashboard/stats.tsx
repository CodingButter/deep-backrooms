// components/dashboard/stats.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bot, MessageSquare, Building, Activity, TrendingUp, TrendingDown } from "lucide-react"
import { motion } from "framer-motion"

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 shrink-0">
      <StatsCard
        title="Agents"
        value={totalAgents}
        changeType="up"
        changeValue={12}
        icon={<Bot className="h-6 w-6 text-primary" />}
        iconBg="bg-primary/10"
      />

      <StatsCard
        title="Conversations"
        value={totalConversations}
        changeType="up"
        changeValue={8}
        icon={<MessageSquare className="h-6 w-6 text-blue-500" />}
        iconBg="bg-blue-500/10"
      />

      <StatsCard
        title="Providers"
        value={`${activeProviders}/${totalProviders}`}
        changeType="neutral"
        icon={<Building className="h-6 w-6 text-green-500" />}
        iconBg="bg-green-500/10"
      />

      <StatsCard
        title="API Usage"
        value={`${apiUsage}%`}
        changeType={apiUsage > 80 ? "down" : "up"}
        changeValue={5}
        icon={<Activity className="h-6 w-6 text-amber-500" />}
        iconBg="bg-amber-500/10"
        progressValue={apiUsage}
      />
    </div>
  )
}

type StatsCardProps = {
  title: string
  value: string | number
  changeType?: "up" | "down" | "neutral"
  changeValue?: number
  icon: React.ReactNode
  iconBg: string
  progressValue?: number
}

function StatsCard({
  title,
  value,
  changeType,
  changeValue,
  icon,
  iconBg,
  progressValue,
}: StatsCardProps) {
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden min-h-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{title}</p>
              <div className="flex items-baseline">
                <h2 className="text-3xl font-bold">{value}</h2>
                {changeType && changeValue && (
                  <span
                    className={`ml-2 flex items-center text-xs font-medium ${
                      changeType === "up"
                        ? "text-green-500"
                        : changeType === "down"
                        ? "text-red-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {changeType === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : changeType === "down" ? (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    ) : null}
                    {changeType === "up" ? "+" : changeType === "down" ? "-" : ""}
                    {changeValue}%
                  </span>
                )}
              </div>
            </div>
            <div className={`${iconBg} p-3 rounded-md`}>{icon}</div>
          </div>

          {progressValue !== undefined && (
            <div className="mt-4">
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    progressValue > 80
                      ? "bg-red-500"
                      : progressValue > 60
                      ? "bg-amber-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${progressValue}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
