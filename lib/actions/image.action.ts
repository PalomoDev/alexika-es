'use server'

import prisma from "@/lib/prisma";
import { formatError } from "@/lib/utils";
import { uuidSchema } from "@/lib/validations/base";

type ActionResponse<T = undefined> = {
    success: boolean;
    data: T | null;
    message?: string;
};

export type ImageData = {
    id: string;
    filename: string;
    url: string;
    alt: string | null;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
};

export async function getImageById(id: string): Promise<ActionResponse<ImageData>> {
    try {
        const validatedId = uuidSchema.parse(id);

        const image = await prisma.image.findUnique({
            where: {
                id: validatedId,
                isDeleted: false // Проверяем что изображение не удалено
            },
            select: {
                id: true,
                filename: true,
                url: true,
                alt: true,
                sortOrder: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!image) {
            return {
                success: false,
                data: null,
                message: 'Image not found'
            };
        }

        return {
            success: true,
            data: image,
            message: 'Image retrieved successfully'
        };

    } catch (error) {
        return {
            success: false,
            data: null,
            message: formatError(error)
        };
    }
}






export type FeatureInput = {
    id: string;
    name: string;
    key: string;
    imageIds: string[];
    description: string | null;
};

// Тип для результата с изображением
export type FeatureWithImage = {
    id: string;
    name: string;
    key: string;
    description: string | null;
    imageUrl: string | null;
    imageAlt: string | null;
};

export async function getFeaturesWithImages(features: FeatureInput[]): Promise<ActionResponse<FeatureWithImage[]>> {
    try {
        // Собираем все уникальные ID первых изображений
        const allImageIds = features
            .map(feature => feature.imageIds[0])
            .filter(Boolean);

        if (allImageIds.length === 0) {
            // Если нет изображений, возвращаем особенности без изображений
            const featuresWithoutImages = features.map(feature => ({
                id: feature.id,
                name: feature.name,
                key: feature.key,
                description: feature.description,
                imageUrl: null,
                imageAlt: null
            }));

            return {
                success: true,
                data: featuresWithoutImages,
                message: 'Features retrieved without images'
            };
        }

        // Один запрос для всех изображений
        const images = await prisma.image.findMany({
            where: {
                id: { in: allImageIds },
                isDeleted: false
            },
            select: {
                id: true,
                url: true,
                alt: true
            }
        });

        // Создаем Map для быстрого поиска изображений
        const imageMap = new Map(images.map(img => [img.id, img]));

        // Формируем результат
        const featuresWithImages = features.map(feature => {
            const firstImageId = feature.imageIds[0];
            const image = firstImageId ? imageMap.get(firstImageId) : null;

            return {
                id: feature.id,
                name: feature.name,
                key: feature.key,
                description: feature.description,
                imageUrl: image?.url || null,
                imageAlt: image?.alt || null
            };
        });

        return {
            success: true,
            data: featuresWithImages,
            message: 'Features with images retrieved successfully'
        };

    } catch (error) {
        return {
            success: false,
            data: null,
            message: formatError(error)
        };
    }
}