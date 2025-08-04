"use server"

import prisma from '@/lib/prisma'
import { formatError } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
    createFeatureSchema,
    updateFeatureSchema,
    FeatureCreate,
    FeatureUpdate,
    FeatureFullResponse
} from "@/lib/validations/product/feature-validation"
import { ActionResponse } from "@/types/action.type";
import { ROUTES } from "@/lib/constants/routes";

// Создание особенности
export async function createFeature(data: FeatureCreate): Promise<ActionResponse<{ id: string }>> {
    try {
        const validatedData = createFeatureSchema.parse(data);
        const existingKey = await prisma.feature.findUnique({
            where: { key: validatedData.key }
        });

        if (existingKey) {
            return {
                success: false,
                message: 'Feature with this key already exists'
            };
        }

        const feature = await prisma.feature.create({
            data: validatedData
        });

        revalidatePath(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=features`);
        return {
            success: true,
            data: { id: feature.id },
            message: 'Feature created successfully'
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

// Обновление особенности
export async function updateFeature(data: FeatureUpdate): Promise<ActionResponse<{ id: string }>> {
    try {
        const validatedData = updateFeatureSchema.parse(data);
        const { id, ...featureData } = validatedData;

        if (!id) {
            return {
                success: false,
                message: 'Feature ID is required'
            };
        }

        // Проверяем уникальность key (если передан)
        if (featureData.key) {
            const existingFeature = await prisma.feature.findFirst({
                where: {
                    key: featureData.key,
                    id: { not: id }
                }
            });

            if (existingFeature) {
                return {
                    success: false,
                    message: 'Feature with this key already exists'
                };
            }
        }

        const feature = await prisma.feature.update({
            where: { id },
            data: featureData
        });

        revalidatePath(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=features`);
        return {
            success: true,
            data: { id: feature.id },
            message: 'Feature updated successfully'
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

// Удаление особенности
export async function deleteFeature(id: string): Promise<ActionResponse<undefined>> {
    try {
        if (!id) {
            return {
                success: false,
                message: 'Valid feature ID is required'
            };
        }

        // Проверяем существование особенности
        const existingFeature = await prisma.feature.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        productFeatures: true
                    }
                }
            }
        });

        if (!existingFeature) {
            return {
                success: false,
                message: 'Feature not found'
            };
        }

        // Проверяем есть ли связанные продукты
        if (existingFeature._count.productFeatures > 0) {
            return {
                success: false,
                message: `Cannot delete feature. It is used by ${existingFeature._count.productFeatures} products`
            };
        }

        // Удаляем особенность
        await prisma.feature.delete({
            where: { id }
        });

        revalidatePath(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=features`);

        return {
            success: true,
            message: 'Feature deleted successfully'
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

// Получение всех особенностей
// Обновленная функция getFeatures - добавить include для категории
export const getFeatures = async (): Promise<ActionResponse<FeatureFullResponse[]>> => {
    try {
        const features = await prisma.feature.findMany({
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                }
            },
            orderBy: [
                { sortOrder: 'asc' },
                { name: 'asc' },
            ],
        });

        // Получаем все уникальные imageIds из всех особенностей
        const allImageIds = features.flatMap(feature => feature.imageIds);
        const uniqueImageIds = [...new Set(allImageIds)];

        // Получаем изображения одним запросом
        const images = await prisma.image.findMany({
            where: {
                id: { in: uniqueImageIds },
                isDeleted: false,
            },
            select: {
                id: true,
                url: true,
                alt: true,
                sortOrder: true,
            },
        });

        // Создаем Map для быстрого поиска изображений
        const imageMap = new Map(images.map(img => [img.id, img]));

        // Формируем результат с подключенными изображениями и категорией
        const featuresWithImages: FeatureFullResponse[] = features.map(feature => ({
            id: feature.id,
            name: feature.name,
            key: feature.key,
            description: feature.description,
            categoryId: feature.categoryId,
            category: feature.category,
            isActive: feature.isActive,
            sortOrder: feature.sortOrder,
            createdAt: feature.createdAt,
            updatedAt: feature.updatedAt,
            images: feature.imageIds
                .map(id => imageMap.get(id))
                .filter((img): img is NonNullable<typeof img> => img !== undefined)
                .sort((a, b) => a.sortOrder - b.sortOrder),
        }));

        return {
            success: true,
            data: featuresWithImages,
        }
    } catch (error) {
        console.error('Error fetching features:', error);
        return {
            success: false,
            message: 'Failed to fetch features',
        };
    }
}

// Обновленная функция getFeatureById - добавить include для категории
export const getFeatureById = async (id: string): Promise<{
    success: boolean;
    data?: FeatureFullResponse;
    message?: string;
}> => {
    try {
        const feature = await prisma.feature.findUnique({
            where: { id },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                }
            }
        });

        if (!feature) {
            return {
                success: false,
                message: 'Feature not found',
            };
        }

        // Получаем изображения
        const images = await prisma.image.findMany({
            where: {
                id: { in: feature.imageIds },
                isDeleted: false,
            },
            select: {
                id: true,
                url: true,
                alt: true,
                sortOrder: true,
            },
            orderBy: {
                sortOrder: 'asc'
            }
        });

        const featureWithImages: FeatureFullResponse = {
            id: feature.id,
            name: feature.name,
            key: feature.key,
            description: feature.description,
            categoryId: feature.categoryId,
            category: feature.category,
            isActive: feature.isActive,
            sortOrder: feature.sortOrder,
            createdAt: feature.createdAt,
            updatedAt: feature.updatedAt,
            images: images,
        };

        return {
            success: true,
            data: featureWithImages,
        };
    } catch (error) {
        console.error('Error fetching feature:', error);
        return {
            success: false,
            message: 'Failed to fetch feature',
        };
    }
};