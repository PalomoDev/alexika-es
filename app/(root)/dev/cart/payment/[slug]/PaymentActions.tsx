'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, X, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import {processPaymentSuccess} from "@/lib/actions/orden/orden.action";
import {ROUTES} from "@/lib/constants/routes";

interface PaymentActionsProps {
    orderId?: string;
}

export default function PaymentActions({ orderId }: PaymentActionsProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handlePaymentSuccess = async () => {
        if (!orderId) return;

        startTransition(async () => {
            try {
                // Эмуляция ответа от платежной системы
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Здесь будет вызов функции обработки успешного платежа

                const paymentData = {status: "completed"}
                await processPaymentSuccess(orderId, paymentData);

                toast.success('¡Pago exitoso!', {
                    description: 'Tu pedido ha sido pagado y confirmado'
                });

                // Переход на страницу заказов
                router.push(`${ROUTES.PAGES.ORDERS}`);

            } catch (error) {
                toast.error('Error en el pago', {
                    description: 'No se pudo procesar el pago'
                });
            }
        });
    };

    const handleCancelOrder = async () => {
        startTransition(async () => {
            try {
                // Здесь логика отмены заказа
                // await cancelOrder(orderId);

                toast.success('Pedido cancelado', {
                    description: 'El pedido ha sido cancelado'
                });

                router.push('/');

            } catch (error) {
                toast.error('Error', {
                    description: 'No se pudo cancelar el pedido'
                });
            }
        });
    };

    return (
        <div className="border-t pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                    variant="default"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    onClick={handlePaymentSuccess}
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            Procesando pago...
                        </>
                    ) : (
                        <>
                            <CreditCard className="h-4 w-4" />
                            Acepto y confirmo
                        </>
                    )}
                </Button>

                <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                    onClick={handleCancelOrder}
                    disabled={isPending}
                >
                    <X className="h-4 w-4" />
                    Cancelar pedido
                </Button>
            </div>
        </div>
    );
}

