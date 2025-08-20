'use server'

import prisma from "@/lib/prisma";
import {formatError, formatNumberWithDecimal} from "@/lib/utils";
import {
    CartItem,
    cartItemSchema, CartUpdateData, ClientCart, CreateCart,

} from "@/lib/validations/cart/cart-validation";
import {cookies, headers} from 'next/headers';
import {auth} from "@/lib/auth";
import { revalidatePath } from 'next/cache'
import { Decimal } from '@prisma/client/runtime/library';
import {Cart} from "@prisma/client";
import {OrderCreate, OrderSummary} from "@/lib/validations/cart/order-validation";
import {ShippingAddress} from "@/lib/validations/user/address-validation";

type ActionResponse<T> = {
    success: boolean;
    data: T | null;
    message?: string;
}

const getCart = async () => {
    const headersList = await headers();
    const session = await auth.api.getSession({
        headers: headersList
    });

    if (session?.user) {
        // Для авторизованного пользователя ищем по userId
        return await prisma.cart.findFirst({
            where: { userId: session.user.id }
        });
    } else {
        // Для неавторизованного ищем по sessionCartId
        const cookieStore = await cookies();
        const sessionCartId = cookieStore.get('session-cart-id')?.value;

        if (!sessionCartId) return null;

        return await prisma.cart.findFirst({
            where: { sessionCartId }
        });
    }
};

export const checkCartByUserId = async (userId: string): Promise<boolean> => {
    try {
        const cart = await prisma.cart.findFirst({
            where: { userId: userId },
            select: { items: true }
        });

        // Если корзины нет
        if (!cart) {
            return false;
        }

        // Если нет поля items или оно null
        if (!cart.items) {
            return false;
        }

        // Если массив товаров пустой
        const cartItems = cart.items as CartItem[];
        if (cartItems.length === 0) {
            return false;
        }

        // Корзина существует и в ней есть товары
        return true;

    } catch (error) {
        console.error('Error getting cart by userId:', error);
        // При ошибке базы данных считаем что корзины нет
        return false;
    }
};

export const addItemToCart = async (item: CartItem): Promise<ActionResponse<CartItem>> => {
    try {
        console.log('Actions_Add_Item_To_Cart: ', item);

        const itemValidated = cartItemSchema.parse(item);

        // Получаем корзину
        let cart = await getCart();

        // Если нет корзины - создаем
        if (!cart) {
            const createResult = await createCart();
            if (!createResult.success) {
                return {
                    success: false,
                    data: null,
                    message: createResult.message
                };
            }

            // Получаем созданную корзину
            cart = await getCart();
        }

        if (!cart) {
            throw new Error('No se pudo crear o encontrar el carrito');
        }

        // Логика добавления товара
        const existingItems = (cart.items as CartItem[]) || [];
        const existingItemIndex = existingItems.findIndex(i => i.id === itemValidated.id);

        let updatedItems: CartItem[];

        if (existingItemIndex >= 0) {
            // Товар уже есть - увеличиваем количество
            updatedItems = [...existingItems];
            updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                qty: updatedItems[existingItemIndex].qty + 1
            };
        } else {
            // Новый товар - добавляем в корзину
            updatedItems = [...existingItems, itemValidated];
        }

        // Пересчитываем общую стоимость товаров
        const itemsPrice = updatedItems.reduce((sum, item) => {
            return sum.plus(new Decimal(item.price).mul(item.qty));
        }, new Decimal(0));

        // Обновляем корзину в базе
        const updatedCart = await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: updatedItems,
                itemsPrice: itemsPrice,
                totalPrice: itemsPrice.plus(cart.shippingPrice).plus(cart.taxPrice)
            }
        });

        console.log('Actions_Add_Item_To_Cart: ', itemValidated);
        console.log('Cart updated: ', updatedCart.id);

        revalidatePath('/', 'layout');

        return {
            success: true,
            data: itemValidated,
            message: `${itemValidated.name} añadido al carrito`
        };
    } catch (e: unknown) {
        return {
            success: false,
            data: null,
            message: formatError(e)
        };
    }
};

