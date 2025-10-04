import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Проверяем, попадает ли путь под /admin
    const isAdminPath = pathname.startsWith('/admin')

    if (!isAdminPath) {
        // Всё остальное всегда доступно
        return NextResponse.next()
    }

    // Для /admin проверяем сессию
    const sessionCookie = getSessionCookie(request)

    if (!sessionCookie) {
        console.log('❌ No session found for:', pathname)
        return NextResponse.redirect(
            new URL("/login?redirect=" + encodeURIComponent(pathname), request.url)
        )
    }

    return NextResponse.next()
}

// Middleware срабатывает только на /admin/*
export const config = {
    matcher: ['/admin/:path*'],
}