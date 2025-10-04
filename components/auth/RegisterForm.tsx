'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { authClient } from '@/lib/auth-client'
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

type FormData = {
    name: string
    email: string
    password: string
}

export function RegisterForm({
                                 className,
                                 ...props
                             }: React.ComponentProps<"form">) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm<FormData>()

    const [showPassword, setShowPassword] = useState(false)

    const onSubmit = async (data: FormData) => {
        try {
            await authClient.signUp.email({
                email: data.email,
                password: data.password,
                name: data.name,
            }, {
                onSuccess: () => {
                    window.location.href = '/'
                },
                onError: (ctx) => {
                    setError('root', {
                        type: 'manual',
                        message: ctx.error.message
                    })
                },
            })
        } catch (error) {
            console.error('Register error:', error)
            setError('root', {
                type: 'manual',
                message: 'Произошла ошибка при регистрации'
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
                <h1 className="text-2xl font-bold">Crear una cuenta</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Rellena el formulario para registrarte
                </p>
            </div>

            <div className="grid gap-6">
                {errors.root && (
                    <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-md">
                        {errors.root.message}
                    </div>
                )}

                <div className="grid gap-3">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Tu nombre"
                        {...register("name", {
                            required: 'Por favor, introduce tu nombre.'
                        })}
                        className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        {...register("email", {
                            required: 'El correo electrónico es obligatorio.',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Introduce un correo electrónico válido.',
                            },
                        })}
                        className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Introduce una contraseña"
                            {...register("password", {
                                required: 'La contraseña es obligatoria.',
                                minLength: {
                                    value: 6,
                                    message: 'La contraseña debe tener al menos 6 caracteres.',
                                },
                            })}
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
                    {isSubmitting ? "Registrando..." : "Registrarse"}
                </Button>
            </div>

            <div className="text-center text-sm">
                ¿Ya tienes una cuenta? {" "}
                <Link href="/login" className="underline underline-offset-4">
                    Iniciar sesión
                </Link>
            </div>
        </form>
    )
}