export const createCart = async (): Promise<ActionResponse<string>> => {
    try {
        const headersList = await headers();
        const session = await auth.api.getSession({
            headers: headersList
        });

        const cookieStore = await cookies();

        if (session?.user) {
            // Для авторизованного пользователя - ищем ВСЕ его корзины
            const sessionCartId = cookieStore.get('session-cart-id')?.value;

            const allUserCarts = await prisma.cart.findMany({
                where: {
                    OR: [
                        { userId: session.user.id }, // корзины пользователя
                        ...(sessionCartId ? [{ sessionCartId: sessionCartId }] : []) // сессионная корзина если есть
                    ]
                },
                orderBy: { updatedAt: 'desc' } // самая свежая первой
            });

            if (allUserCarts.length > 0) {
                // Объединяем корзины если их больше одной
                if (allUserCarts.length > 1) {
                    console.log(`Found ${allUserCarts.length} carts for user ${session.user.id}, merging...`);

                    // Собираем все товары из всех корзин
                    const allItems: CartItem[] = [];
                    let totalItemsPrice = 0;
                    let totalShippingPrice = 0;
                    let totalTaxPrice = 0;
                    let totalPrice = 0;

                    for (const cart of allUserCarts) {
                        const cartItems = cart.items as CartItem[];
                        allItems.push(...cartItems);
                        totalItemsPrice += Number(cart.itemsPrice);
                        totalShippingPrice += Number(cart.shippingPrice);
                        totalTaxPrice += Number(cart.taxPrice);
                        totalPrice += Number(cart.totalPrice);
                    }

                    // Объединяем одинаковые товары (суммируем количества)
                    const mergedItems = allItems.reduce((acc: CartItem[], item: CartItem) => {
                        const existingItem = acc.find((existing) => existing.id === item.id);
                        if (existingItem) {
                            existingItem.qty += item.qty;
                        } else {
                            acc.push({ ...item });
                        }
                        return acc;
                    }, []);

                    // Используем самую новую корзину как основную
                    const mainCart = allUserCarts[0];

                    // Обновляем основную корзину объединенными данными
                    const updatedCart = await prisma.cart.update({
                        where: { id: mainCart.id },
                        data: {
                            userId: session.user.id, // привязываем к пользователю
                            items: mergedItems,
                            itemsPrice: totalItemsPrice,
                            shippingPrice: totalShippingPrice,
                            taxPrice: totalTaxPrice,
                            totalPrice: totalPrice,
                            setOrder: false // сбрасываем флаг заказа
                        }
                    });

                    // Удаляем остальные корзины
                    const cartsToDelete = allUserCarts.slice(1).map(cart => cart.id);
                    if (cartsToDelete.length > 0) {
                        await prisma.cart.deleteMany({
                            where: {
                                id: {
                                    in: cartsToDelete
                                }
                            }
                        });
                    }

                    console.log(`Merged ${allUserCarts.length} carts into cart ${updatedCart.id}`);
                    console.log(`Total items: ${mergedItems.length}, Total price: ${totalPrice}`);

                    return {
                        success: true,
                        data: updatedCart.id,
                        message: `Carritos combinados - ${mergedItems.length} productos`
                    };
                } else {
                    // Только одна корзина - просто привязываем к пользователю если нужно
                    const existingCart = allUserCarts[0];

                    if (!existingCart.userId) {
                        await prisma.cart.update({
                            where: { id: existingCart.id },
                            data: {
                                userId: session.user.id,
                                setOrder: false
                            }
                        });
                    }

                    return {
                        success: true,
                        data: existingCart.id,
                        message: 'Carrito existente encontrado'
                    };
                }
            }

            // Создаем новую корзину только если совсем нет корзин
            const cart = await prisma.cart.create({
                data: {
                    userId: session.user.id,
                    sessionCartId: '',
                    items: [],
                    itemsPrice: 0,
                    totalPrice: 0,
                    shippingPrice: 0,
                    taxPrice: 0,
                    setOrder: false
                }
            });

            return {
                success: true,
                data: cart.id,
                message: 'Nuevo carrito creado'
            };

        } else {
            // Для неавторизованного пользователя (без изменений)
            let sessionCartId = cookieStore.get('session-cart-id')?.value;

            if (!sessionCartId) {
                sessionCartId = crypto.randomUUID();
                cookieStore.set('session-cart-id', sessionCartId, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 30 // 30 дней
                });
            }

            const existingCart = await prisma.cart.findFirst({
                where: { sessionCartId }
            });

            if (existingCart) {
                return {
                    success: true,
                    data: existingCart.id,
                    message: 'Carrito de sesión existente'
                };
            }

            // Создаем сессионную корзину
            const cart = await prisma.cart.create({
                data: {
                    userId: null,
                    sessionCartId,
                    items: [],
                    itemsPrice: 0,
                    totalPrice: 0,
                    shippingPrice: 0,
                    taxPrice: 0,
                    setOrder: false
                }
            });

            return {
                success: true,
                data: cart.id,
                message: 'Nuevo carrito de sesión creado'
            };
        }

    } catch (e: unknown) {
        console.error('Error in createCart:', e);
        return {
            success: false,
            data: null,
            message: formatError(e)
        };
    }
};

