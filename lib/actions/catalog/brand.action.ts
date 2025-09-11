"use server"

import prisma from '@/lib/prisma'
import { formatError } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
    createBrandSchema,
    updateBrandSchema,
    BrandCreate,
    BrandUpdate,
    BrandFullResponse, BrandImage
} from "@/lib/validations/product/brand"

type ActionResponse<T = undefined> = {
    success: boolean;
    data?: T | null;
    message?: string;
};

/**
 * Получает все бренды с возможностью фильтрации по активности
 */

export async function getBrands(activeOnly: boolean = false): Promise<ActionResponse<BrandFullResponse[]>> {
    try {
        const brands = await prisma.brand.findMany({
            where: activeOnly ? { isActive: true } : undefined,
            orderBy: [
                { sortOrder: 'asc' },
                { name: 'asc' }
            ],
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });

        // Получаем изображения для каждого бренда
        const brandsWithImages = await Promise.all(
            brands.map(async (brand) => {
                if (brand.imageIds.length === 0) {
                    return {
                        ...brand,
                        images: []
                    };
                }

                const images = await prisma.image.findMany({
                    where: {
                        id: { in: brand.imageIds },
                        isDeleted: false // Исключаем изображения где isDeleted: true
                    },
                    orderBy: [
                        { sortOrder: 'asc' },
                        { createdAt: 'asc' }
                    ]
                });

                return {
                    ...brand,
                    images
                };
            })
        );

        return {
            success: true,
            data: brandsWithImages
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}

/**
 * Получает бренд по ID
 */
export async function getBrandById(id: string): Promise<ActionResponse<BrandFullResponse>> {
    try {
        const brand = await prisma.brand.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });

        if (!brand) {
            return {
                success: false,
                message: 'Brand not found'
            };
        }

        // Получаем изображения для бренда
        let images: BrandImage[] = [];
        if (brand.imageIds.length > 0) {
            const fullImages = await prisma.image.findMany({
                where: {
                    id: { in: brand.imageIds },
                    isDeleted: false
                },
                orderBy: [
                    { sortOrder: 'asc' },
                    { createdAt: 'asc' }
                ]
            });

            // Преобразуем в BrandImage формат
            images = fullImages.map(img => ({
                id: img.id,
                url: img.url,
                alt: img.alt,
                sortOrder: img.sortOrder
            }));
        }

        const brandWithImages = {
            ...brand,
            images
        };

        return {
            success: true,
            data: brandWithImages
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}

/**
 * Создает новый бренд
 */
export async function createBrand(data: BrandCreate): Promise<ActionResponse<{ id: string }>> {
    try {
        const validatedData = createBrandSchema.parse(data);

        const existingBrand = await prisma.brand.findUnique({
            where: { slug: validatedData.slug }
        });

        if (existingBrand) {
            return {
                success: false,
                message: 'Brand with this slug already exists'
            };
        }

        const brand = await prisma.brand.create({
            data: validatedData
        });

        revalidatePath('/admin/brands');
        return {
            success: true,
            data: { id: brand.id },
            message: 'Brand created successfully'
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
 * Обновляет бренд
 */
export async function updateBrand(data: BrandUpdate): Promise<ActionResponse> {
    try {
        const validatedData = updateBrandSchema.parse(data);
        const { id, ...brandData } = validatedData;

        if (!id) {
            return {
                success: false,
                message: 'Brand ID is required'
            };
        }

        const existingBrand = await prisma.brand.findUnique({
            where: { id }
        });

        if (!existingBrand) {
            return {
                success: false,
                message: 'Brand not found'
            };
        }

        if (brandData.slug) {
            const existingSlug = await prisma.brand.findFirst({
                where: {
                    slug: brandData.slug,
                    NOT: { id }
                }
            });

            if (existingSlug) {
                return {
                    success: false,
                    message: 'Brand with this slug already exists'
                };
            }
        }

        await prisma.brand.update({
            where: { id },
            data: brandData
        });

        revalidatePath('/admin/brands');
        return {
            success: true,
            message: 'Brand updated successfully'
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
 * Удаляет бренд
 */
export async function deleteBrand(id: string): Promise<ActionResponse> {
    try {
        const brandWithProducts = await prisma.brand.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });

        if (!brandWithProducts) {
            return {
                success: false,
                message: 'Brand not found'
            };
        }

        if (brandWithProducts._count.products > 0) {
            return {
                success: false,
                message: `Cannot delete brand: it has ${brandWithProducts._count.products} associated products`
            };
        }

        await prisma.brand.delete({
            where: { id }
        });

        revalidatePath('/admin/brands');
        return {
            success: true,
            message: 'Brand deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}
