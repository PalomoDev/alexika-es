'use client'
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { CategoryClientResponse } from "@/lib/validations/product/category-validation";
import { Button } from "@/components/ui/button";

interface FilterGalleryProps {
    category:  CategoryClientResponse [] | null;
}

const FilterGallery = ({ category }: FilterGalleryProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Получаем текущие фильтры из URL
    const selectedCategory = searchParams.get('category');
    const selectedSubcategories = searchParams.getAll('subcategory');

    const handleCategoryChange = (categorySlug: string) => {
        const params = new URLSearchParams(searchParams);

        if (selectedCategory === categorySlug) {
            params.delete('category');
            params.delete('subcategory'); // Очищаем подкатегории при снятии категории
        } else {
            params.set('category', categorySlug);
            params.delete('subcategory'); // Очищаем подкатегории при смене категории
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSubcategoryChange = (subcategorySlug: string) => {
        const params = new URLSearchParams(searchParams);
        const current = params.getAll('subcategory');

        if (current.includes(subcategorySlug)) {
            // Удаляем подкатегорию
            params.delete('subcategory');
            current.filter(s => s !== subcategorySlug).forEach(s => params.append('subcategory', s));
        } else {
            // Добавляем подкатегорию
            params.append('subcategory', subcategorySlug);
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    // Обработчик очистки всех фильтров
    const handleClearFilters = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('category');
        params.delete('subcategory');
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="filter-container space-y-4 ">
            <h3 className="font-semibold uppercase border-b border-b-gray-300 pb-2">Filtro</h3>
            <Button
                variant="ghost"
                size="icon"
                className="w-full flex justify-start"
                onClick={handleClearFilters}
            >
                borrar todos los filtros
            </Button>

            {category?.map((cat) => (
                <div key={cat.id} className="space-y-2">
                    <button
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`block w-full text-left px-3 py-2 rounded ${
                            selectedCategory === cat.slug
                                ? 'bg-blue-100 text-blue-800'
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        {cat.name} ({cat._count.products})
                    </button>

                    {selectedCategory === cat.slug && cat.categorySubcategories.length > 0 && (
                        <div className="space-y-1">
                            {cat.categorySubcategories.map((subcat) => (
                                <button
                                    key={subcat.subcategory.id}
                                    onClick={() => handleSubcategoryChange(subcat.subcategory.slug)}
                                    className={`block w-full text-left px-2 py-1 text-sm rounded ${
                                        selectedSubcategories.includes(subcat.subcategory.slug)
                                            ? 'bg-brand-muted text-gray-800'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    {subcat.subcategory.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FilterGallery;