export async function getSessionCart(): Promise<ActionResponse<ClientCart>> {
    try {
        const cart = await getCart();

        if (!cart) {
            return {
                success: false,
                data: null,
                message: 'Carrito no encontrado'
            };
        }

        const cartDto = (cart: Cart): ClientCart => {
            return {
                id: cart.id,
                userId: cart.userId,
                sessionCartId: cart.sessionCartId,
                items: (cart.items as CartItem[]).map(item => ({
                    id: item.id,
                    name: item.name,
                    sku: item.sku,
                    price: item.price,
                    qty: item.qty,
                    image: item.image || '',
                    slug: item.slug,
                    weight: item.weight
                })),
                itemsPrice: formatNumberWithDecimal(Number(cart.itemsPrice)),
                totalPrice: formatNumberWithDecimal(Number(cart.totalPrice)),
                shippingPrice: formatNumberWithDecimal(Number(cart.shippingPrice)),
                taxPrice: formatNumberWithDecimal(Number(cart.taxPrice)),
                createdAt: cart.createdAt,
                updatedAt: cart.updatedAt
            }
        }

        return {
            success: true,
            data: cartDto(cart),
            message: 'Carrito obtenido con éxito'
        }

    } catch (e) {
        return {
            success: false,
            data: null,
            message: formatError(e)
        };
    }
}

export const removeItemFromCart = async (itemId: string): Promise<ActionResponse<string>> => {
    try {
        const cart = await getCart();

        if (!cart) {
            return {
                success: false,
                data: null,
                message: 'Carrito no encontrado'
            };
        }

        // Удаляем товар из корзины
        const existingItems = (cart.items as CartItem[]) || [];
        const updatedItems = existingItems.filter(item => item.id !== itemId);

        // Проверяем был ли товар в корзине
        if (existingItems.length === updatedItems.length) {
            return {
                success: false,
                data: null,
                message: 'Producto no encontrado en el carrito'
            };
        }

        // Пересчитываем общую стоимость товаров
        const itemsPrice = updatedItems.reduce((sum, item) => {
            return sum.plus(new Decimal(item.price).mul(item.qty));
        }, new Decimal(0));

        // Обновляем корзину в базе
        const updatedCart = await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: updatedItems,
                itemsPrice: itemsPrice,
                totalPrice: itemsPrice.plus(cart.shippingPrice).plus(cart.taxPrice)
            }
        });

        console.log('Item removed from cart: ', itemId);
        console.log('Cart updated: ', updatedCart.id);

        revalidatePath('/', 'layout');

        return {
            success: true,
            data: itemId,
            message: 'Producto eliminado del carrito'
        };

    } catch (e: unknown) {
        return {
            success: false,
            data: null,
            message: formatError(e)
        };
    }
};

