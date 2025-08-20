'use server'



import { ProductClient } from "@/lib/validations/product/client";
import { memoryCache } from "@/lib/cache/memory-cache";
import prisma from "@/lib/prisma";
import { formatError } from "@/lib/utils";
import { cleanupExpiredOrdersByProductSlug } from '@/lib/actions/orden/orden.action';

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

interface ProductApiResponse {
    success: boolean;
    data: ProductClient[] | null;  // Вместо старого типа
    message: string | null;
}


export  default async function getAllProductsForClient(): Promise<ProductApiResponse> {
    // Проверяем кеш
    const cached = memoryCache.get<ProductApiResponse>(CACHE_KEY)
    if (cached) {
        console.log('✅ Используем кешированные данные')
        return cached
    }

    try {
        console.log('⏳ Загружаем данные с сервера...')

        // Загружаем все продукты из БД с полными связями
        const products = await prisma.product.findMany({
            where: {
                isActive: true
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        sortOrder: true

                    }
                },
                brand: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        sortOrder: true
                    }
                },
                productSubcategories: {
                    include: {
                        subcategory: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                description: true,
                                sortOrder: true,
                                isActivity: true
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
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Получаем все уникальные imageIds для batch загрузки
        const allImageIds = products.flatMap(product => product.imageIds)
        const uniqueImageIds = [...new Set(allImageIds)]

        // Загружаем все изображения одним запросом
        const images = await prisma.image.findMany({
            where: {
                id: { in: uniqueImageIds },
                isDeleted: false
            },
            select: {
                id: true,
                url: true,
                alt: true
            },
            orderBy: { sortOrder: 'asc' }
        })

        // Создаем Map для быстрого поиска изображений по ID
        const imageMap = new Map(images.map(img => [img.id, img]))

        // Формируем данные в формате ProductClient
        const mappedProducts: ProductClient[] = products.map(product => {
            // Получаем изображения для этого продукта
            const productImages = product.imageIds
                .map(id => imageMap.get(id))
                .filter(Boolean) as Array<{id: string, url: string, alt: string | null}>

            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                sku: product.sku,
                categoryId: product.categoryId,
                brandId: product.brandId,
                images: productImages,
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
                    slug: product.category.slug,
                    sortOrder: product.category.sortOrder
                } : undefined,
                brand: product.brand ? {
                    id: product.brand.id,
                    name: product.brand.name,
                    slug: product.brand.slug,
                    sortOrder: product.brand.sortOrder
                } : undefined,
                subcategories: product.productSubcategories?.map(ps => ({
                    id: ps.subcategory.id,
                    name: ps.subcategory.name,
                    slug: ps.subcategory.slug,
                    description: ps.subcategory.description,
                    sortOrder: ps.subcategory.sortOrder,
                    isActivity: ps.subcategory.isActivity
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
            }
        })

        const result: ProductApiResponse = {
            success: true,
            data: mappedProducts,
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
            message: formatError(error)
        }
    }
}

 // Добавьте правильный путь к функции

export async function getProductBySlugForClient(slug: string): Promise<{
    success: boolean;
    data: ProductClient | null;
    message: string | null;
}> {
    try {
        // Очищаем истекшие заказы для этого товара
        await cleanupExpiredOrdersByProductSlug(slug);

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
                        slug: true,
                        sortOrder: true
                    }
                },
                brand: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        sortOrder: true
                    }
                },
                productSubcategories: {
                    include: {
                        subcategory: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                description: true,
                                sortOrder: true,
                                isActivity: true,
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
                slug: product.category.slug,
                sortOrder: product.category.sortOrder
            } : undefined,
            brand: product.brand ? {
                id: product.brand.id,
                name: product.brand.name,
                slug: product.brand.slug,
                sortOrder: product.brand.sortOrder
            } : undefined,
            subcategories: product.productSubcategories?.map(ps => ({
                id: ps.subcategory.id,
                name: ps.subcategory.name,
                slug: ps.subcategory.slug,
                description: ps.subcategory.description,
                sortOrder: ps.subcategory.sortOrder,
                isActivity: ps.subcategory.isActivity
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