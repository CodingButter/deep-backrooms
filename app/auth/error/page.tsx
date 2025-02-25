// app/auth/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ERROR_MESSAGES: { [key: string]: string } = {
  Configuration: 'Authentication service is not configured correctly.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'Unable to verify your authentication request.',
  Default: 'An unexpected authentication error occurred.'
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get('error') || 'Default';
  const errorMessage = ERROR_MESSAGES[errorType] || ERROR_MESSAGES.Default;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-card rounded-xl shadow-xl border border-border p-8 text-center space-y-6">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-16 h-16 text-destructive" />
        </div>
        
        <h1 className="text-3xl font-bold text-destructive">Authentication Error</h1>
        
        <p className="text-muted-foreground">{errorMessage}</p>
        
        <div className="space-y-4">
          <Link href="/auth/signin">
            <Button className="w-full">
              Try Again
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="w-full">
              Return Home
            </Button>
          </Link>
        </div>
        
        <p className="text-xs text-muted-foreground">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}