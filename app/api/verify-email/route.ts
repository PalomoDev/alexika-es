import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailTokenWithGracePeriod } from '@/email/token-validation';
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (!token || !email) {
            return NextResponse.redirect(new URL('/verify-email?error=missing-params', request.url));
        }

        // Verificar el token
        const isValidToken = verifyEmailTokenWithGracePeriod(email, token);

        if (!isValidToken) {
            return NextResponse.redirect(new URL('/verify-email?error=invalid-token', request.url));
        }

        // Actualizar usuario en la base de datos
        const user = await prisma.user.update({
            where: { email },
            data: {
                emailVerified: true,
                updatedAt: new Date()
            }
        });

        if (!user) {
            return NextResponse.redirect(new URL('/verify-email?error=user-not-found', request.url));
        }

        // Redirigir a página de éxito
        return NextResponse.redirect(new URL('/verify-email?success=true', request.url));

    } catch (error) {
        console.error('Error al verificar email:', error);
        return NextResponse.redirect(new URL('/verify-email?error=server-error', request.url));
    }
}