'use client';

import { Suspense } from 'react';
import GalleryFilter from './gallery-filter-with-locked';
import useProductFilters from '@/hooks/useProductFilters';

type LockedFilters = {
    categorySlug?: string;
    subcategorySlugs?: string[];
    isActivityOnly?: boolean;
};

function getLockedFromSlug(
    first: string | undefined,
    sets: {
        categorySlugs: Set<string>;
        actividadSlugs: Set<string>;
    }
): LockedFilters | undefined {
    if (!first) return undefined;
    if (first === 'actividades') return { isActivityOnly: true };
    if (sets.categorySlugs.has(first)) return { categorySlug: first };
    if (sets.actividadSlugs.has(first)) return { subcategorySlugs: [first] };
    return undefined;
}

export default function GalleryFilterAuto({ slug }: { slug: string[] }) {
    const { filteredCategories, filteredActividades } = useProductFilters();

    const categorySlugs = new Set((filteredCategories ?? []).map((c) => c.slug));
    const actividadSlugs = new Set((filteredActividades ?? []).map((a) => a.slug));

    const lockedFilters = getLockedFromSlug(slug?.[0], { categorySlugs, actividadSlugs });

    return (
        <Suspense fallback={<div>Загрузка фильтров...</div>}>
            <GalleryFilter lockedFilters={lockedFilters} />
        </Suspense>
    );
}
