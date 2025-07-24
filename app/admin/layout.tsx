import { getCurrentUser } from "@/lib/utils/auth-utils";
import type { Metadata } from "next";
import { AdminGuard } from "@/components/auth/AdminGuard";
import AdminHeader from "@/components/admin/AdminHeader";
import { Monitor, Smartphone } from "lucide-react";

export default async function RootLayout({
                                             children
                                         }: Readonly<{ children: React.ReactNode; }>) {
    const user = await getCurrentUser();

    return (
        <AdminGuard userRole={user?.role}>
            {/* Мобильная заглушка */}
            <div className="md:hidden min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="text-center max-w-sm">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <Monitor className="w-16 h-16 text-primary" />
                            <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-1">
                                <Smartphone className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-xl font-semibold text-gray-900 mb-4">
                        Panel de administración
                    </h1>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                        El panel de administración está diseñado exclusivamente para dispositivos de escritorio para una mejor experiencia de usuario.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>💡 Consejo:</strong> Utiliza una computadora o tablet en modo horizontal para acceder al panel de administración.
                        </p>
                    </div>
                </div>
            </div>

            {/* Desktop - Contenido normal */}
            <div className="hidden md:block">
                <AdminHeader />
                <div>
                    {children}
                </div>
            </div>
        </AdminGuard>
    );
}