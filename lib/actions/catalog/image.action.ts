"use server"

import prisma from '@/lib/prisma'
import { formatError } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
    createImageSchema,
    updateImageSchema,
    getImagesByIdsSchema,
    deleteImageSchema,
    CreateImage,
    UpdateImage,
    GetImagesByIds,
    DeleteImage, CreatedImageResponse
} from "@/lib/validations/product/image-validation"
import { ActionResponse } from "@/types/action.type"
import { imageBaseSchema } from "@/lib/validations/product/base"

type ImageResponse = z.infer<typeof imageBaseSchema>

/**
 * Создает новое изображение в базе данных
 */
export async function createImage(data: CreateImage): Promise<ActionResponse<CreatedImageResponse>> {
    try {
        const validatedData = createImageSchema.parse(data);

        // Проверяем уникальность filename и url
        const existingImage = await prisma.image.findFirst({
            where: {
                OR: [
                    { filename: validatedData.filename },
                    { url: validatedData.url }
                ],
                isDeleted: false
            }
        });

        if (existingImage) {
            return {
                success: false,
                message: 'Image with this filename or URL already exists'
            };
        }

        const image = await prisma.image.create({
            data: validatedData
        });

        return {
            success: true,
            data: image,
            message: 'Image created successfully'
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: error.issues.map(e => e.message).join(', ')
            };
        }

        return {
            success: false,
            message: formatError(error)
        };
    }
}

/**
 * Получает изображения по массиву ID
 */
export async function getImagesByIds(data: GetImagesByIds): Promise<ActionResponse<ImageResponse[]>> {
    try {
        const { ids } = getImagesByIdsSchema.parse(data);

        const images = await prisma.image.findMany({
            where: {
                id: { in: ids },
                isDeleted: false
            },
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' }
            ]
        });

        // Проверяем что все запрошенные изображения найдены
        const foundIds = images.map(img => img.id);
        const missingIds = ids.filter(id => !foundIds.includes(id));

        if (missingIds.length > 0) {
            console.warn(`Images not found: ${missingIds.join(', ')}`);
        }

        return {
            success: true,
            data: images
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: error.issues.map(e => e.message).join(', ')
            };
        }

        return {
            success: false,
            message: formatError(error)
        };
    }
}

/**
 * Обновляет изображение (alt и sortOrder)
 */
export async function updateImage(data: UpdateImage): Promise<ActionResponse> {
    try {
        const validatedData = updateImageSchema.parse(data);
        const { id, ...updateData } = validatedData;

        const existingImage = await prisma.image.findFirst({
            where: {
                id,
                isDeleted: false
            }
        });

        if (!existingImage) {
            return {
                success: false,
                message: 'Image not found'
            };
        }

        await prisma.image.update({
            where: { id },
            data: updateData
        });

        revalidatePath('/admin'); // Invalidate admin cache
        return {
            success: true,
            message: 'Image updated successfully'
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: error.issues.map(e => e.message).join(', ')
            };
        }

        return {
            success: false,
            message: formatError(error)
        };
    }
}

/**
 * Мягкое удаление изображения
 */
export async function softDeleteImage(data: DeleteImage): Promise<ActionResponse> {
    try {
        const { id } = deleteImageSchema.parse(data);

        const existingImage = await prisma.image.findFirst({
            where: {
                id,
                isDeleted: false
            }
        });

        if (!existingImage) {
            return {
                success: false,
                message: 'Image not found'
            };
        }

        await prisma.image.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        });

        revalidatePath('/admin'); // Invalidate admin cache
        return {
            success: true,
            message: 'Image deleted successfully'
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: error.issues.map(e => e.message).join(', ')
            };
        }

        return {
            success: false,
            message: formatError(error)
        };
    }
}

/**
 * Получает одно изображение по ID
 */
export async function getImageById(id: string): Promise<ActionResponse<ImageResponse>> {
    try {
        const image = await prisma.image.findFirst({
            where: {
                id,
                isDeleted: false
            }
        });

        if (!image) {
            return {
                success: false,
                message: 'Image not found'
            };
        }

        return {
            success: true,
            data: image
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}

/**
 * Получает все активные изображения с пагинацией
 */
export async function getAllImages(page: number = 1, limit: number = 20): Promise<ActionResponse<{
    images: ImageResponse[];
    total: number;
    pages: number;
}>> {
    try {
        const skip = (page - 1) * limit;

        const [images, total] = await Promise.all([
            prisma.image.findMany({
                where: { isDeleted: false },
                orderBy: [
                    { sortOrder: 'asc' },
                    { createdAt: 'desc' }
                ],
                skip,
                take: limit
            }),
            prisma.image.count({
                where: { isDeleted: false }
            })
        ]);

        const pages = Math.ceil(total / limit);

        return {
            success: true,
            data: {
                images,
                total,
                pages
            }
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}