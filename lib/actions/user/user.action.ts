'use server'
import {UserBase} from "@/lib/validations/product/base";
import {formatError} from "@/lib/utils";
import prisma from "@/lib/prisma";
import {ShippingAddress, ShippingAddressSchema} from "@/lib/validations/user/address-validation";

interface ActionResponse<T> {
    success: boolean;
    data: T | null;
    message: string;
}

export const getUserWithAddress = async (id: string): Promise<ActionResponse<UserBase>> => {
    try {

        const user = await prisma.user.findUnique({
            where: { id }
        })
        return {
            success: true,
            data: user,
            message: 'User retrieved successfully'
        }

    } catch (error) {
        return {
            success: false,
            data: null,
            message: formatError(error)
        }
    }
}

export const updateUserAddress = async (addressData: ShippingAddress & { userId: string }): Promise<ActionResponse<UserBase>> => {
    try {
        const { userId, ...address } = addressData;

        // Валидируем данные адреса
        const validationResult = ShippingAddressSchema.safeParse(address);

        if (!validationResult.success) {
            return {
                success: false,
                data: null,
                message: 'Datos de dirección inválidos: ' + validationResult.error.issues.map(i => i.message).join(', ')
            }
        }

        // Проверяем существование пользователя
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            return {
                success: false,
                data: null,
                message: 'Usuario no encontrado'
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                address: validationResult.data // Используем валидированные данные
            }
        });

        return {
            success: true,
            data: updatedUser,
            message: 'Dirección actualizada correctamente'
        }
    } catch (error) {
        return {
            success: false,
            data: null,
            message: formatError(error)
        }
    }
}