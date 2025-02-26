// components/layout/header.tsx
import Link from "next/link"
import { auth } from "@/auth"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { HeaderSearch } from "@/components/layout/header-search"
import { HeaderUserMenu } from "@/components/layout/header-user-menu"
import { HeaderNotifications } from "@/components/layout/header-notifications"
import { HeaderNewMenu } from "@/components/layout/header-new-menu"

export async function Header() {
  const session = await auth()

  return (
    <header className="border-b bg-background text-foreground shadow-sm dark:border-border/40 backrooms:border-amber-800/30 backrooms:bg-amber-50 neon:border-primary/30 neon:bg-black/90 electric:border-[hsl(var(--color-primary)/0.2)] electric:bg-[hsl(230_15%_8%)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-primary/10 text-primary rounded-md p-1">DB</span>
            <span className="hidden sm:inline-block">Deep Backrooms</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <HeaderSearch user={session?.user} />
          <ThemeToggle />

          {session?.user ? (
            <div className="flex items-center space-x-2">
              <HeaderNotifications />
              <HeaderUserMenu user={session.user} />
              <HeaderNewMenu />
            </div>
          ) : (
            <Link href="/auth/signin">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
