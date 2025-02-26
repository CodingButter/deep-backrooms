// components/providers/index.tsx
import { ThemeProvider } from "@/components/theme/theme-provider"
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="deep-backrooms-theme">
      {children}
    </ThemeProvider>
  )
}
