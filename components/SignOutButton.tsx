// components/SignOutButton.tsx
"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { signOut } from "@/auth"

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
    } catch (error) {
      console.error("Failed to sign out:", error)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors"
    >
      <LogOut size={16} />
      <span>{isLoading ? "Signing out..." : "Sign out"}</span>
    </button>
  )
}
