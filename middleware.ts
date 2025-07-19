import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

// Определяем маршруты, которые требуют авторизации
const protectedRoutes = ['/dashboard', '/admin', '/manager']

// Определяем маршруты для разных ролей
const roleBasedRoutes = {
    admin: ['/admin'],
    manager: ['/manager', '/dashboard'],
    user: ['/dashboard']
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    
    // Проверяем, требует ли маршрут авторизации
    const isProtectedRoute = protectedRoutes.some(route => 
        pathname.startsWith(route)
    )
    
    if (!isProtectedRoute) {
        return NextResponse.next()
    }
    
    try {
        // Получаем сессию через Better Auth API
        const session = await auth.api.getSession({
            headers: request.headers
        })
        
        // Если сессии нет, редиректим на логин
        if (!session) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('callbackUrl', pathname)
            return NextResponse.redirect(loginUrl)
        }
        
        // Проверяем роль пользователя
        const userRole = session.user.role as 'user' | 'admin' | 'manager'
        
        // Проверяем доступ к админке
        if (pathname.startsWith('/admin') && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        
        // Проверяем доступ к менеджерским страницам
        if (pathname.startsWith('/manager') && userRole !== 'manager' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        
        // Проверяем общий доступ к защищенным маршрутам
        const allowedRoutes = roleBasedRoutes[userRole] || []
        const hasAccess = allowedRoutes.some(route => pathname.startsWith(route))
        
        if (!hasAccess) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        
        return NextResponse.next()
        
    } catch (error) {
        console.error('Middleware error:', error)
        // В случае ошибки перенаправляем на логин
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
    }
}

// Конфигурация middleware - указываем, на каких маршрутах он должен работать
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
}