export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<ActionResponse<CartItem>> => {
    try {
        // Валидация количества
        if (quantity < 0) {
            return {
                success: false,
                data: null,
                message: 'La cantidad no puede ser negativa'
            };
        }

        // Если количество 0 - удаляем товар
        if (quantity === 0) {
            const removeResult = await removeItemFromCart(itemId);
            return {
                success: removeResult.success,
                data: null,
                message: removeResult.message
            };
        }

        const cart = await getCart();

        if (!cart) {
            return {
                success: false,
                data: null,
                message: 'Carrito no encontrado'
            };
        }

        // Обновляем количество товара
        const existingItems = (cart.items as CartItem[]) || [];
        const itemIndex = existingItems.findIndex(item => item.id === itemId);

        if (itemIndex === -1) {
            return {
                success: false,
                data: null,
                message: 'Producto no encontrado en el carrito'
            };
        }

        const updatedItems = [...existingItems];
        updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            qty: quantity
        };

        // Пересчитываем общую стоимость товаров
        const itemsPrice = updatedItems.reduce((sum, item) => {
            return sum.plus(new Decimal(item.price).mul(item.qty));
        }, new Decimal(0));

        // Обновляем корзину в базе
        const updatedCart = await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: updatedItems,
                itemsPrice: itemsPrice,
                totalPrice: itemsPrice.plus(cart.shippingPrice).plus(cart.taxPrice)
            }
        });

        console.log('Item quantity updated: ', itemId, 'new quantity:', quantity);
        console.log('Cart updated: ', updatedCart.id);

        revalidatePath('/', 'layout');

        return {
            success: true,
            data: updatedItems[itemIndex],
            message: 'Cantidad del producto actualizada'
        };

    } catch (e: unknown) {
        return {
            success: false,
            data: null,
            message: formatError(e)
        };
    }
};

export const migrateSessionCartToUser = async (userId: string): Promise<ActionResponse<string>> => {
    try {
        const cookieStore = await cookies();
        const sessionCartId = cookieStore.get('session-cart-id')?.value;

        if (!sessionCartId) {
            return {
                success: true,
                data: 'No hay carrito de sesión para migrar',
                message: 'No se encontró carrito de sesión'
            };
        }

        // Находим сессионную корзину
        const sessionCart = await prisma.cart.findFirst({
            where: { sessionCartId }
        });

        if (!sessionCart) {
            return {
                success: true,
                data: 'Carrito de sesión no encontrado',
                message: 'Carrito de sesión no encontrado'
            };
        }

        // Находим корзину пользователя
        const userCart = await prisma.cart.findFirst({
            where: { userId }
        });

        if (userCart) {
            // Объединяем корзины
            const sessionItems = (sessionCart.items as CartItem[]) || [];
            const userItems = (userCart.items as CartItem[]) || [];

            // Объединяем товары (суммируем количество одинаковых)
            const mergedItems = [...userItems];

            sessionItems.forEach(sessionItem => {
                const existingIndex = mergedItems.findIndex(item => item.id === sessionItem.id);
                if (existingIndex >= 0) {
                    mergedItems[existingIndex].qty += sessionItem.qty;
                } else {
                    mergedItems.push(sessionItem);
                }
            });

            // Пересчитываем цены
            const itemsPrice = mergedItems.reduce((sum, item) => {
                return sum.plus(new Decimal(item.price).mul(item.qty));
            }, new Decimal(0));

            // Обновляем пользовательскую корзину
            await prisma.cart.update({
                where: { id: userCart.id },
                data: {
                    items: mergedItems,
                    itemsPrice: itemsPrice,
                    totalPrice: itemsPrice.plus(userCart.shippingPrice).plus(userCart.taxPrice)
                }
            });

        } else {
            // Преобразуем сессионную корзину в пользовательскую
            await prisma.cart.update({
                where: { id: sessionCart.id },
                data: {
                    userId: userId,
                    sessionCartId: ''
                }
            });
        }

        // Удаляем сессионную корзину если она была объединена
        if (userCart) {
            await prisma.cart.delete({
                where: { id: sessionCart.id }
            });
        }

        // Очищаем куку сессионной корзины
        cookieStore.delete('session-cart-id');

        revalidatePath('/', 'layout');

        return {
            success: true,
            data: 'Carrito migrado con éxito',
            message: 'Carrito de sesión migrado a la cuenta de usuario'
        };

    } catch (e: unknown) {
        return {
            success: false,
            data: null,
            message: formatError(e)
        };
    }
};

