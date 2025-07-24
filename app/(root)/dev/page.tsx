import Link from 'next/link'
import {ROUTES} from "@/lib/constants/routes";

export default function HomePage() {
  return (
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold mb-6">Добро пожаловать!</h1>
          <p className="text-gray-600 mb-8">
            Это демо приложение с Better Auth аутентификацией.
          </p>
          <div className="space-y-4">
            <Link
                href="/login"
                className="block w-full bg-brand text-white py-2 px-4 rounded-md hover:bg-brand-hover transition-colors"
            >
              Войти
            </Link>
            <Link
                href="/register"
                className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Зарегистрироваться
            </Link>
            <Link
                href={ROUTES.PAGES.DASHBOARD}
                className="block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Панель управления
            </Link>
            <Link
                href={ROUTES.ADMIN_PAGES.HOME}
                className="block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
  )
}