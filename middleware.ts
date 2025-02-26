// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"
import routesConfig from "@/routes.config"

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Check if route is a public API route
  const isPublicApiRoute = routesConfig.apiPublicRoutes.some((route) => pathname.startsWith(route))

  // Check if route is a public route
  const isPublicRoute = routesConfig.publicRoutes.includes(pathname)

  // Check if route is an auth route
  const isAuthRoute = routesConfig.authRoutes.includes(pathname)

  // If the route is a public API route, allow access
  if (isPublicApiRoute) {
    return NextResponse.next()
  }

  // If not authenticated and trying to access a protected route
  if (!session) {
    // If it's an auth route, allow access
    if (isAuthRoute) {
      return NextResponse.next()
    }

    // If it's a public route, allow access
    if (isPublicRoute) {
      return NextResponse.next()
    }

    // Redirect to signin for protected routes
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // If authenticated and on an auth route, redirect to dashboard
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Specify routes to run middleware on
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
