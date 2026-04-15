import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const AUTH_ROUTES = ['/login']
const PUBLIC_PREFIXES = ['/auth']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  const isPublic = PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  // Let all /auth/* routes through unauthenticated (callback, confirm, etc.)
  if (isPublic) return supabaseResponse

  // Unauthenticated user on a protected route
  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Authenticated user hitting login
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
