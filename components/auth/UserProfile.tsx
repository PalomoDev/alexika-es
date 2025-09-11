'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import Image from "next/image"
import { User, Mail, LogOut, Edit3 } from 'lucide-react'

import {UserBase} from "@/lib/validations/product/base";
import {Button} from "@/components/ui/button";
import { useTransition } from 'react';
import {sendVerificationEmail} from "@/email";


interface UserProfileProps {
    user: UserBase
}

export default function UserProfile({ user }: UserProfileProps) {
    const { data: session, isPending } = authClient.useSession()
    const router = useRouter()
    const [isPendingVerificate, startTransition] = useTransition();
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: session?.user?.name || '',
        email: session?.user?.email || ''
    })

    const handleSignOut = async () => {
        await authClient.signOut()
        router.push('/login')
        router.refresh()
    }

    const handleEditToggle = () => {
        setIsEditing(!isEditing)
        if (!isEditing) {
            setFormData({
                name: session?.user?.name || '',
                email: session?.user?.email || ''
            })
        }
    }



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSaveChanges = async () => {
        try {
            // Здесь будет логика обновления профиля
            // await updateUserProfile(formData)
            setIsEditing(false)
            router.refresh()
        } catch (error) {
            console.error('Error updating profile:', error)
        }
    }

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <User className="w-24 h-24 text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso requerido</h2>
                <p className="text-gray-600 mb-8">Necesitas iniciar sesión para acceder a tu perfil</p>
                <a
                    href="/login"
                    className="bg-brand text-white px-6 py-3 rounded-lg hover:bg-brand-hover transition-colors"
                >
                    Iniciar sesión
                </a>
            </div>
        )
    }

    const handleSendEmail = () => {
        startTransition(async () => {
            await sendVerificationEmail({ user });
        });
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 py-8 ">
            <div className=" mx-auto px-0 ">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                {session.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name || 'Usuario'}
                                        width={120}
                                        height={120}
                                        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-gray-100"
                                    />
                                ) : (
                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-brand to-brand-hover rounded-full flex items-center justify-center border-4 border-gray-100">
                                        <span className="text-white text-2xl md:text-3xl font-bold">
                                            {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* User Info */}
                            <div>
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="text-2xl font-bold bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                                            placeholder="Tu nombre"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                            {session.user.name || 'Usuario sin nombre'}
                                        </h1>
                                        <p className="text-gray-600 flex items-center gap-2 mt-1">
                                            <Mail className="w-4 h-4" />
                                            {session.user.email}
                                        </p>
                                        {session.user.emailVerified && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-sm text-green-600">Email verificado</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSaveChanges}
                                        className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-hover transition-colors"
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        onClick={handleEditToggle}
                                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleEditToggle}
                                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Editar perfil
                                </button>
                            )}
                        </div>
                    </div>
                </div>



                {/* Account Information */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-6">Información de la cuenta</h3>
                    <div className="space-y-6">

                        {/* Email Status */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <div>
                                <p className="font-medium">Estado del email</p>
                                <p className="text-sm text-gray-600">{session.user.email}</p>
                            </div>
                            <div className="text-right">
                                {user.emailVerified ? (
                                    <span className="text-sm text-green-600">Verificado</span>
                                ) : (
                                    <Button
                                        variant={'secondary'}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                        onClick={handleSendEmail} disabled={isPending}>
                                        {isPendingVerificate ? 'Enviando...' : 'Confirmar Email'}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <div>
                                <p className="font-medium">Dirección de envío</p>
                                <p className="text-sm text-gray-600">
                                    {user.address ? 'Configurada' : 'No configurada'}
                                </p>
                            </div>
                            <button className="text-sm text-gray-600 hover:text-gray-800">
                                {user.address ? 'Modificar' : 'Añadir dirección'}
                            </button>
                        </div>

                        {/* Payment Method */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <div>
                                <p className="font-medium">Método de pago</p>
                                <p className="text-sm text-gray-600">
                                    {user.paymentMethod || 'No configurado'}
                                </p>
                            </div>
                            <button className="text-sm text-gray-600 hover:text-gray-800">
                                {user.paymentMethod ? 'Cambiar' : 'Añadir método'}
                            </button>
                        </div>

                        {/* Favorites */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <div>
                                <p className="font-medium">Lista de favoritos</p>
                                <p className="text-sm text-gray-600">0 productos guardados</p>
                            </div>
                            <button className="text-sm text-gray-600 hover:text-gray-800">Ver lista</button>
                        </div>

                        {/* Reviews */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <div>
                                <p className="font-medium">Reseñas y comentarios</p>
                                <p className="text-sm text-gray-600">0 reseñas publicadas</p>
                            </div>
                            <button className="text-sm text-gray-600 hover:text-gray-800">Ver reseñas</button>
                        </div>

                        {/* Last Order */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <div>
                                <p className="font-medium">Último pedido</p>
                                <p className="text-sm text-gray-600">No hay pedidos anteriores</p>
                            </div>
                            <button className="text-sm text-gray-600 hover:text-gray-800">Ver pedidos</button>
                        </div>

                        {/* Change Password */}
                        <div className="py-3">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="font-medium mb-2">Cambiar contraseña</p>
                                    <input
                                        type="password"
                                        placeholder="Nueva contraseña"
                                        className="w-full max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                                <button className="text-sm text-gray-600 hover:text-gray-800 ml-4 mt-6">
                                    Actualizar
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Sign Out */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Cerrar sesión</h3>
                            <p className="text-gray-600">Cerrar tu sesión de forma segura</p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}