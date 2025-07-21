'use server'

import { auth } from '@/lib/auth'

import { headers } from 'next/headers'
import { z } from 'zod'

// Схема валидации для входа
const LoginSchema = z.object({
    email: z.string()
        .min(1, 'Email requerido')
        .refine((val) => /\S+@\S+\.\S+/.test(val), 'Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

// Тип для результата действия
type ActionResult = {
    success: boolean
    error?: string

}

export async function loginAction(
    prevState: ActionResult | null,
    formData: FormData
): Promise<ActionResult> {
    try {
        console.log('🔐 Server: Processing login request')

        // Получаем данные из формы
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        console.log('📧 Server: Email:', email)

        // Валидируем данные
        const validatedFields = LoginSchema.safeParse({
            email,
            password,
        })

        if (!validatedFields.success) {
            console.log('❌ Server: Validation failed:', validatedFields.error.issues)
            return {
                success: false,
                error: 'Datos inválidos. Verifica email y contraseña.',
            }
        }

        // Попытка авторизации через better-auth
        try {
            const result = await auth.api.signInEmail({
                body: {
                    email: validatedFields.data.email,
                    password: validatedFields.data.password,
                },
                headers: await headers() // передаем заголовки для cookies
            })

            console.log('✅ Server: Login successful:', result)

            if (result.user) {
                return { success: true }  // <- добавить это
            } else {
                return { success: false, error: 'Email o contraseña incorrectos' }
            }

        } catch (authError: unknown) {
            console.error('❌ Server: Auth error:', authError)



            const errorObj = authError as {
                message?: string
                status?: number
                code?: string
            }

            let errorMessage = 'Error al iniciar sesión'

            if (errorObj.status === 401) {
                errorMessage = 'Email o contraseña incorrectos'
            } else if (errorObj.status === 403) {
                errorMessage = 'Acceso prohibido desde este host'
            } else if (errorObj.status === 429) {
                errorMessage = 'Demasiados intentos. Inténtalo más tarde'
            } else if (errorObj.status === 500) {
                errorMessage = 'Error del servidor. Inténtalo más tarde'
            } else if (errorObj.message?.includes('CORS') || errorObj.message?.includes('origin')) {
                errorMessage = 'Host no autorizado. Contacta al administrador'
            } else if (errorObj.message?.includes('trusted')) {
                errorMessage = 'Host no confiable. Verifica configuración'
            } else if (errorObj.message) {
                errorMessage = errorObj.message
            }

            return {
                success: false,
                error: errorMessage,
            }
        }

    } catch (error: unknown) {
        console.error('❌ Server: Unexpected error:', error)

        return {
            success: false,
            error: 'Error inesperado. Inténtalo más tarde.',
        }
    }
}