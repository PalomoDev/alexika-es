'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h1 className="text-xl font-semibold text-green-800 mb-2">
                    ¡Email verificado con éxito!
                </h1>
                <p className="text-green-700">
                    Tu dirección de correo electrónico ha sido confirmada. Ya puedes acceder a todas las funciones de tu cuenta.
                </p>
            </div>
        );
    }

    if (error) {
        const errorMessages = {
            'missing-params': 'Faltan parámetros en el enlace',
            'invalid-token': 'El enlace de verificación no es válido o ha expirado',
            'user-not-found': 'Usuario no encontrado',
            'server-error': 'Error del servidor. Inténtalo más tarde'
        };

        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
                <h1 className="text-xl font-semibold text-red-800 mb-2">
                    Error de verificación
                </h1>
                <p className="text-red-700">
                    {errorMessages[error as keyof typeof errorMessages] || 'Error desconocido'}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h1 className="text-xl font-semibold text-blue-800 mb-2">
                Verificación de email
            </h1>
            <p className="text-blue-700">
                Procesando verificación...
            </p>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}