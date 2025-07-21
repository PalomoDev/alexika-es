import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Публичные пути + статические ресурсы + API роуты Better Auth
    const publicPaths = ['/', '/login']
    const isStaticFile = pathname.startsWith('/_next/') ||
        pathname.startsWith('/images/') ||
        pathname.startsWith('/icons/') ||
        pathname.startsWith('/api/auth/') || // Better Auth API роуты
        pathname.startsWith('/.well-known/') || // Служебные файлы браузера
        pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|js|css)$/)

    if (publicPaths.includes(pathname) || isStaticFile) {
        return NextResponse.next()
    }

    // Используем официальную функцию Better Auth для проверки сессии
    const sessionCookie = getSessionCookie(request)

    if (!sessionCookie) {
        console.log('❌ No session found for:', pathname)
        return NextResponse.redirect(new URL("/login?redirect=" + encodeURIComponent(pathname), request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}