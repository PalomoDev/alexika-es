'use server'

import prisma from "@/lib/prisma";
import { formatError } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { CartItem } from "@/lib/validations/cart/cart-validation";
import {OrderSummary} from "@/lib/validations/cart/order-validation";
import {ShippingAddress} from "@/lib/validations/user/address-validation";

type ActionResponse<T> = {
    success: boolean;
    data: T | null;
    message?: string;
}

// Тип для проблем с наличием товаров
interface StockIssue {
    productId: string;
    productName: string;
    requestedQty: number;
    availableQty: number;
    sku: string;
}

interface StockCheckResult {
    hasIssues: boolean;
    issues: StockIssue[];
    totalItems: number;
}

/**
 * Проверяет наличие товаров на складе
 */
export const checkStockAvailability = async (userId: string): Promise<ActionResponse<StockCheckResult>> => {
    try {


        // Получаем корзину пользователя
        const cart = await prisma.cart.findFirst({
            where: { userId },
            select: { items: true }
        });

        if (!cart || !cart.items || (cart.items as CartItem[]).length === 0) throw new Error('No se puede verificar el stock: el carrito está vacío o no existe');


        const cartItems = cart.items as CartItem[];
        const issues: StockIssue[] = [];



        // Проверяем каждый товар в корзине
        for (const item of cartItems) {


            // Получаем актуальную информацию о товаре
            const product = await prisma.product.findUnique({
                where: { id: item.id },
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    stock: true,
                    isActive: true
                }
            });

            // Товар не найден в базе данных
            if (!product) {

                issues.push({
                    productId: item.id,
                    productName: item.name,
                    requestedQty: item.qty,
                    availableQty: 0,
                    sku: item.sku
                });
                continue;
            }

            // Товар неактивен
            if (!product.isActive) {

                issues.push({
                    productId: item.id,
                    productName: product.name,
                    requestedQty: item.qty,
                    availableQty: 0,
                    sku: product.sku
                });
                continue;
            }

            // Проверяем наличие на складе
            if (product.stock < item.qty) {

                issues.push({
                    productId: item.id,
                    productName: product.name,
                    requestedQty: item.qty,
                    availableQty: product.stock,
                    sku: product.sku
                });
            }
        }

        const result = {
            hasIssues: issues.length > 0,
            issues,
            totalItems: cartItems.length
        };



        // Всегда возвращаем success: true, потому что проверка выполнена успешно
        return {
            success: true,
            data: result,
            message: issues.length > 0
                ? `Se encontraron ${issues.length} problemas de disponibilidad de ${cartItems.length} productos`
                : `Todos los ${cartItems.length} productos están disponibles`
        };

    } catch (error: unknown) {
        console.error('Error crítico en verificación de stock:', error);

        // Только технические ошибки попадают сюда
        return {
            success: false,
            data: null,
            message: `Error técnico al verificar disponibilidad: ${formatError(error)}`
        };
    }
};

/**
 * Создает заказ из корзины, бронирует товары и удаляет корзину
 */
export const createOrderFromCart = async (userId: string): Promise<ActionResponse<string>> => {
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
                message: 'No tienes autorización'
            };
        }

        const existingOrder = await prisma.order.findFirst({
            where: { userId, status: 'pending', isPaid: false }
        });
        if (existingOrder) return { success: true, data: existingOrder.id, message: 'Ya existe un pedido pendiente' };

        // Получаем пользователя с корзиной
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                carts: {
                    where: { userId }
                }
            }
        });

        if (!user) {
            return {
                success: false,
                data: null,
                message: 'Usuario no encontrado'
            };
        }

        const cart = user.carts[0];
        if (!cart || !cart.items || (cart.items as CartItem[]).length === 0) {
            return {
                success: false,
                data: null,
                message: 'El carrito está vacío'
            };
        }

        const cartItems = cart.items as CartItem[];



        // Начинаем транзакцию
        const result = await prisma.$transaction(async (tx) => {
            // 1. Создаем заказ
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    shippingAddress: user.address || {},
                    paymentMethod: user.paymentMethod || 'stripe',
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    taxPrice: cart.taxPrice,
                    totalPrice: cart.totalPrice,
                    status: 'pending',
                    isPaid: false,
                    isDelivered: false
                }
            });

            // 2. Создаем позиции заказа и бронируем товары
            for (const item of cartItems) {
                // Создаем позицию заказа
                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: item.id,
                        qty: item.qty,
                        price: item.price,
                        name: item.name,
                        slug: item.slug,
                        image: item.image || ''
                    }
                });

                // Бронируем товар (уменьшаем stock)
                await tx.product.update({
                    where: { id: item.id },
                    data: {
                        stock: {
                            decrement: item.qty
                        }
                    }
                });

                console.log(`Product ${item.sku} reserved: ${item.qty} units`);
            }


            await tx.cart.update({
                where: { id: cart.id },
                data: { setOrder: true }
            });



            return order.id;
        });



        return {
            success: true,
            data: result,
            message: `Pedido ${result.slice(-8).toUpperCase()} creado exitosamente`
        };

    } catch (e: unknown) {
        console.error('Error creating [id] from cart:', e);
        return {
            success: false,
            data: null,
            message: formatError(e)
        };
    }
};

