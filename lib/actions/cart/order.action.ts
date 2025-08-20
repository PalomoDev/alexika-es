'use server'
import {OrderSummary} from "@/lib/validations/cart/order-validation";
import {formatError} from "@/lib/utils";
import prisma from "@/lib/prisma";
import {Cart} from "@/lib/validations/cart/cart-validation";
import { Decimal } from '@prisma/client/runtime/library';


interface ActionResponse<T> {
    success: boolean;
    data?: T | null;
    message?: string;
}

interface OrderValidationResult {
    isValid: boolean;
    error?: string;
    cart?: Cart; // или типизировать согласно вашей Prisma схеме
}

const convertDecimalToNumber = (value: Decimal | number): number => {
    return value instanceof Decimal ? Number(value) : value;
};

const validateOrderCreation = async (userId: string): Promise<OrderValidationResult> => {
    // Verificar usuario
    const user = await prisma.user.findUnique({where: {id: userId}});
    if (!user) {
        return { isValid: false, error: 'Usuario no encontrado' };
    }

    // Buscar carrito
    const prismaCart = await prisma.cart.findFirst({
        where: { userId }
    });

    // Buscar [id] no pagada
    const unpaidOrder = await prisma.order.findFirst({
        where: {
            userId,
            isPaid: false
        }
    });

    // Если нет корзины но есть неоплаченный заказ
    if (!prismaCart && unpaidOrder) {
        return { isValid: false, error: 'Tienes un pedido sin pagar' };
    }

    if (!prismaCart) {
        return { isValid: false, error: 'Carrito no encontrado' };
    }

    // Проверить что корзина не пустая
    if (prismaCart.items.length === 0) {
        return { isValid: false, error: 'El carrito está vacío' };
    }

    // Если есть корзина и есть неоплаченный заказ
    if (unpaidOrder) {
        return { isValid: false, error: 'Tienes un pedido sin pagar' };
    }

    // DTO преобразование внутри функции
    const cart: Cart = {
        id: prismaCart.id,
        createdAt: prismaCart.createdAt,
        updatedAt: prismaCart.updatedAt,
        userId: prismaCart.userId,
        sessionCartId: prismaCart.sessionCartId,
        items: prismaCart.items,
        itemsPrice: convertDecimalToNumber(prismaCart.itemsPrice),
        totalPrice: convertDecimalToNumber(prismaCart.totalPrice),
        shippingPrice: convertDecimalToNumber(prismaCart.shippingPrice),
        taxPrice: convertDecimalToNumber(prismaCart.taxPrice),
        totalWeight: prismaCart.totalWeight ? convertDecimalToNumber(prismaCart.totalWeight) : null
    };

    return { isValid: true, cart };
};

export const createOrder = async (userId: string): Promise<ActionResponse<OrderSummary>> => {
    console.log('createOrder called with userId:', userId);
    try {
        console.log('Starting validation...');
        const validation = await validateOrderCreation(userId);
        console.log('Validation result:', validation);

        if (!validation.isValid) {
            console.log('Validation failed:', validation.error);
            return {
                success: false,
                data: null,
                message: validation.error!
            };
        }

        console.log('Логика создания заказа с validation.cart');

        const result = {
            success: true,
            data: {} as OrderSummary,
            message: 'Pedido creado exitosamente'
        };

        console.log('Returning result:', result);
        return result;

    } catch (error) {
        console.log('Error in createOrder:', error);
        return {
            success: false,
            data: null,
            message: formatError(error)
        }
    }
};