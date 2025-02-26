/**
 * The DashboardLayout component is the main layout for the dashboard pages.
 * It includes the sidebar component and the main content area.
 */
import { DashboardSidebar } from "@/app/dashboard/components/dashboard-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex">
        {/* The sidebar component */}
        <DashboardSidebar />
        {/* The main content area */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </SidebarProvider>
  )
}
