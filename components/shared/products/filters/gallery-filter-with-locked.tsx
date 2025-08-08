'use client'

import {useEffect, useState} from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from 'lucide-react';
import PriceRangeSlider from '../PriceRangeSlider';
import useProductFilters from "@/hooks/useProductFilters";
import { RotateCcw } from 'lucide-react';
import WeightRangeSlider from '../WeightRangeSlider';

// ============================================================================
// ТИПЫ И ИНТЕРФЕЙСЫ
// ============================================================================

type FilterSections = 'category' | 'subcategory' | 'brand' | 'prices' | 'weight';

interface LockedFilters {
    categorySlug?: string;          // Заблокированная категория (например "tiendas")
    subcategorySlugs?: string[];    // Заблокированные подкатегории (например ["senderismo"])
    isActivityOnly?: boolean;       // Показывать только активности
}

interface FilterGalleryProps {
    lockedFilters?: LockedFilters;
}

const FilterGallery = ({ lockedFilters }: FilterGalleryProps) => {

    // ========================================================================
    // ХУКИ И СТЕЙТ
    // ========================================================================

    const {filteredCategories, filteredActividades, filteredBrands, priceRange, weightRange} = useProductFilters()

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Получаем текущие фильтры из URL
    const selectedCategory = searchParams.get('category')
    const selectedActividades = searchParams.getAll('subcategory')
    const selectedBrand = searchParams.get('brand')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minWeight = searchParams.get('minWeight')
    const maxWeight = searchParams.get('maxWeight')

    /** Состояние раскрытия/сворачивания секций фильтров */
    const [expandedSections, setExpandedSections] = useState({
        category: false,
        subcategory: lockedFilters?.isActivityOnly && selectedActividades.length === 0, // АВТООТКРЫТИЕ: только для активностей без выбора
        brand: false,
        prices: false,
        weight: false
    });

    // ========================================================================
    // ЭФФЕКТЫ
    // ========================================================================

    // ЭФФЕКТ 1: Применение заблокированных фильтров при монтировании
    useEffect(() => {
        if (!lockedFilters) return;

        const params = new URLSearchParams(searchParams);
        let hasChanges = false;

        // Устанавливаем заблокированную категорию
        if (lockedFilters.categorySlug && selectedCategory !== lockedFilters.categorySlug) {
            params.set('category', lockedFilters.categorySlug);
            hasChanges = true;
        }

        // Устанавливаем заблокированные подкатегории
        if (lockedFilters.subcategorySlugs && lockedFilters.subcategorySlugs.length > 0) {
            params.delete('subcategory');
            lockedFilters.subcategorySlugs.forEach(slug => {
                params.append('subcategory', slug);
            });
            hasChanges = true;
        }

        if (hasChanges) {
            router.replace(`${pathname}?${params.toString()}`);
        }
    }, [lockedFilters, pathname, router, searchParams, selectedCategory]);

    // ЭФФЕКТ 2: Автоматическое открытие секций при наличии активных фильтров
    useEffect(() => {
        setExpandedSections(prev => {
            const newExpandedSections = { ...prev };
            let hasChanges = false;

            Object.keys(prev).forEach(section => {
                const active = searchParams.getAll(section);
                const shouldBeExpanded = active.length > 0;

                if (shouldBeExpanded && !prev[section as FilterSections]) {
                    newExpandedSections[section as FilterSections] = true;
                    hasChanges = true;
                }
            });

            return hasChanges ? newExpandedSections : prev;
        });
    }, [searchParams]);

    // ========================================================================
    // ОБРАБОТЧИКИ СОБЫТИЙ
    // ========================================================================

    const toggleSection = (section: FilterSections) => {
        const active = searchParams.getAll(section);
        const hasActiveFilters = active.length > 0;

        // Если есть активные фильтры и секция открыта - не закрываем
        if (hasActiveFilters && expandedSections[section]) {
            return;
        }

        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleCategoryChange = (categorySlug: string) => {
        // БЛОКИРОВКА: Блокируем изменение категории если она заблокирована
        if (lockedFilters?.categorySlug) return;

        const params = new URLSearchParams(searchParams);
        if (selectedCategory === categorySlug) {
            params.delete('category');
        } else {
            params.set('category', categorySlug);
            setExpandedSections(prev => ({
                ...prev,
                categories: true
            }));
            // Очищаем связанные фильтры при смене категории
            params.delete('subcategory');
            params.delete('brand');
            params.delete('minPrice');
            params.delete('maxPrice');
            params.delete('minWeight');
            params.delete('maxWeight');
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSubcategoryChange = (subcategorySlug: string) => {
        // БЛОКИРОВКА: Блокируем изменение подкатегорий если они заблокированы
        if (lockedFilters?.subcategorySlugs?.includes(subcategorySlug)) return;

        const params = new URLSearchParams(searchParams);
        const current = params.getAll('subcategory');

        if (current.includes(subcategorySlug)) {
            params.delete('subcategory');
            // Сохраняем заблокированные подкатегории при удалении
            const filteredCurrent = current.filter(s => s !== subcategorySlug);
            filteredCurrent.forEach(s => params.append('subcategory', s));
        } else {
            params.append('subcategory', subcategorySlug);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleBrandChange = (brandSlug: string) => {
        const params = new URLSearchParams(searchParams);
        if (selectedBrand === brandSlug) {
            params.delete('brand');
        } else {
            params.set('brand', brandSlug);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleClearFilters = () => {
        const params = new URLSearchParams(searchParams);

        // УМНАЯ ОЧИСТКА: Очищаем только незаблокированные фильтры
        if (!lockedFilters?.categorySlug) {
            params.delete('category');
        }

        // Для подкатегорий оставляем только заблокированные
        if (lockedFilters?.subcategorySlugs) {
            params.delete('subcategory');
            lockedFilters.subcategorySlugs.forEach(slug => {
                params.append('subcategory', slug);
            });
        } else {
            params.delete('subcategory');
        }

        params.delete('brand');
        params.delete('minPrice');
        params.delete('maxPrice');
        params.delete('minWeight');
        params.delete('maxWeight');

        router.push(`${pathname}?${params.toString()}`);
    };

    // ========================================================================
    // ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ
    // ========================================================================

    // Определяем какие секции показывать
    const shouldShowCategories = !lockedFilters?.categorySlug && filteredCategories.length > 0;
    const shouldShowActividades = filteredActividades.length > 0;

    // Фильтруем активности если нужно показывать только активности
    const displayedActividades = lockedFilters?.isActivityOnly
        ? filteredActividades.filter(activity => activity.isActivity)
        : filteredActividades;

    // ========================================================================
    // РЕНДЕР КОМПОНЕНТА
    // ========================================================================

    return (
        <div className="filter-container space-y-4 ">

            {/* ================================================================ */}
            {/* ЗАГОЛОВОК С КНОПКОЙ ОЧИСТКИ */}
            {/* ================================================================ */}
            <div className={'w-full flex justify-between items-center pl-1 pr-11 py-2 border-b border-gray-300'}>
                <h3 className="font-semibold uppercase ">
                    Filtro
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full flex justify-end items-center cursor-pointer "
                    onClick={handleClearFilters}
                >
                    <RotateCcw className="h-4 w-4 text-brand-hover" />
                </Button>
            </div>

            {/* ================================================================ */}
            {/* ИНФОРМАЦИОННЫЙ БЛОК ЗАБЛОКИРОВАННЫХ ФИЛЬТРОВ */}
            {/* ================================================================ */}
            {/*
                МЕСТО ДЛЯ ИЗМЕНЕНИЯ:
                - Для categorySlug - показывает название категории как заголовок
                - Для isActivityOnly - показывает информацию о режиме активностей
                - ЗДЕСЬ МОЖНО ИЗМЕНИТЬ ЛОГИКУ ОТОБРАЖЕНИЯ АКТИВНОСТЕЙ
            */}
            {lockedFilters && (
                <div className="space-y-2 border-gray-200">
                    {lockedFilters.categorySlug && (
                        <div className="text-base uppercase pb-2 border-b font-bold text-gray-900 py-1 rounded">
                            {lockedFilters.categorySlug}
                        </div>
                    )}
                    {lockedFilters.isActivityOnly && (
                        <div className="text-base uppercase pb-2 border-b font-bold text-gray-900 py-1 rounded">
                            {selectedActividades.length > 0
                                ? displayedActividades.find(a => selectedActividades.includes(a.slug))?.name || 'ACTIVIDADES'
                                : 'ACTIVIDADES'
                            }
                        </div>
                    )}
                </div>
            )}

            {/* ================================================================ */}
            {/* БЛОК АКТИВНОСТЕЙ ДЛЯ РЕЖИМА isActivityOnly (ПОКАЗЫВАЕТСЯ ПЕРВЫМ) */}
            {/* ================================================================ */}
            {/*
                МЕСТО ДЛЯ ИЗМЕНЕНИЯ:
                - Сейчас показывается как обычная секция "Actividades"
                - ЗДЕСЬ НУЖНО ИЗМЕНИТЬ НА ЛОГИКУ С ЗАГОЛОВКОМ И СКРЫТИЕМ СПИСКА
            */}
            {lockedFilters?.isActivityOnly && shouldShowActividades && displayedActividades.length > 0 && selectedActividades.length === 0 && (
                <div className="space-y-1">
                    {displayedActividades.map(activity => {
                        const isLocked = lockedFilters?.subcategorySlugs?.includes(activity.slug);
                        return (
                            <button
                                key={activity.id}
                                onClick={() => handleSubcategoryChange(activity.slug)}
                                disabled={isLocked}
                                className={`block w-full text-left  py-1 text-sm rounded transition-colors ${
                                    selectedActividades.includes(activity.slug)
                                        ? isLocked
                                            ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                                            : 'bg-green-100 text-green-800'
                                        : isLocked
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'hover:bg-gray-50'
                                }`}
                            >
                                {activity.name} ({activity.productCount})
                                {isLocked && <span className="ml-1 text-xs">🔒</span>}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* ================================================================ */}
            {/* БЛОК КАТЕГОРИЙ (СКРЫВАЕТСЯ ПРИ ЗАБЛОКИРОВАННОЙ КАТЕГОРИИ) */}
            {/* ================================================================ */}
            {shouldShowCategories && (
                <div className="space-y-2">
                    <button
                        onClick={() => toggleSection('category')}
                        className="flex items-center justify-between w-full font-medium text-sm text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        <span>Categorías</span>
                        {expandedSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedSections.category ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                        {filteredCategories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.slug)}
                                className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    selectedCategory === category.slug
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {category.name} ({category.productCount})
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ================================================================ */}
            {/* БЛОК АКТИВНОСТЕЙ ДЛЯ ОБЫЧНОГО РЕЖИМА (НЕ isActivityOnly) */}
            {/* ================================================================ */}
            {!lockedFilters?.isActivityOnly && shouldShowActividades && displayedActividades.length > 0 && (
                <div className="space-y-2">
                    <button
                        onClick={() => toggleSection('subcategory')}
                        className="flex items-center justify-between w-full font-medium text-sm text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        <span>Actividades</span>
                        {expandedSections.subcategory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedSections.subcategory ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                        {displayedActividades.map(activity => {
                            const isLocked = lockedFilters?.subcategorySlugs?.includes(activity.slug);
                            return (
                                <button
                                    key={activity.id}
                                    onClick={() => handleSubcategoryChange(activity.slug)}
                                    disabled={isLocked}
                                    className={`block w-full text-left px-2 py-1 text-sm rounded transition-colors ${
                                        selectedActividades.includes(activity.slug)
                                            ? isLocked
                                                ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                                                : 'bg-green-100 text-green-800'
                                            : isLocked
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'hover:bg-gray-50'
                                    }`}
                                >
                                    {activity.name} ({activity.productCount})
                                    {isLocked && <span className="ml-1 text-xs">🔒</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ================================================================ */}
            {/* ОСТАЛЬНЫЕ ФИЛЬТРЫ (БРЕНДЫ, ВЕС, ЦЕНЫ) */}
            {/* ================================================================ */}

            {/* Блок брендов */}
            {filteredBrands.length > 0 && (
                <div className="space-y-2">
                    <button
                        onClick={() => toggleSection('brand')}
                        className="flex items-center justify-between w-full font-medium text-sm text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        <span>Brands</span>
                        {expandedSections.brand ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedSections.brand ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                        {filteredBrands.map(brand => (
                            <button
                                key={brand.id}
                                onClick={() => handleBrandChange(brand.slug)}
                                className={`block w-full text-left px-2 py-1 text-sm rounded transition-colors
                                    ${selectedBrand?.includes(brand.slug)
                                    ? 'bg-green-100 text-green-800'
                                    : 'hover:bg-gray-50'}`}
                            >
                                {brand.name} ({brand.productCount})
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Блок веса */}
            {weightRange.max > 0 && (
                <div className="space-y-2">
                    <button
                        onClick={() => toggleSection('weight')}
                        className="flex items-center justify-between w-full font-medium text-sm text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        <span>Peso</span>
                        {expandedSections.weight ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedSections.weight ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                        <WeightRangeSlider
                            minWeight={weightRange.min}
                            maxWeight={weightRange.max}
                            currentMinWeight={minWeight ? Number(minWeight) : null}
                            currentMaxWeight={maxWeight ? Number(maxWeight) : null}
                            className="px-2"
                        />
                    </div>
                </div>
            )}

            {/* Блок цен */}
            {priceRange.max > 0 && (
                <div className="space-y-2">
                    <button
                        onClick={() => toggleSection('prices')}
                        className="flex items-center justify-between w-full font-medium text-sm text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        <span>Precio</span>
                        {expandedSections.prices ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedSections.prices ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                        <PriceRangeSlider
                            minPrice={priceRange.min}
                            maxPrice={priceRange.max}
                            currentMinPrice={minPrice ? Number(minPrice) : null}
                            currentMaxPrice={maxPrice ? Number(maxPrice) : null}
                            className="px-2"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterGallery