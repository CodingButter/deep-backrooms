"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Settings } from "lucide-react"

export function HeaderNewMenu() {
  return (
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
  )
}
