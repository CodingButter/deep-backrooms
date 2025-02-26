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
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
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
  Flame,
  Map,
  Crown,
  RefreshCw,
  BookOpen,
  Shield,
  ExternalLink,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/auth"

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar variant="floating" className="border-r border-border/40 shadow-sm">
        <SidebarHeader className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary rounded-md p-1.5">
              <BrainCircuit size={22} />
            </div>
            <span className="font-bold text-lg">Deep Backrooms</span>
          </div>
          <SidebarTrigger className="md:hidden" />
        </SidebarHeader>
        <SidebarSeparator />

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard" passHref legacyBehavior>
                  <SidebarMenuButton isActive={pathname === "/dashboard"} tooltip="Dashboard">
                    <LayoutDashboard className="text-primary" />
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
                    <Activity className="text-blue-500" />
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
                    <Bot className="text-green-500" />
                    <span>Agents</span>
                  </SidebarMenuButton>
                </Link>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <Link href="/dashboard/agents/new" passHref legacyBehavior>
                      <SidebarMenuSubButton isActive={pathname === "/dashboard/agents/new"}>
                        <Plus className="h-3.5 w-3.5" />
                        <span>Create New Agent</span>
                      </SidebarMenuSubButton>
                    </Link>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <Link href="/dashboard/agents/templates" passHref legacyBehavior>
                      <SidebarMenuSubButton isActive={pathname === "/dashboard/agents/templates"}>
                        <Crown className="h-3.5 w-3.5" />
                        <span>Templates</span>
                      </SidebarMenuSubButton>
                    </Link>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <Link href="/dashboard/agents/training" passHref legacyBehavior>
                      <SidebarMenuSubButton isActive={pathname === "/dashboard/agents/training"}>
                        <Flame className="h-3.5 w-3.5" />
                        <span>Training</span>
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
                    <Building className="text-purple-500" />
                    <span>Providers</span>
                  </SidebarMenuButton>
                </Link>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <Link href="/dashboard/providers/new" passHref legacyBehavior>
                      <SidebarMenuSubButton isActive={pathname === "/dashboard/providers/new"}>
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Provider</span>
                      </SidebarMenuSubButton>
                    </Link>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <Link href="/dashboard/providers/api-keys" passHref legacyBehavior>
                      <SidebarMenuSubButton isActive={pathname === "/dashboard/providers/api-keys"}>
                        <Database className="h-3.5 w-3.5" />
                        <span>API Keys</span>
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
                    <MessageSquare className="text-amber-500" />
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
                    <Plus className="text-blue-500" />
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
                    <History className="text-indigo-500" />
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
                    <Star className="text-yellow-500" />
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
                    <Layers className="text-amber-600" />
                    <span>Enter Backrooms</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/dashboard/backrooms/map" passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={pathname === "/dashboard/backrooms/map"}
                    tooltip="Map"
                  >
                    <Map className="text-amber-500" />
                    <span>Map Overview</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard/settings" passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={pathname === "/dashboard/settings"}
                    tooltip="Settings"
                  >
                    <Settings className="text-gray-500" />
                    <span>General Settings</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/dashboard/settings/security" passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={pathname === "/dashboard/settings/security"}
                    tooltip="Security"
                  >
                    <Shield className="text-red-500" />
                    <span>Security</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Help & Support</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/docs" passHref legacyBehavior>
                  <SidebarMenuButton isActive={pathname === "/docs"} tooltip="Documentation">
                    <BookOpen className="text-blue-500" />
                    <span>Documentation</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/dashboard/release-notes" passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={pathname === "/dashboard/release-notes"}
                    tooltip="Release Notes"
                  >
                    <RefreshCw className="text-green-500" />
                    <span>Release Notes</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="https://github.com/codingbutter/deep-backrooms" passHref legacyBehavior>
                  <SidebarMenuButton tooltip="GitHub">
                    <ExternalLink className="text-gray-500" />
                    <span>GitHub</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/dashboard/support" passHref legacyBehavior>
                  <SidebarMenuButton isActive={pathname === "/dashboard/support"} tooltip="Support">
                    <HelpCircle className="text-purple-500" />
                    <span>Get Support</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-border/40">
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/" })
              }}
              className="contents"
            >
              <Button type="submit" variant="outline" size="sm" className="gap-2">
                <LogOut size={16} />
                <span>Sign Out</span>
              </Button>
            </form>
          </div>
          <div className="mt-4 text-xs text-center text-muted-foreground">
            <p>Deep Backrooms v0.1.0</p>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
