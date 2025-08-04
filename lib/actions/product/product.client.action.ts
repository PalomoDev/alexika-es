// ===================================================================
// Обновленная функция в product.client.action.ts
// ===================================================================

import ProductsGallery from "@/db/products";
import { ProductApiResponse } from "@/lib/validations/product/product-client-validation";
import { ProductClient } from "@/lib/validations/product/client";
import { memoryCache } from "@/lib/cache/memory-cache";
import prisma from "@/lib/prisma";
import { formatError } from "@/lib/utils";

const CACHE_KEY = 'products-gallery'

// Функция для форматирования цены
const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export default async function getAllProductsForClient(): Promise<ProductApiResponse> {
    // Проверяем кеш
    const cached = memoryCache.get<ProductApiResponse>(CACHE_KEY)
    if (cached) {
        console.log('✅ Используем кешированные данные')
        return cached
    }

    try {
        console.log('⏳ Загружаем данные с сервера...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        const products = ProductsGallery

        const result: ProductApiResponse = {
            success: true,
            data: products,
            message: null
        }

        // Кешируем на 5 минут
        memoryCache.set(CACHE_KEY, result, 5 * 60 * 1000)
        console.log('💾 Данные закешированы')

        return result
    }
    catch (error) {
        console.error('Error fetching products for client:', error);
        return {
            success: false,
            data: null,
            message: 'Error fetching products for client',
        }
    }
}

export async function getProductBySlugForClient(slug: string): Promise<{
    success: boolean;
    data: ProductClient | null;
    message: string | null;
}> {
    try {
        const product = await prisma.product.findUnique({
            where: {
                slug,
                isActive: true
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                brand: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                productSubcategories: {
                    include: {
                        subcategory: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                description: true
                            }
                        }
                    }
                },
                features: {
                    include: {
                        feature: {
                            select: {
                                id: true,
                                name: true,
                                key: true,
                                imageIds: true,
                                description: true
                            }
                        }
                    }
                },
                specificationValues: {
                    include: {
                        specification: {
                            select: {
                                id: true,
                                name: true,
                                key: true,
                                type: true,
                                unit: true,
                                description: true
                            }
                        }
                    }
                }
            }
        });

        if (!product) {
            return {
                success: false,
                data: null,
                message: 'Product not found'
            };
        }

        // Получаем изображения продукта
        const images = await prisma.image.findMany({
            where: {
                id: { in: product.imageIds },
                isDeleted: false
            },
            select: {
                id: true,
                url: true,
                alt: true
            },
            orderBy: { sortOrder: 'asc' }
        });

        // Формируем данные в формате ProductClient
        const productClient: ProductClient = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            categoryId: product.categoryId,
            brandId: product.brandId,
            images: images,
            description: product.description,
            stock: product.stock,
            price: Number(product.price),
            formattedPrice: formatPrice(Number(product.price)),
            rating: Number(product.rating),
            inStock: product.stock > 0,
            isFeatured: product.isFeatured,
            isActive: product.isActive,
            // Связи
            category: product.category ? {
                id: product.category.id,
                name: product.category.name,
                slug: product.category.slug
            } : undefined,
            brand: product.brand ? {
                id: product.brand.id,
                name: product.brand.name,
                slug: product.brand.slug
            } : undefined,
            subcategories: product.productSubcategories?.map(ps => ({
                id: ps.subcategory.id,
                name: ps.subcategory.name,
                slug: ps.subcategory.slug,
                description: ps.subcategory.description
            })),
            features: product.features?.map(pf => ({
                id: pf.feature.id,
                name: pf.feature.name,
                key: pf.feature.key,
                description: pf.feature.description,
                imageIds: pf.feature.imageIds
            })),
            specificationValues: product.specificationValues?.map(sv => ({
                id: sv.id,
                value: sv.value,
                specification: {
                    id: sv.specification.id,
                    name: sv.specification.name,
                    key: sv.specification.key,
                    type: sv.specification.type as "number" | "text",
                    unit: sv.specification.unit,
                    description: sv.specification.description
                }
            }))
        };

        return {
            success: true,
            data: productClient,
            message: 'Product retrieved successfully'
        };

    } catch (error) {
        console.error('Error fetching product by slug:', error);
        return {
            success: false,
            data: null,
            message: formatError(error)
        };
    }
}