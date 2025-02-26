// components/layout/footer.tsx
import Link from "next/link"
import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-6 bg-background text-foreground dark:border-border/40 dark:bg-gray-950 backrooms:border-amber-800/30 backrooms:bg-amber-50 neon:border-primary/20 neon:bg-black electric:border-[hsl(var(--color-primary)/0.2)] electric:bg-[hsl(230_15%_6%)]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Deep Backrooms
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              href="/docs/installation"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Installation
            </Link>
            <Link
              href="/docs/providers-agents"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Providers & Agents
            </Link>
            <a
              href="https://github.com/codingbutter/deep-backrooms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
