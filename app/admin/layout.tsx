import { getCurrentUser } from "@/lib/utils/auth-utils";
import type { Metadata } from "next";
import { AdminGuard } from "@/components/auth/AdminGuard";

export default async function RootLayout({
                                             children
                                         }: Readonly<{ children: React.ReactNode; }>) {
    const user = await getCurrentUser();

    return (
        <AdminGuard userRole={user?.role}>
            <div>
                {children}
            </div>
        </AdminGuard>
    );
}