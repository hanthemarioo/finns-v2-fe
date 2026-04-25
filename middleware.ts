import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const isGuestRoute = ['/login', '/register'].some(path => pathname.startsWith(path))
    const isProtectedRoute = ['/dashboard', '/farms', '/flocks'].some(path => pathname.startsWith(path))

    const hasToken = req.cookies.get('token');

    // 1. Guest Middleware Logic
    if (isGuestRoute && hasToken) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (!hasToken && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next()
}

// 💡 Apply middleware ke semua route yang perlu login / guest check
export const config = {
    matcher: [
        '/login',
        '/register',
        '/dashboard/:path*',
        '/farms/:path*',
        '/flocks/:path*',
    ],
}
