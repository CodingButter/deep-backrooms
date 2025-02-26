// components/layout/header-user-menu.tsx
"use client"

import Link from "next/link"
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
import {
  LogOut,
  Settings,
  LayoutDashboardIcon,
  UserCircle,
  HelpCircle,
  ChevronDown,
} from "lucide-react"
import { handleSignOut } from "@/app/actions"
import { User } from "next-auth"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/utils"
import { useTransition } from "react"
type HeaderUserMenuProps = {
  user: User
}

export function HeaderUserMenu({ user }: HeaderUserMenuProps) {
  const [isPending, startTransition] = useTransition()

  return (
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
            <Link href="/dashboard">
              <LayoutDashboardIcon className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <UserCircle className="mr-2 h-4 w-4" />
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
  )
}
