"use server"

import prisma from '@/lib/prisma'
import { formatError } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
    createCategorySchema,
    updateCategorySchema,
    CategoryCreate,
    CategoryUpdate,
    CategoryFullResponse
} from "@/lib/validations/product/category-validation"
import {ActionResponse} from "@/types/action.type";
import { ROUTES } from "@/lib/constants/routes";


export const getCategories = async (): Promise<{
    success: boolean;
    data?: CategoryFullResponse[];
    message?: string;
}> => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
                categorySubcategories: {
                    include: {
                        subcategory: {
                            select: {
                                id: true,
                                name: true,
                                isActive: true,
                            },
                        },
                    },
                    where: {
                        subcategory: {
                            isActive: true,
                        },
                    },
                },
                categorySpecifications: {
                    include: {
                        specification: {
                            select: {
                                id: true,
                                name: true,
                                isActive: true,
                            },
                        },
                    },
                    where: {
                        specification: {
                            isActive: true,
                        },
                    },
                },
            },
            orderBy: [
                { sortOrder: 'asc' },
                { name: 'asc' },
            ],
        });

        // Получаем все уникальные imageIds из всех категорий
        const allImageIds = categories.flatMap(category => category.imageIds);
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
        const categoriesWithImages: CategoryFullResponse[] = categories.map(category => ({
            ...category,
            images: category.imageIds
                .map(id => imageMap.get(id))
                .filter((img): img is NonNullable<typeof img> => img !== undefined)
                .sort((a, b) => a.sortOrder - b.sortOrder),
        }));

        return {
            success: true,
            data: categoriesWithImages,
        };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return {
            success: false,
            message: 'Failed to fetch categories',
        };
    }
};

export async function getCategoryById(id: string): Promise<{
    success: boolean;
    data?: Omit<CategoryFullResponse, '_count'>;
    message?: string;
}> {
    try {
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                categorySubcategories: {
                    include: {
                        subcategory: {
                            select: {
                                id: true,
                                name: true,
                                isActive: true,
                            },
                        },
                    },
                    where: {
                        subcategory: {
                            isActive: true,
                        },
                    },
                },
                categorySpecifications: {
                    include: {
                        specification: {
                            select: {
                                id: true,
                                name: true,
                                isActive: true,
                            },
                        },
                    },
                    where: {
                        specification: {
                            isActive: true,
                        },
                    },
                },
            },
        });

        if (!category) {
            return {
                success: false,
                message: 'Category not found'
            };
        }

        // Получаем изображения для категории
        const images = await prisma.image.findMany({
            where: {
                id: { in: category.imageIds },
                isDeleted: false,
            },
            select: {
                id: true,
                url: true,
                alt: true,
                sortOrder: true,
            },
            orderBy: {
                sortOrder: 'asc',
            },
        });

        // Формируем результат с подключенными изображениями
        const categoryWithImages = {
            ...category,
            images: images,
        };

        return {
            success: true,
            data: categoryWithImages,
        };
    } catch (error) {
        console.error('Error fetching category:', error);
        return {
            success: false,
            message: 'Failed to fetch category'
        };
    }
}
/**
 * Создает новую категорию
 */
export async function createCategory(data: CategoryCreate): Promise<ActionResponse<{ id: string }>> {
    try {
        const validatedData = createCategorySchema.parse(data);

        const existingCategory = await prisma.category.findUnique({
            where: { slug: validatedData.slug }
        });

        if (existingCategory) {
            return {
                success: false,
                message: 'Category with this slug already exists'
            };
        }

        const category = await prisma.category.create({
            data: validatedData
        });

        revalidatePath(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=categories`);
        return {
            success: true,
            data: { id: category.id },
            message: 'Category created successfully'
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
 * Обновляет категорию
 */
export async function updateCategory(data: CategoryUpdate): Promise<ActionResponse> {
    try {
        const validatedData = updateCategorySchema.parse(data);
        const { id, ...categoryData } = validatedData;

        if (!id) {
            return {
                success: false,
                message: 'Category ID is required'
            };
        }

        const existingCategory = await prisma.category.findUnique({
            where: { id }
        });

        if (!existingCategory) {
            return {
                success: false,
                message: 'Category not found'
            };
        }

        if (categoryData.slug) {
            const existingSlug = await prisma.category.findFirst({
                where: {
                    slug: categoryData.slug,
                    NOT: { id }
                }
            });

            if (existingSlug) {
                return {
                    success: false,
                    message: 'Category with this slug already exists'
                };
            }
        }

        await prisma.category.update({
            where: { id },
            data: categoryData
        });

        revalidatePath(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=categories`);
        return {
            success: true,
            message: 'Category updated successfully'
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
 * Удаляет категорию
 */
export async function deleteCategory(id: string): Promise<ActionResponse> {
    try {
        const categoryWithProducts = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });

        if (!categoryWithProducts) {
            return {
                success: false,
                message: 'Category not found'
            };
        }

        if (categoryWithProducts._count.products > 0) {
            return {
                success: false,
                message: `Cannot delete category: it has ${categoryWithProducts._count.products} associated products`
            };
        }

        await prisma.category.delete({
            where: { id }
        });

        revalidatePath('/admin/categories');
        return {
            success: true,
            message: 'Category deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}