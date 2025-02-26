// components/theme/theme-toggle.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { useTheme } from "@/components/theme/theme-provider"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const themeOptions = [
    { value: "light", label: "Light", icon: "☀️" },
    { value: "dark", label: "Dark", icon: "🌙" },
    { value: "backrooms", label: "Backrooms", icon: "🚪" },
    { value: "neon", label: "Neon", icon: "💜" },
    { value: "electric", label: "Electric", icon: "⚡" },
    { value: "system", label: "System", icon: "💻" },
  ]

  const currentTheme = themeOptions.find((option) => option.value === theme) || themeOptions[0]

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="relative overflow-hidden rounded-full w-10 h-10 flex items-center justify-center bg-secondary/50 backdrop-blur-sm border border-secondary-foreground/10 hover:bg-secondary/80 backrooms:border-amber-600/30 backrooms:bg-amber-100/50 neon:bg-primary/20 neon:border-primary/50 neon:hover:bg-primary/30 electric:bg-[hsl(var(--color-primary)/0.2)] electric:border-[hsl(var(--color-primary)/0.5)] electric:hover:bg-[hsl(var(--color-primary)/0.3)]"
      >
        <span className="sr-only">Toggle theme</span>
        <motion.span
          initial={{ scale: 0.8 }}
          animate={{ scale: 1, rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-lg"
        >
          {currentTheme.icon}
        </motion.span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 z-50 rounded-md shadow-lg border border-border bg-[hsl(var(--color-card))] overflow-hidden electric:shadow-[0_0_15px_rgba(138,43,226,0.3)]"
          >
            <div className="py-1" role="menu" aria-orientation="vertical">
              {themeOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{
                    backgroundColor: "rgba(138, 43, 226, 0.1)",
                    x: 4,
                  }}
                  onClick={() => {
                    setTheme(option.value as any)
                    setIsOpen(false)
                  }}
                  className={`${
                    theme === option.value ? "bg-purple-500/10 font-medium" : ""
                  } flex items-center w-full px-4 py-3 text-sm text-[hsl(var(--color-card-foreground))] transition-colors`}
                  role="menuitem"
                >
                  <span className="mr-3 text-lg">{option.icon}</span>
                  {option.label}
                  {theme === option.value && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto text-[hsl(var(--color-primary))] text-xs"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
