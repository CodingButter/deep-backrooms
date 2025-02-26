import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // If user is signed in and tries to access auth pages, redirect to dashboard
  if (session && (pathname.startsWith('/auth/signin') || pathname === '/auth/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user isn't signed in and tries to access protected pages, redirect to login
  if (!session && 
      (pathname.startsWith('/dashboard') || 
       pathname.startsWith('/agents') || 
       pathname.startsWith('/providers') || 
       pathname.startsWith('/conversations') || 
       pathname.startsWith('/backrooms'))) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

// Only run middleware on pages that might need auth checks
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/agents/:path*', 
    '/providers/:path*', 
    '/conversations/:path*', 
    '/backrooms/:path*',
    '/auth/signin',
    '/auth/login'
  ],
}