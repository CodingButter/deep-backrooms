// components/theme/theme-provider.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "backrooms" | "neon" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "deep-backrooms-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme

    if (savedTheme) {
      setTheme(savedTheme)
    } else if (defaultTheme === "system") {
      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    }
  }, [defaultTheme, storageKey])

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all theme classes
    root.classList.remove("light", "dark", "backrooms", "neon", "electric")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
