import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard">Overview</Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/agents">Agents</Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/conversations">Conversations</Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/favorites">Favorites</Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/collections">Collections</Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
