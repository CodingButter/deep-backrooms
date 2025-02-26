// components/layout/header-notifications.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

import { Bell } from "lucide-react"
import { getInitials } from "@/lib/utils"

export function HeaderNotifications() {
  return (
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
