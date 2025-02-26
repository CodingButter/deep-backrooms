// app/auth/signin/page.tsx
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { GithubIcon, Mail } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async (provider: "github" | "google") => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn(provider, {
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
      }
      // No need to handle success as redirect will happen automatically
    } catch (err) {
      console.error("Sign in error:", err)
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[hsl(var(--color-background))]">
      <div className="w-full max-w-md bg-[hsl(var(--color-card))] rounded-xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Sign In</h1>
          <p className="text-muted-foreground">Sign in to access your AI agents</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-200">{error}</div>
        )}

        <div className="space-y-4">
          <Button
            onClick={() => handleSignIn("github")}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-black text-white hover:bg-black/90"
            type="button"
          >
            <GithubIcon className="w-5 h-5 mr-2" />
            Sign in with GitHub
          </Button>

          <Button
            onClick={() => handleSignIn("google")}
            disabled={isLoading}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
            type="button"
          >
            <Mail className="w-5 h-5 mr-2" />
            Sign in with Google
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