export const clearCartAfterPayment = async (): Promise<ActionResponse<string>> => {
    try {
        const cart = await getCart();

        if (!cart) {
            return {
                success: false,
                data: null,
                message: 'Carrito no encontrado'
            };
        }

        // Очищаем корзину
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: [],
                itemsPrice: 0,
                totalPrice: 0
            }
        });

        // Если это была сессионная корзина - очищаем куку
        if (cart.sessionCartId) {
            const cookieStore = await cookies();
            cookieStore.delete('session-cart-id');
        }

        revalidatePath('/', 'layout');

        return {
            success: true,
            data: 'Carrito vaciado',
            message: 'Carrito vaciado después del pago'
        };

    } catch (e: unknown) {
        return {
            success: false,
            data: null,
            message: formatError(e)
        };
    }
};


// lib/actions/cart/cart.action.ts



export const updateCartBeforeCheckout = async (cartUpdateData: CartUpdateData): Promise<ActionResponse<ClientCart>> => {
    try {
        const cart = await getCart();

        if (!cart) {
            return {
                success: false,
                data: null,
                message: 'Carrito no encontrado'
            };
        }

        // Получаем текущие товары в корзине
        const existingItems = (cart.items as CartItem[]) || [];

        // Применяем изменения количества
        const updatedItems = [...existingItems];

        // Если есть изменения - применяем их
        if (cartUpdateData.hasChanges && cartUpdateData.updates.length > 0) {
            cartUpdateData.updates.forEach(update => {
                const itemIndex = updatedItems.findIndex(item => item.id === update.itemId);

                if (itemIndex !== -1) {
                    updatedItems[itemIndex] = {
                        ...updatedItems[itemIndex],
                        qty: update.newQty
                    };
                    console.log(`Actualizado item ${update.name}: ${update.currentQty} -> ${update.newQty}`);
                }
            });
        }

        // Обновляем корзину в базе данных со всеми новыми значениями
        const updatedCart = await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: updatedItems,
                itemsPrice: new Decimal(cartUpdateData.summary.itemsPrice),
                taxPrice: new Decimal(cartUpdateData.summary.tax),
                shippingPrice: new Decimal(cartUpdateData.summary.shipping),
                totalPrice: new Decimal(cartUpdateData.summary.totalPrice),
                totalWeight: new Decimal(cartUpdateData.summary.totalWeight)
            }
        });

        console.log('Carrito actualizado antes del checkout:', {
            cartId: updatedCart.id,
            itemsCount: cartUpdateData.summary.itemsCount,
            itemsPrice: cartUpdateData.summary.itemsPrice,
            totalWeight: cartUpdateData.summary.totalWeight,
            totalPrice: cartUpdateData.summary.totalPrice,
            changesApplied: cartUpdateData.updates.length
        });

        // Ревалидация кеша
        revalidatePath('/', 'layout');

        // Формируем результат для возврата
        const clientCart: ClientCart = {
            id: updatedCart.id,
            userId: updatedCart.userId,
            sessionCartId: updatedCart.sessionCartId,
            items: updatedItems,
            itemsPrice: updatedCart.itemsPrice.toString(),
            shippingPrice: updatedCart.shippingPrice.toString(),
            taxPrice: updatedCart.taxPrice.toString(),
            totalPrice: updatedCart.totalPrice.toString(),
            totalWeight: updatedCart.totalWeight?.toString() || "0.0",
            createdAt: updatedCart.createdAt,
            updatedAt: updatedCart.updatedAt
        };

        return {
            success: true,
            data: clientCart,
            message: cartUpdateData.hasChanges
                ? `Carrito actualizado: ${cartUpdateData.updates.length} productos modificados`
                : 'Carrito sincronizado correctamente'
        };

    } catch (error: unknown) {
        console.error('Error al actualizar carrito antes del checkout:', error);

        return {
            success: false,
            data: null,
            message: formatError(error)
        };
    }
};

