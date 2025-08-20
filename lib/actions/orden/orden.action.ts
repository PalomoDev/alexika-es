'use server'

import prisma  from '@/lib/prisma'
import {OrderSummary} from "@/lib/validations/cart/order-validation";
import {ShippingAddressSchema} from "@/lib/validations/user/address-validation";
import {revalidatePath} from "next/cache";
import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import {formatError} from "@/lib/utils";
import {returnOrderToCart} from "@/lib/actions/cart/cart-order.action";


interface ActionResponse<T> {
    success: boolean;
    data: T | null;
    message: string;
}

type OrdersItem = OrderSummary[]

export const getAllOrders = async (): Promise<ActionResponse<OrdersItem>>  => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                orderitems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                imageIds: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // DTO преобразование
        const transformedOrders = orders.map(order => ({
            id: order.id,
            userId: order.userId,
            paymentMethod: order.paymentMethod,
            paymentResult: order.paymentResult,
            itemsPrice: Number(order.itemsPrice),
            shippingPrice: Number(order.shippingPrice),
            taxPrice: Number(order.taxPrice),
            totalPrice: Number(order.totalPrice),
            isPaid: order.isPaid,
            paidAt: order.paidAt,
            isDelivered: order.isDelivered,
            deliveredAt: order.deliveredAt,
            status: order.status as "pending" | "cancelled" | "processing" | "shipped" | "delivered",
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            shippingAddress: ShippingAddressSchema.parse(order.shippingAddress),
            items: order.orderitems.map(item => ({
                orderId: item.orderId,
                productId: item.productId,
                qty: item.qty,
                price: Number(item.price),
                name: item.name,
                slug: item.slug,
                image: item.image
            })),
            user: {
                id: order.user.id,
                name: order.user.name,
                email: order.user.email
            }
        }))

        return {
            success: true,
            data: transformedOrders,
            message: 'Tengo pedidos'
        }

    } catch (error) {
        console.error('Error al obtener pedidos:', error)
        return {
            success: false,
            message: 'Error interno del servidor',
            data: [],
        }
    }
}

// Функция для получения заказов конкретного пользователя
export const getUserOrders = async (userId: string): Promise<ActionResponse<OrdersItem>> => {
    try {
        // Проверяем авторизацию
        const headersList = await headers();
        const session = await auth.api.getSession({
            headers: headersList
        });

        if (!session?.user || session.user.id !== userId) {
            return {
                success: false,
                data: null,
                message: 'No tienes autorización para ver estos pedidos'
            };
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                orderitems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                imageIds: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // DTO преобразование
        const transformedOrders = orders.map(order => ({
            id: order.id,
            userId: order.userId,
            paymentMethod: order.paymentMethod,
            paymentResult: order.paymentResult,
            itemsPrice: Number(order.itemsPrice),
            shippingPrice: Number(order.shippingPrice),
            taxPrice: Number(order.taxPrice),
            totalPrice: Number(order.totalPrice),
            isPaid: order.isPaid,
            paidAt: order.paidAt,
            isDelivered: order.isDelivered,
            deliveredAt: order.deliveredAt,
            status: order.status as "pending" | "cancelled" | "processing" | "shipped" | "delivered",
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            shippingAddress: ShippingAddressSchema.parse(order.shippingAddress),
            items: order.orderitems.map(item => ({
                orderId: item.orderId,
                productId: item.productId,
                qty: item.qty,
                price: Number(item.price),
                name: item.name,
                slug: item.slug,
                image: item.image
            })),
            user: {
                id: order.user.id,
                name: order.user.name,
                email: order.user.email
            }
        }));

        return {
            success: true,
            data: transformedOrders,
            message: orders.length > 0
                ? `Se encontraron ${orders.length} pedidos`
                : 'No tienes pedidos'
        };

    } catch (error) {
        console.error('Error al obtener pedidos del usuario:', error);
        return {
            success: false,
            message: 'Error interno del servidor',
            data: null,
        };
    }
};

export const cancelExpiredOrders = async () => {
    try {
        // Вычисляем время 30 минут назад от текущего момента
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)

        // Находим все неоплаченные заказы старше 30 минут
        const expiredOrders = await prisma.order.findMany({
            where: {
                isPaid: false,
                status: 'pending',
                createdAt: {
                    lt: thirtyMinutesAgo
                }
            },
            select: {
                id: true,
                createdAt: true
            }
        })

        if (expiredOrders.length === 0) {
            return {
                success: true,
                message: 'No hay pedidos expirados',
                cancelledCount: 0
            }
        }

        // Обновляем статус просроченных заказов на cancelled
        const updateResult = await prisma.order.updateMany({
            where: {
                id: {
                    in: expiredOrders.map(order => order.id)
                }
            },
            data: {
                status: 'cancelled',
                updatedAt: new Date()
            }
        })

        return {
            success: true,
            message: `${updateResult.count} pedidos cancelados por expiración`,
            cancelledCount: updateResult.count,
            cancelledOrders: expiredOrders
        }

    } catch (error) {
        console.error('Error al cancelar pedidos expirados:', error)
        return {
            success: false,
            error: 'Error interno del servidor',
            cancelledCount: 0
        }
    }
}

