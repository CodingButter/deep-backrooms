// components/dashboard/charts.tsx
"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Sample data for demonstration
const usageData = [
  { name: "Jan", tokens: 2400, calls: 240 },
  { name: "Feb", tokens: 1398, calls: 139 },
  { name: "Mar", tokens: 9800, calls: 980 },
  { name: "Apr", tokens: 3908, calls: 390 },
  { name: "May", tokens: 4800, calls: 480 },
  { name: "Jun", tokens: 3800, calls: 380 },
  { name: "Jul", tokens: 4300, calls: 430 },
]

const agentData = [
  { name: "Support Bot", conversations: 65, tokens: 12400 },
  { name: "Research AI", conversations: 45, tokens: 9800 },
  { name: "Creative Writer", conversations: 30, tokens: 7600 },
  { name: "Socrates", conversations: 25, tokens: 6500 },
  { name: "Nietzsche", conversations: 22, tokens: 5800 },
]

export function DashboardCharts() {
  return (
    <Tabs defaultValue="usage">
      <TabsList className="mb-4">
        <TabsTrigger value="usage">API Usage</TabsTrigger>
        <TabsTrigger value="agents">Agent Performance</TabsTrigger>
        <TabsTrigger value="conversations">Conversations</TabsTrigger>
      </TabsList>

      <TabsContent value="usage">
        <Card>
          <CardHeader>
            <CardTitle>API Usage Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="tokens" stroke="#8884d8" name="Tokens Used" />
                  <Line type="monotone" dataKey="calls" stroke="#82ca9d" name="API Calls" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="agents">
        <Card>
          <CardHeader>
            <CardTitle>Agent Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="conversations" fill="#8884d8" name="Conversations" />
                  <Bar dataKey="tokens" fill="#82ca9d" name="Tokens Used" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="conversations">
        <Card>
          <CardHeader>
            <CardTitle>Conversation Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Conversation analytics will be implemented soon.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
