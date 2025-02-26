// app/dashboard/layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Separator } from "@/components/ui/separator"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/20">
        <DashboardSidebar />
        <div className="flex flex-col flex-1">
          <DashboardHeader user={session.user} />
          <Separator />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto py-6 px-4 md:px-6">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
