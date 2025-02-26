// components/dashboard/header.tsx
"use client"

import { useState } from "react"
import { Bell, Search, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

type User = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

type DashboardHeaderProps = {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <header className="border-b bg-background h-16 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <SidebarTrigger className="mr-4" />

        {showSearch ? (
          <div className="relative w-64 md:w-96">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8 h-9 bg-muted/50 focus:bg-background"
              placeholder="Search..."
              autoFocus
              onBlur={() => setShowSearch(false)}
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(true)}
            className="hidden md:flex"
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-auto py-1">
              <NotificationItem
                title="New agent created"
                description="You've successfully created a new AI agent called 'Tech Support'"
                time="2 mins ago"
              />
              <NotificationItem
                title="Conversation completed"
                description="The conversation between Philosophy and Science agents has completed"
                time="1 hour ago"
              />
              <NotificationItem
                title="Provider API keys updated"
                description="Your OpenAI API keys have been successfully updated"
                time="3 hours ago"
              />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/notifications"
                className="w-full text-center text-sm cursor-pointer"
              >
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                <AvatarFallback>{getInitials(user.name || user.email || "User")}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm hidden md:flex">
                <span className="font-medium">{user.name || "User"}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/api-keys">API Keys</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/billing">Billing & Usage</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/docs">Documentation</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/auth/signout">Sign Out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="hidden md:flex gap-2">
              <Plus className="h-4 w-4" />
              <span>Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/agents/new">New Agent</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/conversations/new">New Conversation</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/providers/new">New Provider</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function NotificationItem({
  title,
  description,
  time,
}: {
  title: string
  description: string
  time: string
}) {
  return (
    <div className="px-2 py-2 hover:bg-muted cursor-pointer">
      <div className="flex justify-between items-start">
        <p className="font-medium text-sm">{title}</p>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
    </div>
  )
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}
