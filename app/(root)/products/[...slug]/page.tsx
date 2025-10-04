import {Suspense} from "react";
import GalleryCardsContainer from "@/components/shared/products/gallery-cards-container";
import GalleryFilterAuto from '@/components/shared/products/filters/GalleryFilterAuto';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface LockedFilters {
    categorySlug?: string;
    subcategorySlugs?: string[];
    isActivityOnly?: boolean;
}



export default async function ProductosPage({ params }: PageProps) {
    const { slug } = await params;



    // Определяем заблокированные фильтры на основе URL
    // const lockedFilters = getLockedFilters(slug);
    // console.log(lockedFilters);

    return (
        <div className="flex gap-8">
            <GalleryFilterAuto slug={slug} />
            <div className={'w-full pt-5 pr-4'}>
                <Suspense fallback={<div>Загрузка продуктов...</div>}>
                    <GalleryCardsContainer />
                </Suspense>
            </div>
        </div>
    );
}


function getLockedFilters(slug: string[]): LockedFilters | undefined {

    if (!slug.length) return undefined;

    const [firstSlug] = slug;

    switch (firstSlug) {
        case 'tiendas-de-campana':
            return { categorySlug: 'tiendas-de-campana' };
        case 'mochilas':
            return { categorySlug: 'mochilas' };
        case 'sacos-de-dormir':
            return { categorySlug: 'sacos-de-dormir' };
        case 'esterillas-y-colchonetas':
            return { categorySlug: 'sacos-de-dormir' };
        case 'accesorios':
            return { categorySlug: 'sacos-de-dormir' };

        case 'actividades':
            return { isActivityOnly: true };
        case 'senderismo':
            return { subcategorySlugs: ['senderismo'] };
        case 'camping':
            return { subcategorySlugs: ['camping'] };
        case 'escalada':
            return { subcategorySlugs: ['escalada'] };
        default:
            return undefined;
    }
};