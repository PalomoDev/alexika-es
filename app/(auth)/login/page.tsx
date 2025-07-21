import LoginForm from '@/components/auth/LoginForm'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {ROUTES} from "@/lib/constants/routes";

export default async function LoginPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    // Если сессия есть, редиректим на главную
    if (session) {
        redirect(ROUTES.PAGES.HOME)
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <LoginForm/>
        </div>
    )
}