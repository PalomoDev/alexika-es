"use server"

import prisma from '@/lib/prisma'
import { formatError } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
    createSubcategorySchema,
    updateSubcategorySchema,
    deleteSubcategorySchema,
    SubcategoryCreate,
    SubcategoryUpdate,
    SubcategoryDelete,
    SubcategoryFullResponse
} from "@/lib/validations/product/subcategory-validation"
import { ActionResponse } from "@/types/action.type";
import { ROUTES } from "@/lib/constants/routes";

// Создание субкатегории
export async function createSubcategory(data: SubcategoryCreate): Promise<ActionResponse<{ id: string }>> {
    try {
        const validatedData = createSubcategorySchema.parse(data);
        const { categoryIds, ...subcategoryData } = validatedData;

        // Проверяем уникальность slug
        const existingSubcategory = await prisma.subcategory.findUnique({
            where: { slug: subcategoryData.slug }
        });

        if (existingSubcategory) {
            return {
                success: false,
                message: 'Subcategory with this slug already exists'
            };
        }

        // Создаем субкатегорию в транзакции
        const result = await prisma.$transaction(async (tx) => {
            // Создаем субкатегорию
            const subcategory = await tx.subcategory.create({
                data: subcategoryData
            });

            // Создаем связи с категориями
            if (categoryIds && categoryIds.length > 0) {
                await tx.categorySubcategory.createMany({
                    data: categoryIds.map(categoryId => ({
                        categoryId,
                        subcategoryId: subcategory.id,
                        sortOrder: 0
                    }))
                });
            }

            return subcategory;
        });

        revalidatePath(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=subcategories`);
        return {
            success: true,
            data: { id: result.id },
            message: 'Subcategory created successfully'
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

// Обновление субкатегории
export async function updateSubcategory(data: SubcategoryUpdate): Promise<ActionResponse<{ id: string }>> {
    try {
        const validatedData = updateSubcategorySchema.parse(data);
        const { id, categoryIds, ...subcategoryData } = validatedData;

        if (!id) {
            return {
                success: false,
                message: 'Subcategory ID is required'
            };
        }

        // Проверяем уникальность slug (исключая текущую субкатегорию)
        if (subcategoryData.slug) {
            const existingSubcategory = await prisma.subcategory.findFirst({
                where: {
                    slug: subcategoryData.slug,
                    id: { not: id }
                }
            });

            if (existingSubcategory) {
                return {
                    success: false,
                    message: 'Subcategory with this slug already exists'
                };
            }
        }

        // Обновляем субкатегорию в транзакции
        const result = await prisma.$transaction(async (tx) => {
            // Обновляем данные субкатегории
            const subcategory = await tx.subcategory.update({
                where: { id },
                data: subcategoryData
            });

            // Обновляем связи с категориями, если categoryIds переданы
            if (categoryIds !== undefined) {
                // Удаляем старые связи
                await tx.categorySubcategory.deleteMany({
                    where: { subcategoryId: id }
                });

                // Создаем новые связи
                if (categoryIds.length > 0) {
                    await tx.categorySubcategory.createMany({
                        data: categoryIds.map(categoryId => ({
                            categoryId,
                            subcategoryId: id,
                            sortOrder: 0
                        }))
                    });
                }
            }

            return subcategory;
        });

        revalidatePath(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=subcategories`);
        return {
            success: true,
            data: { id: result.id },
            message: 'Subcategory updated successfully'
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

// Удаление субкатегории
export async function deleteSubcategory(data: string): Promise<ActionResponse<undefined>> {
    try {
        const validatedData = deleteSubcategorySchema.parse(data);
        const { id } = validatedData;

        // Проверяем существование субкатегории
        const existingSubcategory = await prisma.subcategory.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        productSubcategories: true
                    }
                }
            }
        });

        if (!existingSubcategory) {
            return {
                success: false,
                message: 'Subcategory not found'
            };
        }

        // Удаляем субкатегорию в транзакции (каскадное удаление связей настроено в schema.prisma)
        await prisma.$transaction(async (tx) => {
            // Удаляем связи с товарами
            await tx.productSubcategory.deleteMany({
                where: { subcategoryId: id }
            });

            // Удаляем связи с категориями
            await tx.categorySubcategory.deleteMany({
                where: { subcategoryId: id }
            });

            // Удаляем саму субкатегорию
            await tx.subcategory.delete({
                where: { id }
            });
        });

        revalidatePath(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=subcategories`);
        return {
            success: true,
            message: 'Subcategory deleted successfully'
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

// Получение всех субкатегорий
export const getSubcategories = async (): Promise<{
    success: boolean;
    data?: SubcategoryFullResponse[];
    message?: string;
}> => {
    try {
        const subcategories = await prisma.subcategory.findMany({
            include: {
                _count: {
                    select: {
                        productSubcategories: true // Количество продуктов
                    }
                },
                categorySubcategories: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                isActive: true,
                            },
                        },
                    },
                    orderBy: {
                        sortOrder: 'asc'
                    }
                },
            },
            orderBy: [
                { sortOrder: 'asc' },
                { name: 'asc' },
            ],
        });

        // Получаем все уникальные imageIds из всех субкатегорий
        const allImageIds = subcategories.flatMap(subcategory => subcategory.imageIds);
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
        const subcategoriesWithImages: SubcategoryFullResponse[] = subcategories.map(subcategory => ({
            ...subcategory,
            images: subcategory.imageIds
                .map(id => imageMap.get(id))
                .filter((img): img is NonNullable<typeof img> => img !== undefined)
                .sort((a, b) => a.sortOrder - b.sortOrder),
        }));

        return {
            success: true,
            data: subcategoriesWithImages,
        }
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return {
            success: false,
            message: 'Failed to fetch subcategories',
        };
    }
}

// Получение субкатегории по ID
export const getSubcategoryById = async (id: string): Promise<{
    success: boolean;
    data?: SubcategoryFullResponse;
    message?: string;
}> => {
    try {
        const subcategory = await prisma.subcategory.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        productSubcategories: true
                    }
                },
                categorySubcategories: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                isActive: true,
                            },
                        },
                    },
                    orderBy: {
                        sortOrder: 'asc'
                    }
                },
            },
        });

        if (!subcategory) {
            return {
                success: false,
                message: 'Subcategory not found',
            };
        }

        // Получаем изображения
        const images = await prisma.image.findMany({
            where: {
                id: { in: subcategory.imageIds },
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

        const subcategoryWithImages: SubcategoryFullResponse = {
            ...subcategory,
            images: images,
        };

        return {
            success: true,
            data: subcategoryWithImages,
        };
    } catch (error) {
        console.error('Error fetching subcategory:', error);
        return {
            success: false,
            message: 'Failed to fetch subcategory',
        };
    }
};