export const updateUserPaymentMethod = async (paymentMethod: string): Promise<ActionResponse<string>> => {
    try {
        // Получаем текущую сессию пользователя
        const headersList = await headers();
        const session = await auth.api.getSession({
            headers: headersList
        });

        if (!session?.user) {
            return {
                success: false,
                data: null,
                message: 'Usuario no autenticado'
            };
        }

        // Валидация метода оплаты
        const allowedMethods = ['stripe', 'paypal', 'cash', 'bizum', 'crypto'];
        if (!allowedMethods.includes(paymentMethod)) {
            return {
                success: false,
                data: null,
                message: 'Método de pago no válido'
            };
        }

        // Обновляем метод оплаты пользователя
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { paymentMethod }
        });

        console.log(`Payment method updated for user ${session.user.id}: ${paymentMethod}`);

        // Обновляем кеш
        revalidatePath('/', 'layout');

        return {
            success: true,
            data: paymentMethod,
            message: 'Método de pago guardado correctamente'
        };

    } catch (e: unknown) {
        console.error('Error updating payment method:', e);
        return {
            success: false,
            data: null,
            message: formatError(e)
        };
    }
};



export const getOrderDataFromCart = async (userId: string): Promise<ActionResponse<OrderCreate>> => {
    try {
        // Получаем текущую сессию для проверки авторизации
        const headersList = await headers();
        const session = await auth.api.getSession({
            headers: headersList
        });

        if (!session?.user || session.user.id !== userId) {
            return {
                success: false,
                data: null,
                message: 'No tienes autorización para ver este pedido'
            };
        }

        // Получаем пользователя с его корзиной
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                paymentMethod: true,
                carts: {
                    where: { userId },
                    select: {
                        id: true,
                        items: true,
                        itemsPrice: true,
                        shippingPrice: true,
                        taxPrice: true,
                        totalPrice: true,
                        totalWeight: true,
                        createdAt: true,
                        updatedAt: true
                    }
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

        // Получаем корзину пользователя
        const cart = user.carts[0]; // Берем первую корзину пользователя

        if (!cart || !cart.items || (cart.items as CartItem[]).length === 0) {
            return {
                success: false,
                data: null,
                message: 'El carrito está vacío'
            };
        }

        // Парсим адрес доставки из JSON
        const shippingAddress = user.address ? (user.address as ShippingAddress) : {
            street: '',
            apartment: '',
            city: '',
            province: '',
            postalCode: '',
            country: 'España',
            phone: '',
            instructions: ''
        };

        // Преобразуем товары корзины в формат заказа
        const orderItems = (cart.items as CartItem[]).map(item => ({
            orderId: cart.id, // Временно используем ID корзины
            productId: item.id,
            qty: item.qty,
            price: Number(item.price),
            name: item.name,
            slug: item.slug,
            image: item.image || ''
        }));

        // Формируем объект заказа
        const orderSummary: OrderCreate = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            userId: user.id,
            paymentMethod: user.paymentMethod || 'stripe',
            itemsPrice: Number(cart.itemsPrice),
            shippingPrice: Number(cart.shippingPrice),
            taxPrice: Number(cart.taxPrice),
            totalPrice: Number(cart.totalPrice),
            shippingAddress,
            items: orderItems
        };

        console.log('Order data from cart retrieved:', {
            userId,
            cartId: cart.id,
            itemsCount: orderItems.length,
            totalPrice: cart.totalPrice
        });

        return {
            success: true,
            data: orderSummary,
            message: 'Datos del pedido obtenidos correctamente'
        };

    } catch (e: unknown) {
        console.error('Error getting [id] data from cart:', e);
        return {
            success: false,
            data: null,
            message: formatError(e)
        };
    }
};