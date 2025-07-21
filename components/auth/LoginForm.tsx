'use client'

import {useState, useActionState, useEffect} from 'react'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { loginAction } from '@/lib/actions/auth.action'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'

export default function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect') || '/dashboard'

    // React 19 useActionState для обработки server action
    const [state, formAction, isPending] = useActionState(loginAction, null)

    const validateEmail = (email: string) => {
        if (!email.trim()) {
            setEmailError('Por favor, introduce tu correo electrónico')
            return false
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Por favor, introduce un correo electrónico válido')
            return false
        }
        setEmailError('')
        return true
    }

    const validatePassword = (password: string) => {
        if (!password) {
            setPasswordError('Por favor, introduce tu contraseña')
            return false
        }
        if (password.length < 8) {
            setPasswordError('La contraseña debe tener al menos 8 caracteres')
            return false
        }
        setPasswordError('')
        return true
    }

    // useEffect для редиректа после server action
    useEffect(() => {
        if (state?.success) {
            router.push('/dev')
        }
    }, [state?.success, router])

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)
        if (emailError) {
            validateEmail(value)
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPassword(value)
        if (passwordError) {
            validatePassword(value)
        }
    }

    const handleSubmit = (formData: FormData) => {
        // Клиентская валидация перед отправкой
        const emailValue = formData.get('email') as string
        const passwordValue = formData.get('password') as string

        const isEmailValid = validateEmail(emailValue)
        const isPasswordValid = validatePassword(passwordValue)

        if (!isEmailValid || !isPasswordValid) {
            return // Не отправляем форму если валидация не прошла
        }

        // Добавляем redirect параметр
        formData.set('redirect', redirectTo)

        // Вызываем server action
        formAction(formData)
    }

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Заголовок с градиентом */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-brand to-brand-hover bg-clip-text text-transparent">
                    Bienvenido
                </h1>
                <p className="text-muted-foreground mt-2">
                    Inicia sesión en tu cuenta
                </p>
            </div>

            {/* Основная форма */}
            <div className="bg-card border border-border rounded-xl shadow-lg p-8 backdrop-blur-sm">
                {/* Сообщение об ошибке от server action */}
                {state?.error && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-center gap-3 animate-in fade-in duration-300">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span className="text-sm">{state.error}</span>
                    </div>
                )}

                <form action={handleSubmit} noValidate className="space-y-6">
                    {/* Поле Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                            Correo electrónico
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                disabled={isPending}
                                className={`w-full pl-11 pr-4 py-3 bg-background border rounded-lg 
                                         focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                                         transition-all duration-200 placeholder:text-muted-foreground
                                         disabled:opacity-50 disabled:cursor-not-allowed
                                         ${emailError ? 'border-destructive' : 'border-border'}`}
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                        {emailError && (
                            <p className="text-sm text-destructive flex items-center gap-1 animate-in fade-in duration-200">
                                <AlertCircle className="w-4 h-4" />
                                {emailError}
                            </p>
                        )}
                    </div>

                    {/* Поле Пароль */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-foreground">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                disabled={isPending}
                                className={`w-full pl-11 pr-12 py-3 bg-background border rounded-lg 
                                         focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                                         transition-all duration-200 placeholder:text-muted-foreground
                                         disabled:opacity-50 disabled:cursor-not-allowed
                                         ${passwordError ? 'border-destructive' : 'border-border'}`}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isPending}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {passwordError && (
                            <p className="text-sm text-destructive flex items-center gap-1 animate-in fade-in duration-200">
                                <AlertCircle className="w-4 h-4" />
                                {passwordError}
                            </p>
                        )}
                    </div>

                    {/* Запомнить меня и забыли пароль */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                disabled={isPending}
                                className="w-4 h-4 rounded border-border text-brand focus:ring-brand focus:ring-offset-0 disabled:opacity-50"
                            />
                            <span className="text-sm text-muted-foreground">Recordarme</span>
                        </label>
                        <a
                            href="/forgot-password"
                            className="text-sm text-brand hover:text-brand-hover transition-colors"
                        >
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    {/* Кнопка входа */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-brand text-brand-foreground py-3 px-4 rounded-lg font-medium
                                 hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand
                                 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                                 disabled:transform-none"
                    >
                        {isPending ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-brand-foreground/30 border-t-brand-foreground rounded-full animate-spin"></div>
                                Iniciando sesión...
                            </span>
                        ) : (
                            'Iniciar sesión'
                        )}
                    </button>
                </form>

                {/* Разделитель */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-card text-muted-foreground">или</span>
                    </div>
                </div>

                {/* Социальные кнопки */}
                <div className="space-y-3">
                    <button
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border rounded-lg
                                 hover:bg-accent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continuar con Google
                    </button>
                </div>

                {/* Ссылка на регистрацию */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        ¿No tienes cuenta?{' '}
                        <a
                            href="/register"
                            className="text-brand hover:text-brand-hover font-medium transition-colors"
                        >
                            Regístrate
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}