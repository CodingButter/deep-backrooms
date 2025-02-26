// components/dashboard/charts.tsx
"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
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

const responseTimeData = [
  { name: "Mon", value: 1200 },
  { name: "Tue", value: 980 },
  { name: "Wed", value: 1400 },
  { name: "Thu", value: 1100 },
  { name: "Fri", value: 1700 },
  { name: "Sat", value: 800 },
  { name: "Sun", value: 600 },
]

const modelUsageData = [
  { name: "GPT-4", value: 45 },
  { name: "GPT-3.5", value: 30 },
  { name: "Claude", value: 15 },
  { name: "Other", value: 10 },
]

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"]

export function DashboardCharts() {
  return (
    <Card className="overflow-hidden border-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Usage Analytics</CardTitle>
        <CardDescription>Overview of your agents and API usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-72">
            <h3 className="text-sm font-medium mb-2">API Usage Over Time</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid rgba(0,0,0,0.1)",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tokens"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorTokens)"
                />
                <Area
                  type="monotone"
                  dataKey="calls"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorCalls)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="h-72">
            <h3 className="text-sm font-medium mb-2">Response Times (ms)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid rgba(0,0,0,0.1)",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={3}
                  dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#8884d8", stroke: "white", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="h-72">
            <h3 className="text-sm font-medium mb-2">Agent Usage</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid rgba(0,0,0,0.1)",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="conversations" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-72 flex items-center justify-center">
            <div className="w-full max-w-xs">
              <h3 className="text-sm font-medium mb-2 text-center">Model Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={modelUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {modelUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Usage"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid rgba(0,0,0,0.1)",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
