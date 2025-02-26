"use client"

import { useState, useTransition } from "react"
import { Bell, Search, ChevronDown, Plus, Settings, HelpCircle, LogOut } from "lucide-react"
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
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { handleSignOut } from "@/app/actions"

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
  const [isPending, startTransition] = useTransition()

  return (
    <header className="h-16 px-4 border-b bg-background/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <SidebarTrigger className="mr-4" />

        {showSearch ? (
          <div className="relative w-64 md:w-96 animate-in fade-in duration-200">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 h-9 bg-muted/50 focus:bg-background border-muted-foreground/20 rounded-full"
              placeholder="Search agents, conversations..."
              autoFocus
              onBlur={() => setShowSearch(false)}
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(true)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
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
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notifications</span>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                Mark all as read
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-auto py-1">
              <NotificationItem
                title="New agent created"
                description="You've successfully created a new AI agent called 'Tech Support'"
                time="2 mins ago"
                isNew={true}
              />
              <NotificationItem
                title="Conversation completed"
                description="The conversation between Philosophy and Science agents has completed"
                time="1 hour ago"
                isNew={true}
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
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-9 pl-2 pr-1 border-muted-foreground/20"
            >
              <Avatar className="h-7 w-7 border border-muted-foreground/20">
                <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(user.name || user.email || "User")}
                </AvatarFallback>
              </Avatar>
              <span className="font-normal hidden md:inline-block">{user.name || "User"}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <Avatar className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/api-keys">
                  <Settings className="mr-2 h-4 w-4" />
                  API Keys
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/docs">
                <HelpCircle className="mr-2 h-4 w-4" />
                Documentation
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <form
                action={handleSignOut}
                onSubmit={(e) => {
                  startTransition(() => {
                    // Optional: Add any client-side transition logic if needed
                  })
                }}
              >
                <button type="submit" className="flex w-full items-center" disabled={isPending}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {isPending ? "Signing out..." : "Sign Out"}
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="hidden md:flex gap-2 h-9">
              <Plus className="h-4 w-4" />
              <span>Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/agents/new" className="cursor-pointer">
                <Avatar className="mr-2 h-4 w-4" />
                New Agent
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/conversations/new" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                New Conversation
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/providers/new" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                New Provider
              </Link>
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
  isNew = false,
}: {
  title: string
  description: string
  time: string
  isNew?: boolean
}) {
  return (
    <div className={`px-2 py-2 hover:bg-muted cursor-pointer ${isNew ? "bg-primary/5" : ""}`}>
      <div className="flex justify-between items-start">
        <p className="font-medium text-sm">{title}</p>
        <span className="text-xs text-muted-foreground shrink-0 ml-2">{time}</span>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      {isNew && (
        <div className="flex justify-end mt-1">
          <div className="h-2 w-2 rounded-full bg-primary"></div>
        </div>
      )}
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
