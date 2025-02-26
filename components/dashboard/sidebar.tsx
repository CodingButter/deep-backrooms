// components/dashboard/sidebar.tsx
"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Folder,
  Settings,
  LogOut,
  Plus,
  Database,
  BrainCircuit,
  Bot,
  Building,
  History,
  Star,
  Activity,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { toggleSidebar } = useSidebar()

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary rounded-md p-1">
            <BrainCircuit size={24} />
          </div>
          <span className="font-bold text-lg">Deep Backrooms</span>
        </div>
        <SidebarTrigger className="md:hidden" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard" passHref legacyBehavior>
                <SidebarMenuButton isActive={pathname === "/dashboard"} tooltip="Dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link href="/dashboard/analytics" passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/analytics"}
                  tooltip="Analytics"
                >
                  <Activity />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>AI Management</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard/agents" passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={
                    pathname === "/dashboard/agents" || pathname.startsWith("/dashboard/agents/")
                  }
                  tooltip="Agents"
                >
                  <Bot />
                  <span>Agents</span>
                </SidebarMenuButton>
              </Link>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <Link href="/dashboard/agents/new" passHref legacyBehavior>
                    <SidebarMenuSubButton isActive={pathname === "/dashboard/agents/new"}>
                      <span>Create New Agent</span>
                    </SidebarMenuSubButton>
                  </Link>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <Link href="/dashboard/agents/templates" passHref legacyBehavior>
                    <SidebarMenuSubButton isActive={pathname === "/dashboard/agents/templates"}>
                      <span>Templates</span>
                    </SidebarMenuSubButton>
                  </Link>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link href="/dashboard/providers" passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={
                    pathname === "/dashboard/providers" ||
                    pathname.startsWith("/dashboard/providers/")
                  }
                  tooltip="Providers"
                >
                  <Building />
                  <span>Providers</span>
                </SidebarMenuButton>
              </Link>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <Link href="/dashboard/providers/new" passHref legacyBehavior>
                    <SidebarMenuSubButton isActive={pathname === "/dashboard/providers/new"}>
                      <span>Add Provider</span>
                    </SidebarMenuSubButton>
                  </Link>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard/conversations" passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={
                    pathname === "/dashboard/conversations" ||
                    pathname.startsWith("/dashboard/conversations/")
                  }
                  tooltip="Conversations"
                >
                  <MessageSquare />
                  <span>All Conversations</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link href="/dashboard/conversations/new" passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/conversations/new"}
                  tooltip="New Conversation"
                >
                  <Plus />
                  <span>New Conversation</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link href="/dashboard/conversations/history" passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/conversations/history"}
                  tooltip="History"
                >
                  <History />
                  <span>History</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link href="/dashboard/favorites" passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/favorites"}
                  tooltip="Favorites"
                >
                  <Star />
                  <span>Favorites</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Backrooms</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard/backrooms" passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/backrooms"}
                  tooltip="Backrooms"
                >
                  <Layers />
                  <span>Enter Backrooms</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard/settings" passHref legacyBehavior>
                <SidebarMenuButton isActive={pathname === "/dashboard/settings"} tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <Link href="/auth/signout" passHref>
            <Button variant="outline" size="sm" className="gap-2">
              <LogOut size={16} />
              <span>Sign Out</span>
            </Button>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
