// components/AdminGuard.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminGuardProps {
    userRole?: string;
    children: React.ReactNode;
}

export const AdminGuard = ({ userRole, children }: AdminGuardProps) => {
    const router = useRouter();

    useEffect(() => {
        if (userRole !== 'admin') {
            router.push('/dev');
        }
    }, [userRole, router]);

    // Показываем контент только если пользователь админ
    if (userRole !== 'admin') {
        return null; // или лоадер
    }

    return <>{children}</>;
};