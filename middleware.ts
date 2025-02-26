// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Protected paths that require authentication
  const protectedPaths = ['/dashboard', '/agents', '/providers', '/conversations', '/backrooms'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // If the user is not logged in and trying to access a protected path, redirect to login
  if (!session && isProtectedPath) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // If user is logged in and trying to access sign-in page, redirect to dashboard
  if (session && pathname === '/auth/signin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Only run middleware on paths that might need authentication checks
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/agents/:path*',
    '/providers/:path*',
    '/conversations/:path*',
    '/backrooms/:path*',
    '/auth/signin'
  ],
};