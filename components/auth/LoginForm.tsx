'use client'

import { authClient } from '@/lib/auth-client'

export default function LoginForm() {
    const handleSubmit = async (formData: FormData) => {
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const { data, error } = await authClient.signIn.email({
            email,
            password,
        }, {
            onSuccess: (ctx) => {
                // Редирект на дашборд после успешного входа
                window.location.href = '/dev'
            },
            onError: (ctx) => {
                // Показываем ошибку пользователю
                alert(ctx.error.message)
            },
        })
    }

    return (
        <form action={handleSubmit}>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                />
            </div>

            <div>
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                />
            </div>

            <button type="submit">
                Sign In
            </button>
        </form>
    )
}