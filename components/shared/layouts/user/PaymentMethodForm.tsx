'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { UserBase } from "@/lib/validations/product/base";
import { PAYMENT_METHODS } from "@/lib/constants/payment-method";
import { updateUserPaymentMethod } from "@/lib/actions/cart/cart.action";

// Упрощенная схема - только выбор метода
const PaymentMethodSchema = z.object({
    method: z.enum(['stripe', 'paypal', 'cash', 'bizum', 'crypto']),
});

type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

interface PaymentMethodFormProps {
    paymentSaved?: () => void;
    user: UserBase;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ paymentSaved, user }) => {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [selectedMethod, setSelectedMethod] = useState<string>('');

    const form = useForm<PaymentMethod>({
        resolver: zodResolver(PaymentMethodSchema),
        defaultValues: {
            method: user.paymentMethod as 'stripe' | 'paypal' | 'cash' | 'bizum' | 'crypto' || undefined,
        },
    });

    // Загружаем существующий метод оплаты
    useEffect(() => {
        if (user.paymentMethod) {
            setSelectedMethod(user.paymentMethod);
            form.setValue('method', user.paymentMethod as 'stripe' | 'paypal' | 'cash' | 'bizum' | 'crypto');
        }
    }, [user, form]);

    const onSubmit = async (data: PaymentMethod) => {
        startTransition(async () => {
            try {
                const result = await updateUserPaymentMethod(data.method);

                if (result.success) {
                    toast.success('¡Perfecto!', {
                        description: result.message
                    });
                    paymentSaved?.();
                } else {
                    toast.error('Error', {
                        description: result.message
                    });
                }

            } catch (error) {
                toast.error('Error', {
                    description: 'No se pudo guardar el método de pago'
                });
            }
        });
    };

    const paymentMethods = PAYMENT_METHODS;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Método de pago
                </CardTitle>
                <CardDescription>
                    Selecciona tu método de pago preferido. Los datos específicos se solicitarán al finalizar el pedido.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                setSelectedMethod(value);
                                            }}
                                            value={field.value}
                                            className="grid gap-4"
                                        >
                                            {paymentMethods.map((method) => {
                                                const Icon = method.icon;
                                                return (
                                                    <div key={method.value}>
                                                        <label
                                                            htmlFor={method.value}
                                                            className={cn(
                                                                "flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors",
                                                                field.value === method.value
                                                                    ? "border-primary bg-primary/5"
                                                                    : "border-border hover:bg-muted/50"
                                                            )}
                                                        >
                                                            <RadioGroupItem
                                                                value={method.value}
                                                                id={method.value}
                                                            />
                                                            <Icon className="h-5 w-5 text-muted-foreground" />
                                                            <div className="flex-1">
                                                                <div className="font-medium">{method.label}</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {method.description}
                                                                </div>
                                                            </div>
                                                            {field.value === method.value && (
                                                                <Check className="h-4 w-4 text-primary" />
                                                            )}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Информация о выбранном методе */}
                        {selectedMethod === 'stripe' && (
                            <div className="p-4 border rounded-lg bg-blue-50">
                                <h4 className="font-medium mb-2">Pago seguro con Stripe</h4>
                                <p className="text-sm text-muted-foreground">
                                    Los datos de tu tarjeta se solicitarán en el siguiente paso de forma segura.
                                </p>
                            </div>
                        )}

                        {selectedMethod === 'paypal' && (
                            <div className="p-4 border rounded-lg bg-blue-50">
                                <h4 className="font-medium mb-2">Pago con PayPal</h4>
                                <p className="text-sm text-muted-foreground">
                                    Serás redirigido a PayPal para completar el pago de forma segura.
                                </p>
                            </div>
                        )}

                        {selectedMethod === 'bizum' && (
                            <div className="p-4 border rounded-lg bg-orange-50">
                                <h4 className="font-medium mb-2">Pago con Bizum</h4>
                                <p className="text-sm text-muted-foreground">
                                    Te solicitaremos tu número de teléfono móvil en el siguiente paso.
                                </p>
                            </div>
                        )}

                        {selectedMethod === 'crypto' && (
                            <div className="p-4 border rounded-lg bg-yellow-50">
                                <h4 className="font-medium mb-2">Pago con criptomonedas</h4>
                                <p className="text-sm text-muted-foreground">
                                    Te proporcionaremos la dirección de wallet y el importe exacto al finalizar el pedido.
                                </p>
                            </div>
                        )}

                        {selectedMethod === 'cash' && (
                            <div className="p-4 border rounded-lg bg-green-50">
                                <h4 className="font-medium mb-2">Pago contra reembolso</h4>
                                <p className="text-sm text-muted-foreground">
                                    Pagarás directamente al repartidor. Se aplicará una comisión adicional de 2€.
                                </p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isPending || !selectedMethod}
                            className="w-full"
                            size="lg"
                        >
                            {isPending ? 'Guardando...' : 'Confirmar método de pago'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default PaymentMethodForm;