/**
 * Возвращает товары из заказа обратно в корзину и отменяет заказ
 */
export const returnOrderToCart = async (orderId: string, userId: string): Promise<ActionResponse<string>> => {
    try {
        console.log(`🔄 Cancelling order ${orderId} and returning stock for user ${userId}`);

        // Получаем заказ с товарами
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderitems: true
            }
        });

        if (!order) {
            return {
                success: false,
                data: null,
                message: 'Pedido no encontrado'
            };
        }

        if (order.userId !== userId) {
            return {
                success: false,
                data: null,
                message: 'No tienes autorización'
            };
        }

        if (order.isPaid) {
            return {
                success: false,
                data: null,
                message: 'El pedido ya está pagado y no puede ser cancelado'
            };
        }

        if (order.status === 'cancelled') {
            return {
                success: false,
                data: null,
                message: 'El pedido ya está cancelado'
            };
        }

        // Начинаем транзакцию
        const result = await prisma.$transaction(async (tx) => {
            // 1. Возвращаем товары на склад
            for (const orderItem of order.orderitems) {
                await tx.product.update({
                    where: { id: orderItem.productId },
                    data: {
                        stock: {
                            increment: orderItem.qty
                        }
                    }
                });

                console.log(`Product ${orderItem.slug} returned to stock: ${orderItem.qty} units`);
            }

            // 2. Устанавливаем статус заказа как "cancelled"
            await tx.order.update({
                where: { id: order.id },
                data: {
                    status: 'cancelled'
                }
            });

            // 3. Находим корзину пользователя и устанавливаем setOrder = false
            const userCart = await tx.cart.findFirst({
                where: {
                    userId: userId,
                    setOrder: true
                }
            });

            if (userCart) {
                await tx.cart.update({
                    where: { id: userCart.id },
                    data: {
                        setOrder: false
                    }
                });

                console.log(`Cart ${userCart.id} setOrder flag changed to false`);
            } else {
                console.log('No cart found with setOrder = true for this user');
            }

            console.log('Order cancelled and stock returned:', {
                orderId: order.id,
                status: 'cancelled',
                itemsCount: order.orderitems.length,
                cartUpdated: !!userCart
            });

            return order.id;
        });

        // Убираем revalidatePath чтобы не было ошибки
        // revalidatePath('/', 'layout');

        return {
            success: true,
            data: result,
            message: 'El pedido ha sido cancelado y los productos devueltos al stock'
        };

    } catch (e: unknown) {
        console.error('Error cancelling order:', e);
        return {
            success: false,
            data: null,
            message: formatError(e)
        };
    }
};

/**
 * Получает данные заказа для отображения
 */
export const getOrderData = async (userId: string): Promise<ActionResponse<OrderSummary>> => {
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
                message: 'No tienes autorización'
            };
        }

        // Ищем активный неоплаченный заказ
        const order = await prisma.order.findFirst({
            where: {
                userId,
                isPaid: false,
                status: 'pending'
            },
            include: {
                orderitems: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        address: true,
                        paymentMethod: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!order) {
            return {
                success: false,
                data: null,
                message: 'No hay pedidos pendientes'
            };
        }

        // Формируем данные для UI
        const orderData = {
            user: {
                id: order.user.id,
                name: order.user.name,
                email: order.user.email
            },
            id: order.id,
            userId: order.userId,
            paymentMethod: order.paymentMethod,
            paymentResult: order.paymentResult,
            itemsPrice: Number(order.itemsPrice),
            shippingPrice: Number(order.shippingPrice),
            taxPrice: Number(order.taxPrice),
            totalPrice: Number(order.totalPrice),
            shippingAddress: order.shippingAddress as ShippingAddress,
            isPaid: order.isPaid,
            paidAt: order.paidAt,
            isDelivered: order.isDelivered,
            deliveredAt: order.deliveredAt,
            status: order.status as "pending" | "processing" | "shipped" | "delivered" | "cancelled",
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: order.orderitems.map(item => ({
                orderId: item.orderId,
                productId: item.productId,
                qty: item.qty,
                price: Number(item.price),
                name: item.name,
                slug: item.slug,
                image: item.image
            }))
        };

        return {
            success: true,
            data: orderData,
            message: 'Datos del pedido obtenidos correctamente'
        };

    } catch (e: unknown) {
        console.error('Error getting [id] data:', e);
        return {
            success: false,
            data: null,
            message: formatError(e)
        };
    }
};

