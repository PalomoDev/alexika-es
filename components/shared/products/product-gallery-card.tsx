'use client'
import type { ProductClient } from "@/lib/validations/product/client";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import {singularizeCategoryName} from "@/lib/utils/singular";

interface ProductGalleryCardProps {
    product: ProductClient;
}

const transformCategoryName = (categoryName: string): string => {
  if (!categoryName) return "";
  // Срабатываем только если есть союз " y " или " и " (с пробелами вокруг)
  const conj = /\s+(?:y|и)\s+/i;
  if (!conj.test(categoryName)) {
    return categoryName;
  }
  const beforeConjunction = categoryName.split(conj)[0] ?? categoryName;
  const firstWord = beforeConjunction.trim().split(/\s+/)[0] ?? "";
  if (!firstWord) return categoryName;
  return singularizeCategoryName(firstWord);
};

const ProductGalleryCard = ({ product }: ProductGalleryCardProps) => {
    const firstImage = product.images?.[0];
    const imageUrl = firstImage?.url || "/images/placeholder-product.jpg";
    const imageAlt = firstImage?.alt || product.name;

    const productActivity =
        product.subcategories?.find((sub) => sub.isActivity)?.name || "";

    const productCategory = product.category?.name || "";
    const maskedCategory = transformCategoryName(productCategory);

    return (
        <div className="product-gallery-card w-full  h-full overflow-hidden">
            <Link
                href={`${ROUTES.PAGES.PRODUCT}${product.slug}`}
                className="h-full w-full flex flex-col justify-between focus:outline-none focus-visible:ring focus-visible:ring-offset-2 px-4"
                aria-label={product.name}
            >
                {/* Изображение */}
                <div className="relative w-full aspect-square">
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        width={800}
                        height={800}
                        quality={80}
                        className="w-full h-full object-contain object-center"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                </div>

                {/* Контент */}
                <div className="w-full p-4 flex flex-col justify-between gap-2 h-1/2 pb-16">
                    <div className={'space-y-2'}>
                        {/* Название */}
                        <h3 className="uppercase font-black text-lg text-gray-800 leading-tight line-clamp-2 text-center">
                            {product.name}
                        </h3>

                        {/* Активность */}
                        {productActivity && (
                            <p className="font-light text-sm text-gray-700 uppercase text-center">{`${maskedCategory} para ${productActivity}`}</p>
                        )}
                    </div>

                    {/* Цена */}
                    <span className="uppercase font-black text-base text-gray-800 text-center">
            {product.formattedPrice}
          </span>
                </div>
            </Link>
        </div>
    );
};

export default ProductGalleryCard;