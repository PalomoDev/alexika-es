'use client'
import {createOrderFromCart, getOrderData, returnOrderToCart} from "@/lib/actions/cart/cart-order.action";
import React, {useState, useEffect} from "react";
import {OrderSummary} from "@/lib/validations/cart/order-validation";
import OrdenTable from "@/components/shared/layouts/orden/orden-table";
import ErrorDisplay from "@/components/ErrorDisplay";
import {ROUTES} from "@/lib/constants/routes";
import PaymentTimer from "@/components/shared/layouts/user/PaymentTimer";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";

type CreateOrderProps = {
    userId: string
}

const CreateOrder = ({ userId}: CreateOrderProps) => {
    const [orderData, setOrderData] = useState<OrderSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();
    const [orderCreated, setOrderCreated] = useState(false);


    useEffect(() => {
        if (orderCreated) return;
        const createOrder = async () => {
            try {
                setLoading(true);


                const orderResult = await createOrderFromCart(userId);

                if (orderResult.success) {
                    console.log('Заказ создан успешно:', orderResult.data);
                    // Здесь можно добавить получение полных данных заказа
                    const fullOrderData = await getOrderData(userId);
                    setOrderData(fullOrderData.data);
                    setOrderCreated(true);
                } else {
                    setError(orderResult.message || 'Error al crear el pedido');
                }
            } catch (err) {
                console.error('Error creating order:', err);
                setError('Error inesperado al crear el pedido');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            createOrder();
        }
    }, [userId, orderCreated]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2">Creando pedido...</span>
            </div>
        );
    }

    if (error) {
        return (
            <ErrorDisplay message={error} backUrl={`${ROUTES.PAGES.PRODUCTS}`}/>
        );
    }

    const handleOrderExpired = async () => {
        if (!orderData) return;

        try {
            await returnOrderToCart(orderData.id, userId);

            toast.error('Tiempo agotado', {
                description: 'El pedido ha sido cancelado. Los productos han vuelto al carrito.'
            });

            // Перенаправляем в корзину
            router.push(`${ROUTES.PAGES.CART}`);
        } catch (error) {
            console.error('Error handling [id] expiration:', error);
            toast.error('Error', {
                description: 'Error al procesar la expiración del pedido'
            });
        }
    };



    if (orderData) {
        return (
            <div className="max-w-4xl mx-auto bg-white p-6">
                {!orderData.isPaid && (
                    <div className="mb-6">
                        <PaymentTimer
                            orderCreatedAt={orderData.createdAt}
                            orderId={orderData.id}
                            userId={orderData.userId}
                            onOrderExpired={handleOrderExpired}
                        />
                    </div>
                )}
                <OrdenTable
                    orderData={orderData}
                    userId={userId}
                    onReturnToCart={() => router.push(`${ROUTES.PAGES.CART}`)}
                />
            </div>
        );
    }
}

export default CreateOrder;