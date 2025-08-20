'use client'
import React, {startTransition, useState} from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {CartItem, ClientCart} from "@/lib/validations/cart/cart-validation";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {useToast} from "@/hooks/use-toast";
import {addItemToCart, removeItemFromCart, updateCartBeforeCheckout} from "@/lib/actions/cart/cart.action";
import Link from "next/link";
import {ROUTES} from "@/lib/constants/routes";
import {useSession} from "@/lib/auth-client";
import {
    calculateItemTotal,
    formatPrice,
    calculateCartSummary,
    getCartUpdates
} from "@/lib/utils/cart-calculations";
import { CartUpdateDataSchema } from "@/lib/validations/cart/cart-validation";

interface CartTableProps {
    cart: ClientCart;
    onUpdateQuantity?: (itemId: string, newQty: number) => void;
    onCheckoutSuccess?: () => void;
}

export const CartTable: React.FC<CartTableProps> = ({
                                                        cart,
                                                        onUpdateQuantity,
                                                        onCheckoutSuccess,
                                                    }) => {
    const [localQuantities, setLocalQuantities] = useState<Record<string, number>>(
        cart.items.reduce((acc, item) => ({ ...acc, [item.id]: item.qty }), {})
    );

    const handleQuantityChange = (itemId: string, newQty: number) => {
        if (newQty < 1) return;

        setLocalQuantities(prev => ({ ...prev, [itemId]: newQty }));
        onUpdateQuantity?.(itemId, newQty);
    };

    const handleQuantityInput = (itemId: string, value: string) => {
        const newQty = parseInt(value) || 1;
        handleQuantityChange(itemId, newQty);
    };

    if (!cart.items || cart.items.length === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground text-lg">Tu carrito está vacío</p>
                </CardContent>
            </Card>
        );
    }

    // Используем централизованный расчет
    const cartSummary = calculateCartSummary(cart.items, localQuantities);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Carrito ({cart.items.length} productos)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-20 text-center">Foto</TableHead>
                                <TableHead className={'text-center'}> Producto</TableHead>
                                <TableHead className="text-center">Precio</TableHead>
                                <TableHead className="text-center w-32">Cantidad</TableHead>
                                <TableHead className="text-center">Total</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cart.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="w-12 h-12 relative mx-auto">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain rounded"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <Link href={`${ROUTES.PAGES.PRODUCT}${item.slug}`} className={'cursor-pointer'}>
                                                <h3 className="font-medium">{item.name}</h3>
                                            </Link>
                                            <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-medium">
                                        {formatPrice(item.price)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleQuantityChange(item.id, localQuantities[item.id] - 1)}
                                                disabled={localQuantities[item.id] <= 1}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <Input
                                                type="text"
                                                value={localQuantities[item.id]}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*$/.test(value) && value !== '0') {
                                                        handleQuantityInput(item.id, value || '1');
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    if (!e.target.value) {
                                                        handleQuantityInput(item.id, '1');
                                                    }
                                                }}
                                                className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleQuantityChange(item.id, localQuantities[item.id] + 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-medium">
                                        {formatPrice(calculateItemTotal(item.price, localQuantities[item.id]))}
                                    </TableCell>
                                    <TableCell className={'w-24'}>
                                        <DeleteItem itemId={item.id}/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Итоговая сумма */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span>Coste de productos:</span>
                            <span>{formatPrice(cartSummary.itemsPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Envío:</span>
                            <span>
                               {cartSummary.shipping === "0.00"
                                   ? <span className="text-green-600 font-medium">Gratis</span>
                                   : formatPrice(cartSummary.shipping)
                               }
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Impuestos:</span>
                            <span>{formatPrice(cartSummary.tax)}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span>{formatPrice(cartSummary.totalPrice)}</span>
                        </div>
                    </div>
                    <div className="mt-6 space-y-3">
                        <FinalizarPedido
                            cart={cart}
                            localQuantities={localQuantities}
                            onSuccess={onCheckoutSuccess}
                        />

                        <Link href={`${ROUTES.PAGES.PRODUCTS}`}>
                            <Button variant="outline" className="w-full">
                                Seguir comprando
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

function DeleteItem ({itemId}: { itemId: string }) {
    const { toast } = useToast();
    const handleDelete = async (itemId: string) => {
        startTransition(async () => {
            const res = await removeItemFromCart(itemId);

            if (!res.success) {
                toast.error('¡Error!', {
                    description: res.message,
                });
            } else {
                toast.success('¡Éxito!', {
                    description: res.message,
                });
            }
        });
    };
    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => handleDelete(itemId)}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    )
}

function FinalizarPedido ({cart, localQuantities, onSuccess}: {
    cart: ClientCart,
    localQuantities: Record<string, number>,
    onSuccess?: () => void
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const session = useSession();
    const { toast } = useToast();

    const handlerToCheckout = () => {
        if(!session.data) {
            router.push('/login');
            return;
        }

        startTransition(async () => {
            try {
                // Собираем изменения количества
                const updates = getCartUpdates(cart.items, localQuantities);

                // Пересчитываем итоговые суммы с новыми количествами
                const summary = calculateCartSummary(cart.items, localQuantities);

                // Объект для обновления корзины
                const cartUpdateData = {
                    hasChanges: updates.length > 0,
                    updates,
                    summary
                };

                // Валидация данных
                const validationResult = CartUpdateDataSchema.safeParse(cartUpdateData);

                if (!validationResult.success) {
                    console.error('Errores de validación:', validationResult.error.issues);
                    toast.error('Error de validación', {
                        description: 'Los datos del carrito no son válidos'
                    });
                    return;
                }

                console.log('Datos validados para actualizar carrito:', validationResult.data);

                // Обновляем корзину в базе данных
                const updateResult = await updateCartBeforeCheckout(validationResult.data);

                if (!updateResult.success) {
                    toast.error('Error', {
                        description: updateResult.message
                    });
                    return;
                }

                // Показываем сообщение об успехе
                if (validationResult.data.hasChanges) {
                    toast.success('Carrito actualizado', {
                        description: updateResult.message
                    });
                }

                // Переходим на страницу оформления заказа
                router.push(`${ROUTES.PAGES.CART}/shipping-billing`);

            } catch (error) {
                console.error('Error al procesar checkout:', error);
                toast.error('Error', {
                    description: 'Error al procesar el pedido'
                });
            }
        });
    }

    return (
        <Button
            onClick={handlerToCheckout}
            disabled={isPending}
            className="w-full"
            size="lg"
        >
            {isPending ? 'Preparando...' : 'Finalizar pedido'}
        </Button>
    )
}