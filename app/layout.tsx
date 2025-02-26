// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {Providers} from "@/components/providers";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deep Backrooms",
  description: "Create, customize, and pair AI agents for unique conversations",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <header className="border-b bg-background">
              <div className="container mx-auto flex items-center justify-between h-16 px-4">
                <Link href="/" className="font-bold text-xl">
                  Deep Backrooms
                </Link>
                
                <nav className="hidden md:flex items-center gap-6">
                  {user && (
                    <>
                      <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">
                        Dashboard
                      </Link>
                      <Link href="/agents" className="text-sm hover:text-primary transition-colors">
                        Agents
                      </Link>
                      <Link href="/conversations" className="text-sm hover:text-primary transition-colors">
                        Conversations
                      </Link>
                      <Link href="/backrooms" className="text-sm hover:text-primary transition-colors">
                        Backrooms
                      </Link>
                      <Link href="/providers" className="text-sm hover:text-primary transition-colors">
                        Providers
                      </Link>
                    </>
                  )}
                </nav>
                
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  
                   {user ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm hidden md:inline-block">
                        {user.name || user.email}
                      </span>
                      <Link href="/auth/signout">
                        <Button variant="outline" size="sm">Sign Out</Button>
                      </Link>
                    </div>
                  ) : (
                    <Link href="/auth/signin">
                      <Button>Sign In</Button>
                    </Link>
                  )}
                </div>
              </div>
            </header>
            
            <main className="flex-1">
              {children}
            </main>
            
            <footer className="border-t py-6 bg-background">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-muted-foreground">
                      &copy; {new Date().getFullYear()} Deep Backrooms
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <Link href="/docs/installation" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Installation
                    </Link>
                    <Link href="/docs/providers-agents" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Providers & Agents
                    </Link>
                    <a 
                      href="https://github.com/codingbutter/deep-backrooms" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}