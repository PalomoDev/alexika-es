'use client'
import { useState, useMemo, useEffect } from 'react';
import Breadcrumbs from "@/components/ui/breadcrumps";
import { PRODUCT_COUNT_GALLERY } from "@/lib/constants";

import { useSearchParams } from 'next/navigation';
import { SortDropdown } from "@/components/shared/products/sort-dropdown";
import { Pagination } from "@/components/ui/pagination";
import ProductGalleryCard from "@/components/shared/products/product-gallery-card";

import useProductFilters from "@/hooks/useProductFilters";

const GalleryCardsContainer = () => {


    const searchParams = useSearchParams();
    const { filteredProducts } = useProductFilters()





    // Стейт для текущей страницы
    const [currentPage, setCurrentPage] = useState(1);

    // Стейт для выбранной сортировки
    const [sortValue, setSortValue] = useState<string>('');

    // Получаем фильтры из URL
    const selectedCategory = searchParams.get('category');
    const selectedSubcategories = searchParams.getAll('subcategory');



    // Применяем сортировку к уже отфильтрованному списку
    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts];

        switch (sortValue) {
            case 'price-asc':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'featured':
                sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
                break;
            default:
                break;
        }
        return sorted;
    }, [filteredProducts, sortValue]);

    // Сбрасываем на первую страницу при изменении фильтров
    const subcategoriesKey = selectedSubcategories.join(',');
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, subcategoriesKey]);

    const viewProductsCount = PRODUCT_COUNT_GALLERY;
    const productsCount = sortedProducts.length;

    // Вычисляем пагинацию
    const totalPages = Math.ceil(productsCount / viewProductsCount);
    const startIndex = (currentPage - 1) * viewProductsCount;
    const endIndex = startIndex + viewProductsCount;
    const currentProducts = sortedProducts.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Скроллим наверх при смене страницы
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (value: string) => {
        setSortValue(value);
    };

    return (
        <div>
            <Breadcrumbs />
            <h1 className="text-3xl font-bold mb-6">EQUIPO</h1>

            <div className="w-full border-b border-b-gray-300 pb-2">
                <span>{productsCount} Artículos </span>
            </div>

            <div className="gallery-action-block w-full flex justify-between items-center mt-6 mb-6">
                <SortDropdown onSortChange={handleSortChange} />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map((product) => (
                    <div key={product.id}>
                        <ProductGalleryCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryCardsContainer;