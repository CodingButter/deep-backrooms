// app/auth/signin/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github, Globe, LogIn } from "lucide-react";
import { cn } from "@/lib/utils"; // Utility for conditional classnames

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (provider: 'github' | 'google') => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))]">
      <div className="relative w-full max-w-md bg-[hsl(var(--color-card)/0.8)] backdrop-blur-lg border border-[hsl(var(--color-border)/0.4)] rounded-xl shadow-2xl p-8 space-y-6 
                      backrooms:border-amber-300 neon:border-primary/40 electric:border-[hsl(var(--color-primary)/0.5)] electric:shadow-[0_0_40px_rgba(var(--color-primary),0.3)]">
        
        {/* Header with animated title */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-wide mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-secondary))] 
                          backrooms:from-amber-700 backrooms:to-amber-500 neon:from-primary neon:to-secondary electric:from-[hsl(var(--color-primary))] electric:to-[hsl(var(--color-secondary))] animate-pulse">
            Deep Backrooms
          </h1>
          <p className="text-muted-foreground text-lg italic backrooms:text-amber-900 neon:text-gray-300 electric:text-[hsl(var(--color-muted-foreground))]">
            Enter the AI void. Connect. Converse. Discover.
          </p>
        </div>

        {/* Buttons with animated effects */}
        <div className="space-y-4">
          <Button 
            onClick={() => handleSignIn('github')}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-black text-white hover:bg-black/90 rounded-lg transition-transform transform-gpu hover:scale-105 shadow-lg"
          >
            <Github className="w-5 h-5 mr-2" />
            Sign in with GitHub
          </Button>

          <Button 
            onClick={() => handleSignIn('google')}
            disabled={isLoading}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 border-primary/40 rounded-lg hover:border-primary transition-transform transform-gpu hover:scale-105 shadow-md 
                        backrooms:border-amber-700/50 neon:border-primary electric:border-[hsl(var(--color-primary)/0.5)]"
          >
            <Globe className="w-5 h-5 mr-2" />
            Sign in with Google
          </Button>
        </div>

        {/* Loading animation */}
        {isLoading && (
          <div className="flex justify-center items-center pt-4">
            <LogIn className="animate-spin text-[hsl(var(--color-primary))] w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
