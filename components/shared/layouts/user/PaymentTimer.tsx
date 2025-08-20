'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Clock,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ORDER_TIMEOUT_MINUTES } from "@/lib/constants";
import { returnOrderToCart } from "@/lib/actions/cart/cart-order.action";

const ORDER_TIMEOUT_MS = ORDER_TIMEOUT_MINUTES * 60 * 1000;

interface PaymentTimerProps {
    orderCreatedAt: Date;
    orderId: string;
    userId: string;
    onOrderExpired?: () => void;
    className?: string;
}

const PaymentTimer: React.FC<PaymentTimerProps> = ({
                                                       orderCreatedAt,
                                                       orderId,
                                                       userId,
                                                       onOrderExpired,
                                                       className
                                                   }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isExpired, setIsExpired] = useState<boolean>(false);
    const [isProcessingExpiration, setIsProcessingExpiration] = useState<boolean>(false);
    const [hasExpired, setHasExpired] = useState<boolean>(false); // Флаг для однократного выполнения

    // Форматирование времени в MM:SS
    const formatTime = (milliseconds: number): string => {
        if (milliseconds <= 0) return "00:00";

        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Вычисление прогресса для прогресс-бара (0-100)
    const getProgress = (timeLeft: number): number => {
        const elapsed = ORDER_TIMEOUT_MS - timeLeft;
        return Math.min((elapsed / ORDER_TIMEOUT_MS) * 100, 100);
    };

    // Определение цвета на основе оставшегося времени (пропорционально общему времени)
    const getColorClass = (timeLeft: number): string => {
        const minutesLeft = timeLeft / (60 * 1000);
        const criticalThreshold = ORDER_TIMEOUT_MINUTES * 0.17; // 17% от общего времени
        const warningThreshold = ORDER_TIMEOUT_MINUTES * 0.33;  // 33% от общего времени

        if (minutesLeft <= criticalThreshold) return "text-red-600";
        if (minutesLeft <= warningThreshold) return "text-orange-600";
        return "text-green-600";
    };

    // Определение статуса для UI
    const getStatus = (timeLeft: number): 'normal' | 'warning' | 'critical' | 'expired' => {
        if (timeLeft <= 0) return 'expired';

        const minutesLeft = timeLeft / (60 * 1000);
        const criticalThreshold = ORDER_TIMEOUT_MINUTES * 0.17;
        const warningThreshold = ORDER_TIMEOUT_MINUTES * 0.33;

        if (minutesLeft <= criticalThreshold) return 'critical';
        if (minutesLeft <= warningThreshold) return 'warning';
        return 'normal';
    };

    // Обработка истечения времени
    const handleOrderExpiration = async () => {
        if (isProcessingExpiration) return;

        setIsProcessingExpiration(true);
        console.log(`⏰ Tiempo de pago agotado para el pedido ${orderId}`);

        try {
            const result = await returnOrderToCart(orderId, userId);

            if (result.success) {
                console.log(`✅ Pedido ${orderId} devuelto al carrito exitosamente`);
            } else {
                console.error(`❌ Error al devolver pedido ${orderId}:`, result.message);
            }

            // Siempre llamamos al callback para redirigir al usuario
            onOrderExpired?.();

        } catch (error) {
            console.error(`❌ Error inesperado al procesar expiración del pedido ${orderId}:`, error);
            // Aún así redirigimos al usuario
            onOrderExpired?.();
        } finally {
            setIsProcessingExpiration(false);
        }
    };

    // Taimer principal
    useEffect(() => {
        const updateTimer = () => {
            const now = Date.now();
            const expirationTime = orderCreatedAt.getTime() + ORDER_TIMEOUT_MS;
            const remaining = expirationTime - now;

            setTimeLeft(Math.max(0, remaining));

            if (remaining <= 0 && !isExpired) {
                setIsExpired(true);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [orderCreatedAt, isExpired]);

    // Ejecutar expiración cuando el tiempo se agote
    useEffect(() => {
        if (isExpired && !hasExpired) {
            handleOrderExpiration();
        }
    }, [isExpired, hasExpired]);

    const status = getStatus(timeLeft);
    const formattedTime = formatTime(timeLeft);
    const progress = getProgress(timeLeft);
    const colorClass = getColorClass(timeLeft);

    // Estado de pedido expirado
    if (isExpired) {
        return (
            <Card className={cn("border-red-200", className)}>
                <CardContent className="p-4">
                    <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            <div className="font-semibold mb-1">
                                Tiempo de pago agotado
                            </div>
                            <div className="text-sm">
                                {isProcessingExpiration ? (
                                    "Procesando cancelación del pedido..."
                                ) : (
                                    "El pedido ha sido cancelado y los productos han sido devueltos al carrito."
                                )}
                            </div>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    // Temporizador activo
    return (
        <Card className={cn(
            "transition-all duration-300",
            status === 'critical' && "border-red-300 bg-red-50",
            status === 'warning' && "border-orange-300 bg-orange-50",
            className
        )}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Clock className={cn("h-4 w-4", colorClass)} />
                        <span className="font-medium text-gray-700">
                            Tiempo para completar el pago
                        </span>
                    </div>
                    <div className={cn("text-2xl font-mono font-bold", colorClass)}>
                        {formattedTime}
                    </div>
                </div>

                {/* Barra de progreso */}
                <div className="mb-3">
                    <Progress
                        value={progress}
                        className={cn(
                            "h-2 transition-all duration-300",
                            status === 'critical' && "[&>div]:bg-red-500",
                            status === 'warning' && "[&>div]:bg-orange-500",
                            status === 'normal' && "[&>div]:bg-green-500"
                        )}
                    />
                </div>

                {/* Alertas según el estado */}
                {status === 'critical' && (
                    <Alert className="border-red-200 bg-red-50 mb-3">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800 text-sm">
                            <strong>¡Atención!</strong> Te quedan menos de {Math.ceil(ORDER_TIMEOUT_MINUTES * 0.17)} minutos para completar el pago.
                        </AlertDescription>
                    </Alert>
                )}

                {status === 'warning' && (
                    <Alert className="border-orange-200 bg-orange-50 mb-3">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800 text-sm">
                            Te quedan menos de {Math.ceil(ORDER_TIMEOUT_MINUTES * 0.33)} minutos para completar el pago.
                        </AlertDescription>
                    </Alert>
                )}

                {status === 'normal' && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Tienes suficiente tiempo para completar tu pago de forma segura.</span>
                    </div>
                )}

                {/* Información del proceso */}
                <div className="pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 space-y-1">
                        <div>• Los productos están reservados durante {ORDER_TIMEOUT_MINUTES} minutos</div>
                        <div>• Si no se completa el pago, el pedido se cancelará automáticamente</div>
                        <div>• Los productos volverán a tu carrito</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PaymentTimer;