// app/dashboard/layout.tsx
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader user={session.user} />
        <main className="flex-1 overflow-auto p-6 bg-background/50 backdrop-blur-sm">
          {children}
        </main>
      </div>
    </div>
  )
}
