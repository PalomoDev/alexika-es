'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    User as UserIcon,
    UserCheck,
    LogIn,
    LogOut,
    ShoppingBag,
    Heart,
    LayoutDashboard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client';
import { ROUTES } from "@/lib/constants/routes";

interface UserButtonProps {
    side?: 'top' | 'right' | 'bottom' | 'left';
}

export const UserButton = ({ side = 'right' }: UserButtonProps) => {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    // Вычисляем состояния
    const isLoggedIn = !!session;
    const user = session?.user;
    const isAdmin = user?.role === 'admin';

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/dev')
        } catch (error) {
            console.error('Sign out failed:', error)
            router.push('/dev') // все равно редиректим
        }
    }

    // Показываем лоадер во время загрузки
    if (isPending) {
        return (
            <Button variant="ghost" size="sm" className="relative" disabled>
                <div className="w-6 h-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </Button>
        );
    }

    const triggerButton = (
        <Button variant="sin_hover" size="sm" className="relative">
            {isAdmin ? (
                <UserCheck className="w-6 h-6 md:text-white sm:text-black" />
            ) : isLoggedIn ? (
                <UserCheck className="w-6 h-6 md:text-white sm:text-black" />
            ) : (
                <UserIcon className="w-6 h-6 md:text-white sm:text-black" />
            )}
        </Button>
    );

    return (
        <Sheet>
            <SheetTrigger asChild>
                {triggerButton}
            </SheetTrigger>
            <SheetContent
                side={side}
                className={side === 'bottom' || side === 'top' ? 'h-auto max-h-[85vh]' : 'w-full sm:max-w-md'}
            >
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        {isLoggedIn ? (
                            <>
                                <span>{user?.name || 'Mi Cuenta'}</span>
                                {isAdmin && <Badge variant="default">Admin</Badge>}
                            </>
                        ) : (
                            'Bienvenido'
                        )}
                    </SheetTitle>
                    <SheetDescription>
                        {isLoggedIn ? (
                            <>
                                {user?.email}
                                {user?.role && (
                                    <span className="block text-xs mt-1">
                                        Rol: {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                                    </span>
                                )}
                            </>
                        ) : (
                            'Inicia sesión para acceder a tu cuenta'
                        )}
                    </SheetDescription>
                </SheetHeader>

                <div className="py-6">
                    {isLoggedIn ? (
                        <div className="space-y-2">
                            <Link href={ROUTES.PAGES.PROFILE} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <UserIcon className="h-5 w-5" />
                                <span className="font-medium">Mi Perfil</span>
                            </Link>
                            
                            {/* Админская панель для админов */}
                            {isAdmin && (
                                <Link href={ROUTES.ADMIN_PAGES.HOME} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                    <LayoutDashboard className="h-5 w-5" />
                                    <span className="font-medium">Panel de Admin</span>
                                </Link>
                            )}
                            
                            <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <ShoppingBag className="h-5 w-5" />
                                <span className="font-medium">Mis Pedidos</span>
                            </Link>
                            
                            <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <Heart className="h-5 w-5" />
                                <span className="font-medium">Lista de Deseos</span>
                            </Link>



                            <div className="pl-1">
                                <Button
                                    variant="ghost"
                                    onClick={handleSignOut}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-red-600 w-full text-left justify-start"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span className="font-medium text-base">Cerrar Sesión</span>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Link href={ROUTES.PAGES.LOGIN} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <LogIn className="h-5 w-5" />
                                <span className="font-medium">Iniciar Sesión</span>
                            </Link>
                            
                            <Link href={ROUTES.PAGES.REGISTER} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <UserIcon className="h-5 w-5" />
                                <span className="font-medium">Crear Cuenta</span>
                            </Link>
                            
                            <div className="pt-2 mt-2 border-t">
                                <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                    <ShoppingBag className="h-5 w-5" />
                                    <span className="font-medium">Rastrear Pedido</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <SheetFooter>
                    <SheetClose asChild>

                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};