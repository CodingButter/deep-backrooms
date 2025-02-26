// components/dashboard-sidebar.tsx
"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, MessageSquare, Star, Folder } from "lucide-react"

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r bg-gray-50">
      <SidebarHeader className="p-4 text-lg font-bold text-gray-900">My Dashboard</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link
                  href="/dashboard"
                  className={`flex items-center px-4 py-2 text-gray-700 rounded-md transition-colors ${
                    pathname === "/dashboard"
                      ? "bg-blue-100 text-blue-900 ring-1 ring-blue-300"
                      : "hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4 inline" />
                  Dashboard
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link
                  href="/dashboard/agents"
                  className={`flex items-center px-4 py-2 text-gray-700 rounded-md transition-colors ${
                    pathname === "/dashboard/agents"
                      ? "bg-blue-100 text-blue-900 ring-1 ring-blue-300"
                      : "hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Users className="mr-2 h-4 w-4 inline" />
                  Agents
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link
                  href="/dashboard/conversations"
                  className={`flex items-center px-4 py-2 text-gray-700 rounded-md transition-colors ${
                    pathname === "/dashboard/conversations"
                      ? "bg-blue-100 text-blue-900 ring-1 ring-blue-300"
                      : "hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <MessageSquare className="mr-2 h-4 w-4 inline" />
                  Conversations
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link
                  href="/dashboard/favorites"
                  className={`flex items-center px-4 py-2 text-gray-700 rounded-md transition-colors ${
                    pathname === "/dashboard/favorites"
                      ? "bg-blue-100 text-blue-900 ring-1 ring-blue-300"
                      : "hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Star className="mr-2 h-4 w-4 inline" />
                  Favorites
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link
                  href="/dashboard/collections"
                  className={`flex items-center px-4 py-2 text-gray-700 rounded-md transition-colors ${
                    pathname === "/dashboard/collections"
                      ? "bg-blue-100 text-blue-900 ring-1 ring-blue-300"
                      : "hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Folder className="mr-2 h-4 w-4 inline" />
                  Collections
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