// Для админа - жесткое удаление заказа
export const orderDelete = async (orderId: string) => {
    try {
        // Проверяем существование заказа
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderitems: true
            }
        })

        if (!order) {
            return {
                success: false,
                message: 'Pedido no encontrado'
            }
        }

        // Запрещаем удаление оплаченных заказов
        if (order.isPaid) {
            return {
                success: false,
                message: 'No se puede eliminar un pedido pagado'
            }
        }

        // Запрещаем удаление отправленных/доставленных заказов
        if (order.status === 'shipped' || order.status === 'delivered') {
            return {
                success: false,
                message: 'No se puede eliminar un pedido enviado o entregado'
            }
        }

        // Используем транзакцию для атомарности
        await prisma.$transaction(async (tx) => {
            // Возвращаем товары на склад
            for (const item of order.orderitems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            increment: item.qty
                        }
                    }
                })
            }

            // Удаляем позиции заказа
            await tx.orderItem.deleteMany({
                where: { orderId: orderId }
            })

            // Удаляем заказ
            await tx.order.delete({
                where: { id: orderId }
            })
        })
        revalidatePath('/admin/order');
        return {
            success: true,
            message: 'Pedido eliminado correctamente'
        }

    } catch (error) {
        console.error('Error al eliminar pedido:', error)
        return {
            success: false,
            message: 'Error interno del servidor'
        }
    }
}

// Для пользователя - отмена заказа (мягкое удаление)
export const orderCancel = async (orderId: string, userId: string) => {
    try {
        // Проверяем существование заказа и принадлежность пользователю
        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
                userId: userId // Дополнительная проверка принадлежности
            },
            include: {
                orderitems: true
            }
        })

        if (!order) {
            return {
                success: false,
                message: 'Pedido no encontrado'
            }
        }

        // Запрещаем отмену оплаченных заказов
        if (order.isPaid) {
            return {
                success: false,
                message: 'No se puede cancelar un pedido pagado'
            }
        }

        // Запрещаем отмену отправленных/доставленных заказов
        if (order.status === 'shipped' || order.status === 'delivered') {
            return {
                success: false,
                message: 'No se puede cancelar un pedido enviado o entregado'
            }
        }

        // Проверяем, не отменен ли уже заказ
        if (order.status === 'cancelled') {
            return {
                success: false,
                message: 'El pedido ya está cancelado'
            }
        }

        // Используем транзакцию для атомарности
        await prisma.$transaction(async (tx) => {
            // Возвращаем товары на склад
            for (const item of order.orderitems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            increment: item.qty
                        }
                    }
                })
            }

            // Обновляем статус заказа на cancelled
            await tx.order.update({
                where: { id: orderId },
                data: {
                    status: 'cancelled',
                    updatedAt: new Date()
                }
            })
        })

        return {
            success: true,
            message: 'Pedido cancelado correctamente'
        }

    } catch (error) {
        console.error('Error al cancelar pedido:', error)
        return {
            success: false,
            message: 'Error interno del servidor'
        }
    }
}

export const processPaymentSuccess = async (orderId: string, paymentData: {status: string}): Promise<ActionResponse<string>> => {
    try {
        // Находим заказ
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true }
        });

        if (!order) {
            return {
                success: false,
                message: 'Pedido no encontrado',
                data: null
            };
        }

        // Обновляем заказ с результатом тестового платежа
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                isPaid: true,
                paidAt: new Date(),
                status: 'test_payment', // Специальный статус для тестовых платежей
                paymentResult: {
                    status: 'success',
                    paymentType: 'TEST_SIMULATION',
                    isTestPayment: true,
                    realPayment: false,
                    note: 'Pago de prueba - pendiente de procesamiento real',
                    transactionId: `TEST_${orderId.slice(-8)}_${Date.now()}`,
                    processedAt: new Date().toISOString(),
                    amount: order.totalPrice.toString(),
                    currency: 'EUR',
                    originalPaymentMethod: order.paymentMethod
                }
            }
        });

        // Очищаем корзину пользователя после успешного платежа
        await prisma.cart.deleteMany({
            where: { userId: order.userId }
        });

        revalidatePath('/', 'layout');

        return {
            success: true,
            message: 'Pago de prueba procesado - pendiente confirmación real',
            data: updatedOrder.id
        };

    } catch (error) {
        console.error('Error al procesar pago:', error)
        return {
            success: false,
            message: formatError(error),
            data: null
        }
    }
}

export const cleanupExpiredOrdersByProductSlug = async (productSlug: string): Promise<ActionResponse<string>> => {
    try {
        console.log(`🔍 Checking expired orders for product: ${productSlug}`);

        // Время истечения - 35 минут назад
        const expiredTime = new Date(Date.now() - 35 * 60 * 1000);

        // Находим истекшие заказы с этим товаром
        const expiredOrders = await prisma.order.findMany({
            where: {
                status: 'pending',
                isPaid: false,
                createdAt: { lt: expiredTime },
                orderitems: {
                    some: {
                        slug: productSlug
                    }
                }
            },
            include: {
                orderitems: true
            }
        });

        if (expiredOrders.length === 0) {
            console.log(`No expired orders found for product: ${productSlug}`);
            return {
                success: true,
                data: 'No expired orders found',
                message: 'No hay pedidos expirados para este producto'
            };
        }

        console.log(`Found ${expiredOrders.length} expired orders for product: ${productSlug}`);

        // Отменяем каждый истекший заказ
        let cancelledCount = 0;
        for (const order of expiredOrders) {
            try {
                const result = await returnOrderToCart(order.id, order.userId);
                if (result.success) {
                    cancelledCount++;
                    console.log(`✅ Cancelled expired order: ${order.id}`);
                } else {
                    console.log(`❌ Failed to cancel order ${order.id}: ${result.message}`);
                }
            } catch (error) {
                console.error(`Error cancelling order ${order.id}:`, error);
            }
        }

        return {
            success: true,
            data: `${cancelledCount}/${expiredOrders.length}`,
            message: `Se cancelaron ${cancelledCount} de ${expiredOrders.length} pedidos expirados`
        };

    } catch (error) {
        console.error('Error cleaning up expired orders:', error);
        return {
            success: false,
            data: null,
            message: formatError(error)
        };
    }
};