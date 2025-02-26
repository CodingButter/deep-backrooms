// app/dashboard/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { auth } from "@/auth"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Deep Backrooms",
  description: "Create, customize, and pair AI agents for unique conversations",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const user = session?.user

  return (
    <Providers>
      <div className="flex flex-col bg-background dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 backrooms:bg-amber-100/50 backrooms:bg-[url('/noise.png')] backrooms:bg-repeat neon:bg-black neon:bg-[radial-gradient(circle_at_center,rgba(138,43,226,0.15)_0%,transparent_70%)] electric:bg-[linear-gradient(to_bottom_right,hsl(230_15%_4%),hsl(230_15%_8%))]">
        <div className="flex-1 relative">
          {/* Ambient Theme Effects */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Dark theme subtle gradient */}
            <div className="hidden dark:block absolute inset-0 bg-gradient-to-tr from-purple-900/5 to-blue-900/5"></div>

            {/* Backrooms theme elements */}
            <div className="hidden backrooms:block absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/ceiling-light.svg')] bg-repeat-x bg-[length:400px_100px]"></div>
            </div>

            {/* Neon theme glow effects */}
            <div className="hidden neon:block absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
              <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-secondary/10 blur-3xl"></div>
            </div>

            {/* Electric theme grid */}
            <div className="hidden electric:block absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat bg-[length:50px_50px]"></div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    </Providers>
  )
}
