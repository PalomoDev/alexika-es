// page.tsx
'use server'
import { Suspense } from 'react'
import GalleryFilter from "@/components/shared/products/gallery-filter";

import GalleryCardsContainer from "@/components/shared/products/gallery-cards-container";
import getAllProductsForClient from "@/lib/actions/product/product.client.action";

const ProductsPage = async () => {
    // Загрузка данных на сервере

    const productsApiResponse = await getAllProductsForClient();
    const products = productsApiResponse.data || [];
    const categories = [...new Set(products.map(p => p.category))]

    return (
        <div className="flex gap-8">
            <Suspense fallback={<div>Загрузка фильтров...</div>}>
                <GalleryFilter category={categories} />
            </Suspense>
            <div className={'w-full pt-5 pr-4'}>
                <Suspense fallback={<div>Загрузка продуктов...</div>}>
                    <GalleryCardsContainer products={products} />
                </Suspense>
            </div>
        </div>
    );
};

export default ProductsPage