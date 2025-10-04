'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/lib/validations/auth.validation"
import { authClient } from '@/lib/auth-client'
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link";
import {useState} from "react";

type LoginFormData = z.infer<typeof loginSchema>
type LoginFormProps = React.ComponentProps<'form'> & {
    redirectFrom?: string | null;
}

export function LoginForm({ className, redirectFrom, ...props }: LoginFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    })

    const [showPassword, setShowPassword] = useState(false)
    const onSubmit = async (data: LoginFormData) => {
        try {
            await authClient.signIn.email({
                email: data.email,
                password: data.password,
            }, {
                onSuccess: () => {
                    window.location.href = redirectFrom || '/'
                },
                onError: (ctx) => {
                    setError('root', {
                        type: 'manual',
                        message: ctx.error.message
                    })
                },
            })
        } catch (error) {
            console.error('Login error:', error); // Логируем для отладки
            setError('root', {
                type: 'manual',
                message: 'Произошла ошибка при входе'
            })
        }
    }

    return (
        <form
            className={cn("flex flex-col gap-6", className)}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            {...props}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Inicia sesión en tu cuenta</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Ingresa tu correo electrónico a continuación para iniciar sesión en tu cuenta
                </p>
            </div>

            <div className="grid gap-6">
                {errors.root && (
                    <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-md">
                        {errors.root.message}
                    </div>
                )}

                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        {...register("email")}
                        className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="password">Contraseña</Label>
                    <Link
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
            </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Iniciando..." : "Iniciar sesión"}
                </Button>
            </div>

            <div className="text-center text-sm">
                ¿No tienes una cuenta? {" "}
                <Link href="/register" className="underline underline-offset-4">
                    Regístrate
                </Link>
            </div>
        </form>
    )
}


