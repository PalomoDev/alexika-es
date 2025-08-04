"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/shared/logo";
import { useSession, signOut } from "@/lib/auth-client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, ChevronDown } from "lucide-react";
import { navAdminItems } from "@/db/data";
import {ROUTES} from "@/lib/constants/routes";

const AdminHeader = () => {

    const pathname = usePathname();
    const { data: session } = useSession();

const handleSignOut = async () => {
    try {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    console.log('✅ Sign out successful, redirecting...');
                    
                    // Получаем текущий хост для правильной очистки куков
                    const currentHost = window.location.hostname;
                    
                    // Очищаем куки для текущего домена
                    document.cookie.split(";").forEach((c) => {
                        const eqPos = c.indexOf("=");
                        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
                        
                        // Очищаем для текущего пути
                        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
                        
                        // Очищаем для текущего домена (если это не localhost)
                        if (currentHost !== 'localhost') {
                            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${currentHost}`;
                        }
                    });
                    
                    // Очищаем localStorage и sessionStorage
                    localStorage.clear();
                    sessionStorage.clear();
                    
                    // Перенаправляем на dev страницу
                    window.location.href = '/dev';
                },
                onError: (error) => {
                    console.error('❌ Sign out error:', error);
                    // Принудительная очистка при ошибке
                    document.cookie.split(";").forEach((c) => {
                        const eqPos = c.indexOf("=");
                        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
                        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
                    });
                    window.location.href = '/dev';
                }
            }
        });
    } catch (error) {
        console.error('❌ Sign out failed:', error);
        // Принудительная очистка при критической ошибке
        document.cookie.split(";").forEach((c) => {
            const eqPos = c.indexOf("=");
            const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        });
        window.location.href = '/dev';
    }
};

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="wrapper">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href={ROUTES.BASE_URL}>
                            <Logo size="small" orientation="horizontal" className="" />
                        </Link>
                    </div>

                    {/* Navegación */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navAdminItems.map((item) => {
                            const isActive = item.exact
                                ? pathname === item.href
                                : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Профиль пользователя */}
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">
                                        {session?.user?.name || 'Admin User'}
                                    </p>
                                    <p className="text-xs text-gray-500">Administrador</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Perfil</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Configuración</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;