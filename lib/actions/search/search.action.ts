// lib/services/search.service.ts
import prisma from '@/lib/prisma'
import { formatError } from '@/lib/utils'
import {ProductApiResponse} from "@/lib/actions/product/product.client.action";
import {ProductClient} from "@/lib/validations/product/client";
import {formatPrice} from "@/lib/utils/format-price";


interface SearchProductsParams {
    query: string;
    page?: number;
    limit?: number;
}

interface SearchApiResponse extends ProductApiResponse {
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalResults: number;
        hasMore: boolean;
    }
}

export default async function searchProductsForClient({
                                                          query,
                                                          page = 1,
                                                          limit = 20
                                                      }: SearchProductsParams): Promise<SearchApiResponse> {
    try {
        console.log(`⏳ Buscando productos con query: "${query}"...`)

        const offset = (page - 1) * limit;

        // Поиск продуктов по названию
        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                where: {
                    AND: [
                        { isActive: true },
                        {
                            name: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    ]
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
                orderBy: [
                    { isFeatured: 'desc' },
                    { rating: 'desc' },
                    { createdAt: 'desc' }
                ],
                skip: offset,
                take: limit
            }),
            prisma.product.count({
                where: {
                    AND: [
                        { isActive: true },
                        {
                            name: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    ]
                }
            })
        ]);

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

        const totalPages = Math.ceil(totalCount / limit);

        const result: SearchApiResponse = {
            success: true,
            data: mappedProducts,
            message: `Encontrados ${totalCount} productos para "${query}"`,
            pagination: {
                currentPage: page,
                totalPages,
                totalResults: totalCount,
                hasMore: page < totalPages
            }
        }

        console.log(`✅ Encontrados ${totalCount} productos`)
        return result

    } catch (error) {
        console.error('Error en búsqueda de productos:', error);
        return {
            success: false,
            data: null,
            message: formatError(error)
        }
    }
}