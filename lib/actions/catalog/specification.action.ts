"use server"

import prisma from '@/lib/prisma'
import { formatError } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
    createSpecificationSchema,
    updateSpecificationSchema,
    SpecificationCreate,
    SpecificationUpdate,
    SpecificationFullResponse, SpecificationResponseForProducts
} from "@/lib/validations/product/specification-validation"
import { ActionResponse } from "@/types/action.type";
import { ROUTES } from "@/lib/constants/routes";

// Создание спецификации
export async function createSpecification(data: SpecificationCreate): Promise<ActionResponse<{ id: string }>> {
    try {
        const validatedData = createSpecificationSchema.parse(data);
        const { categoryIds, ...specificationData } = validatedData;

        // Проверяем уникальность name
        const existingName = await prisma.specification.findUnique({
            where: { name: specificationData.name }
        });

        if (existingName) {
            return {
                success: false,
                message: 'Specification with this name already exists'
            };
        }

        // Проверяем уникальность key
        const existingKey = await prisma.specification.findUnique({
            where: { key: specificationData.key }
        });

        if (existingKey) {
            return {
                success: false,
                message: 'Specification with this key already exists'
            };
        }

        // Создаем спецификацию в транзакции
        const result = await prisma.$transaction(async (tx) => {
            // Создаем спецификацию
            const specification = await tx.specification.create({
                data: specificationData
            });

            // Создаем связи с категориями
            if (categoryIds && categoryIds.length > 0) {
                await tx.categorySpecification.createMany({
                    data: categoryIds.map(categoryId => ({
                        categoryId,
                        specificationId: specification.id,
                        isRequired: false, // По умолчанию не обязательная
                        sortOrder: 0
                    }))
                });
            }

            return specification;
        });

        revalidatePath(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=specifications`);
        return {
            success: true,
            data: { id: result.id },
            message: 'Specification created successfully'
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

// Обновление спецификации
export async function updateSpecification(data: SpecificationUpdate): Promise<ActionResponse<{ id: string }>> {


    try {
        const validatedData = updateSpecificationSchema.parse(data);
        const { id, categoryIds, ...specificationData } = validatedData;

        if (!id) {
            return {
                success: false,
                message: 'Specification ID is required',
            };
        }

        // Проверка уникальности name
        if (specificationData.name) {
            const existingName = await prisma.specification.findFirst({
                where: {
                    name: specificationData.name,
                    id: { not: id },
                },
            });
            if (existingName) {
                return {
                    success: false,
                    message: 'Specification with this name already exists',
                };
            }
        }

        // Проверка уникальности key
        if (specificationData.key) {
            const existingKey = await prisma.specification.findFirst({
                where: {
                    key: specificationData.key,
                    id: { not: id },
                },
            });
            if (existingKey) {
                return {
                    success: false,
                    message: 'Specification with this key already exists',
                };
            }
        }

        // 🛠 Обновление основной спецификации
        const updatedSpecification = await prisma.specification.update({
            where: { id },
            data: specificationData,
        });

        // 🔄 Обновление связей с категориями (если categoryIds переданы)
        if (categoryIds) {
            // Удаляем все старые связи
            await prisma.categorySpecification.deleteMany({
                where: { specificationId: id },
            });

            // Добавляем новые связи
            const newCategoryLinks = categoryIds.map((categoryId, index) => ({
                specificationId: id,
                categoryId,
                isRequired: false,     // или по умолчанию true, если нужно
                sortOrder: index,
            }));

            await prisma.categorySpecification.createMany({
                data: newCategoryLinks,
            });
        }

        revalidatePath(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=specifications`);

        return {
            success: true,
            data: { id: updatedSpecification.id },
            message: 'Specification updated successfully',
        };

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error);
            return {
                success: false,
                message: error.issues.map(e => e.message).join(', '),
            };
        }
        console.error('Unexpected error:', error);
        return {
            success: false,
            message: formatError(error),
        };
    }
}


