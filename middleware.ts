import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
    console.log('🚀 Middleware running for:', request.nextUrl.pathname)

    const pathname = request.nextUrl.pathname

    // Публичные пути, которые доступны всем
    const publicPaths = ['/', '/login']

    // Проверяем, является ли текущий путь публичным
    const isPublicPath = publicPaths.includes(pathname)

    // Получаем cookie с токеном сессии
    const sessionToken = request.cookies.get('better-auth.session_token')

    console.log('🍪 Session token:', sessionToken ? 'найден' : 'не найден')
    console.log('🛤️  Current path:', pathname)
    console.log('🌐 Is public path:', isPublicPath)

    // Если путь публичный - пропускаем
    if (isPublicPath) {
        console.log('✅ Публичный путь - доступ разрешен')
        return NextResponse.next()
    }

    // Если нет токена сессии - редирект на логин
    if (!sessionToken) {
        console.log('❌ Нет авторизации - редирект на логин')
        const loginUrl = new URL('/login', request.url)
        // Сохраняем текущий путь для редиректа после авторизации
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    console.log('✅ Пользователь авторизован - доступ разрешен')
    return NextResponse.next()
}

export const config = {
    // Применяем middleware ко всем путям кроме:
    // - статических файлов (_next/static)
    // - изображений и других медиа
    // - API routes (опционально, если нужно защитить - убрать из исключений)
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}