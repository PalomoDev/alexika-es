// Упрощенный тип для главной страницы
import {formatPrice} from "@/lib/utils/order-page.utils";
import {memoryCache} from "@/lib/cache/memory-cache";
import { formatError } from "@/lib/utils";
import prisma from "@/lib/prisma";

export interface FeaturedProductCard {
    id: string;
    name: string;
    category: string;
    slug: string;
    description: string;
    price: number;
    formattedPrice: string;
    images: Array<{
        id: string;
        url: string;
        alt: string | null;
    }>;
}

interface FeaturedProductsResponse {
    success: boolean;
    data: FeaturedProductCard[] | null;
    message: string | null;
}

export async function getFeaturedProductsForHome(): Promise<FeaturedProductsResponse> {
    const FEATURED_HOME_CACHE_KEY = 'featured-products-home'

    // Проверяем кеш
    const cached = memoryCache.get<FeaturedProductsResponse>(FEATURED_HOME_CACHE_KEY)
    if (cached) {
        // console.log('✅ Используем кешированные рекомендуемые продукты для главной')
        return cached
    }

    try {
        // console.log('⏳ Загружаем рекомендуемые продукты для главной страницы...')

        // Минимальный запрос - только нужные поля
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                isFeatured: true
            },
            select: {
                id: true,
                category: true,
                name: true,
                slug: true,
                description: true,
                price: true,
                imageIds: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Получаем только первое изображение для каждого продукта
        const firstImageIds = products
            .map(p => p.imageIds[0])
            .filter(Boolean)

        // Загружаем только нужные изображения
        const images = await prisma.image.findMany({
            where: {
                id: { in: firstImageIds },
                isDeleted: false
            },
            select: {
                id: true,
                url: true,
                alt: true
            }
        })

        const imageMap = new Map(images.map(img => [img.id, img]))

        // Преобразуем в упрощенный формат
        const featuredProducts: FeaturedProductCard[] = products.map(product => ({
            id: product.id,
            name: product.name,
            category: product.category.name,
            slug: product.slug,
            description: product.description,
            price: Number(product.price),
            formattedPrice: formatPrice(Number(product.price)),
            images: product.imageIds[0] && imageMap.get(product.imageIds[0])
                ? [imageMap.get(product.imageIds[0])!]
                : []
        }))

        const result: FeaturedProductsResponse = {
            success: true,
            data: featuredProducts,
            message: `Se encontraron ${featuredProducts.length} productos destacados`
        }

        // Кешируем на 15 минут
        memoryCache.set(FEATURED_HOME_CACHE_KEY, result, 2 * 60 * 1000)
        // console.log('💾 Рекомендуемые продукты для главной закешированы')

        return result
    }
    catch (error) {
        console.error('Error fetching featured products for home:', error);
        return {
            success: false,
            data: null,
            message: formatError(error)
        }
    }
}