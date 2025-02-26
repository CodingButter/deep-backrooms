// components/layout/header.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { User } from "next-auth"
import { Menu, User as UserIcon, X } from "lucide-react"
import { useState } from "react"

type HeaderProps = {
  user: User | undefined
}

export function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b bg-background text-foreground shadow-sm dark:border-border/40 dark:shadow-md backrooms:border-amber-800/30 backrooms:bg-amber-50 neon:border-primary/30 neon:bg-black/90 neon:shadow-[0_2px_10px_rgba(255,105,180,0.3)] electric:border-[hsl(var(--color-primary)/0.2)] electric:bg-[hsl(230_15%_8%)] electric:shadow-[0_0_10px_hsl(var(--color-primary)/0.2)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-primary/10 text-primary rounded-md p-1">DB</span>
          <span className="hidden sm:inline-block">Deep Backrooms</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {user && (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/agents"
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                Agents
              </Link>
              <Link
                href="/conversations"
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                Conversations
              </Link>
              <Link
                href="/backrooms"
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                Backrooms
              </Link>
              <Link
                href="/providers"
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                Providers
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm hidden md:inline-block text-foreground/80">
                {user.name || user.email}
              </span>
              <Link href="/auth/signout">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-foreground border-border hover:bg-primary/10 hover:text-primary"
                >
                  Sign Out
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/auth/signin">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Sign In
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden bg-transparent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-t border-border/50 bg-background p-4">
          <nav className="flex flex-col gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/agents"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Agents
            </Link>
            <Link
              href="/conversations"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Conversations
            </Link>
            <Link
              href="/backrooms"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Backrooms
            </Link>
            <Link
              href="/providers"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Providers
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
