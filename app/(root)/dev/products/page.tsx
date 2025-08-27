// _page.tsx
'use server'
import { Suspense } from 'react'
import GalleryFilter from "@/components/shared/products/filters/gallery-filter-with-locked";

import GalleryCardsContainer from "@/components/shared/products/gallery-cards-container";


const ProductsPage = async () => {



    return (
        <div className="flex gap-8">
            <Suspense fallback={<div>Загрузка фильтров...</div>}>
                <GalleryFilter/>
            </Suspense>
            <div className={'w-full pt-5 pr-4'}>
                <Suspense fallback={<div>Загрузка продуктов...</div>}>
                    <GalleryCardsContainer />
                </Suspense>
            </div>
        </div>
    );
};

export default ProductsPage