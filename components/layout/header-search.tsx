// components/layout/header-search.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { User } from "next-auth"
import { usePathname } from "next/navigation"

type HeaderSearchProps = {
  user?: User | null
}

export function HeaderSearch({ user }: HeaderSearchProps) {
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        event.target !== document.querySelector('[aria-label="Search"]')
      ) {
        setShowSearch(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Determine if current path is in dashboard
  const isDashboardPath = pathname.startsWith("/dashboard")

  // Only show search if user is logged in or not on dashboard
  if (!(user || !isDashboardPath)) return null

  return (
    <div className="relative">
      {showSearch ? (
        <div className="animate-in fade-in duration-200">
          <Input
            ref={searchRef}
            placeholder="Search agents, conversations..."
            className="w-64 md:w-96 pl-9"
            autoFocus
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSearch(true)}
          aria-label="Search"
          className="text-muted-foreground hover:text-foreground"
        >
          <Search className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