// Удаление спецификации
export async function deleteSpecification(id: string): Promise<ActionResponse<undefined>> {
    try {
        if (!id) {
            return {
                success: false,
                message: 'Valid specification ID is required'
            };
        }

        // Проверяем существование спецификации
        const existingSpecification = await prisma.specification.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        productSpecifications: true,
                        categorySpecs: true
                    }
                }
            }
        });

        if (!existingSpecification) {
            return {
                success: false,
                message: 'Specification not found'
            };
        }

        // Проверяем есть ли связанные продукты - они блокируют удаление
        if (existingSpecification._count.productSpecifications > 0) {
            return {
                success: false,
                message: `Cannot delete specification. It is used by ${existingSpecification._count.productSpecifications} products. Remove it from products first.`
            };
        }

        // Удаляем спецификацию в транзакции
        await prisma.$transaction(async (tx) => {
            // Удаляем связи с категориями (если есть)
            if (existingSpecification._count.categorySpecs > 0) {
                await tx.categorySpecification.deleteMany({
                    where: { specificationId: id }
                });
            }

            // Удаляем саму спецификацию
            await tx.specification.delete({
                where: { id }
            });
        });

        revalidatePath(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=specifications`);

        return {
            success: true,
            message: 'Specification deleted successfully'
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

// Получение всех спецификаций
export const getSpecifications = async (): Promise<ActionResponse<SpecificationFullResponse[]>> => {
    try {
        const specifications = await prisma.specification.findMany({
            include: {
                _count: {
                    select: {
                        productSpecifications: true,
                        categorySpecs: true
                    }
                },
                categorySpecs: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                    orderBy: {
                        sortOrder: 'asc'
                    }
                },
            },
            orderBy: [
                { category: 'asc' },
                { sortOrder: 'asc' },
                { name: 'asc' },
            ],
        });

        // Получаем все уникальные imageIds из всех спецификаций
        const allImageIds = specifications.flatMap(spec => spec.imageIds);
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

        // Формируем результат с подключенными изображениями
        const specificationsWithImages: SpecificationFullResponse[] = specifications.map(spec => ({
            id: spec.id,
            name: spec.name,
            key: spec.key,
            description: spec.description,
            unit: spec.unit,
            type: spec.type as "number" | "text",
            category: spec.category,
            isActive: spec.isActive,
            sortOrder: spec.sortOrder,
            createdAt: spec.createdAt,
            updatedAt: spec.updatedAt,
            images: spec.imageIds
                .map(id => imageMap.get(id))
                .filter((img): img is NonNullable<typeof img> => img !== undefined)
                .sort((a, b) => a.sortOrder - b.sortOrder),
            _count: spec._count,
            categorySpecs: spec.categorySpecs,
        }));

        return {
            success: true,
            data: specificationsWithImages,
        }
    } catch (error) {
        console.error('Error fetching specifications:', error);
        return {
            success: false,
            message: 'Failed to fetch specifications',
        };
    }
}

// Получение спецификации по ID
export const getSpecificationById = async (id: string): Promise<{
    success: boolean;
    data?: SpecificationFullResponse;
    message?: string;
}> => {
    try {
        const specification = await prisma.specification.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        productSpecifications: true,
                        categorySpecs: true
                    }
                },
                categorySpecs: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                    orderBy: {
                        sortOrder: 'asc'
                    }
                },
            },
        });

        if (!specification) {
            return {
                success: false,
                message: 'Specification not found',
            };
        }

        // Получаем изображения
        const images = await prisma.image.findMany({
            where: {
                id: { in: specification.imageIds },
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

        const specificationWithImages: SpecificationFullResponse = {
            id: specification.id,
            name: specification.name,
            key: specification.key,
            description: specification.description,
            unit: specification.unit,
            type: specification.type as "number" | "text",
            category: specification.category,
            isActive: specification.isActive,
            sortOrder: specification.sortOrder,
            createdAt: specification.createdAt,
            updatedAt: specification.updatedAt,
            images: images,
            _count: specification._count, categorySpecs: specification.categorySpecs,

        };

        return {
            success: true,
            data: specificationWithImages,
        };
    } catch (error) {
        console.error('Error fetching specification:', error);
        return {
            success: false,
            message: 'Failed to fetch specification',
        };
    }
};

// Добавить в specification.action.ts

// Добавить в specification.action.ts

export const getSpecificationsByCategory = async (categorySlug: string): Promise<ActionResponse<SpecificationResponseForProducts[]>> => {
    try {
        // Сначала найдем категорию по slug
        const category = await prisma.category.findUnique({
            where: { slug: categorySlug },
            select: { id: true }
        });

        if (!category) {
            return {
                success: false,
                message: 'Category not found',
            };
        }

        // Получаем спецификации для этой категории через связующую таблицу
        // Получаем спецификации для этой категории через связующую таблицу
        const categorySpecs = await prisma.categorySpecification.findMany({
            where: {
                categoryId: category.id,
                specification: {
                    isActive: true, // фильтруем активные через where
                }
            },
            include: {
                specification: true
            },
            orderBy: {
                sortOrder: 'asc', // сортировка по порядку в категории
            }
        });

        // Извлекаем спецификации из связей
        const specifications = categorySpecs
            .filter(cs => cs.specification.isActive) // дополнительная проверка
            .map(cs => ({
                ...cs.specification,
                isRequired: cs.isRequired, // добавляем флаг обязательности
                categorySortOrder: cs.sortOrder, // порядок в категории
            }));

        // Формируем результат без изображений
        const specificationsResult: SpecificationResponseForProducts[] = specifications.map(spec => ({
            id: spec.id,
            name: spec.name,
            key: spec.key,
            description: spec.description,
            unit: spec.unit,
            type: spec.type as "number" | "text",
            category: spec.category,
            isActive: spec.isActive,
            sortOrder: spec.sortOrder,
            createdAt: spec.createdAt,
            updatedAt: spec.updatedAt,
            images: [], // пустой массив изображений
            // Добавляем дополнительные поля для создания продуктов
            isRequired: spec.isRequired,
            categorySortOrder: spec.categorySortOrder,
        }));

        return {
            success: true,
            data: specificationsResult,
        }
    } catch (error) {
        console.error('Error fetching specifications by category:', error);
        return {
            success: false,
            message: 'Failed to fetch specifications for category',
        };
    }
}