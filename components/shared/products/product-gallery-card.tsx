'use client'
import type { ProductClient } from "@/lib/validations/product/client";
import Image from "next/image";
import Link from "next/link";
import {ROUTES} from "@/lib/constants/routes";

interface ProductGalleryCardProps {
    product: ProductClient;
}

const ProductGalleryCard = ({product}: ProductGalleryCardProps) => {
    // Получаем первое изображение или используем fallback
    const firstImage = product.images?.[0];
    const imageUrl = firstImage?.url || '/images/placeholder-product.jpg';
    const imageAlt = firstImage?.alt || product.name;


    return (
        <div className={'product-gallery-card'}>
            <Link href={`${ROUTES.PAGES.PRODUCT}${product.slug}`}>
                <div className={'relative product-gallery-card-image w-full aspect-[3/4]'}>
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        priority
                        quality={100}
                        className="product-gallery-card-image-image object-contain object-center"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Показываем статус наличия */}
                    {!product.inStock && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                            Нет в наличии
                        </div>
                    )}

                    {/* Показываем значок рекомендуемого товара */}
                    {product.isFeatured && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 text-xs rounded">
                            Хит
                        </div>
                    )}
                </div>

                <div className={'product-gallery-card-info flex items-start justify-between w-full h-full pt-4 pb-0 px-4'}>
                    <span className={'uppercase font-bold text-sm'}>{product.name}</span>
                    <span className={'uppercase font-bold '}>{product.formattedPrice}</span>
                </div>

                <div className={'flex w-full pb-4 px-4 justify-start'}>
                    <span className={'w-2/3 font-light text-sm pb-4'}>{product.description}</span>
                </div>

                {/* Дополнительная информация */}
                <div className={'flex w-full px-4 pb-4 justify-between items-center text-xs text-gray-500'}>
                    <span>SKU: {product.sku}</span>
                    {product.rating > 0 && (
                        <span>★ {product.rating.toFixed(1)}</span>
                    )}
                </div>
            </Link>
        </div>
    )
}

export default ProductGalleryCard