import { useProducts } from "@/stores/product-store";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const useProductFilters = () => {
    const products = useProducts()
    const searchParams = useSearchParams()

    const selectedCategory = searchParams.get('category')
    const selectedSubcategories = searchParams.getAll('subcategory')
    const selectedBrands = searchParams.getAll('brand')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minWeight = searchParams.get('minWeight')
    const maxWeight = searchParams.get('maxWeight')

    // 🔍 Отфильтрованные продукты с учётом всех параметров
    const filteredProducts = useMemo(() => {
        let filtered = products

        // Если нет никаких фильтров - возвращаем все продукты
        const hasFilters = selectedCategory || selectedSubcategories.length > 0 || selectedBrands.length > 0 || minPrice || maxPrice || minWeight || maxWeight

        if (!hasFilters) {
            return products // Все продукты
        }

        if (selectedCategory) {
            filtered = filtered.filter(p => p.category?.slug === selectedCategory)
        }

        if (selectedSubcategories.length > 0) {
            filtered = filtered.filter(p => {
                return p.subcategories?.some(subcat =>
                    selectedSubcategories.includes(subcat.slug)
                )
            })
        }

        if (selectedBrands.length > 0) {
            filtered = filtered.filter(p =>
                p.brand && selectedBrands.includes(p.brand.slug)
            )
        }

        if (minPrice || maxPrice) {
            filtered = filtered.filter(p => {
                if (p.price) {
                    return (
                        (minPrice ? p.price >= Number(minPrice) : true) &&
                        (maxPrice ? p.price <= Number(maxPrice) : true)
                    )
                }
                return false
            })
        }

        if (minWeight || maxWeight) {
            filtered = filtered.filter(p => {
                if (p.specificationValues) {
                    const weightSpec = p.specificationValues.find(spec =>
                        spec.specification.key === 'weight' ||
                        spec.specification.name.toLowerCase().includes('peso') ||
                        spec.specification.unit === 'kg'
                    )

                    if (weightSpec && weightSpec.value) {
                        const weightValue = parseFloat(weightSpec.value.replace(/[^\d.,]/g, '').replace(',', '.'))
                        if (!isNaN(weightValue) && weightValue > 0) {
                            return (
                                (minWeight ? weightValue >= Number(minWeight) : true) &&
                                (maxWeight ? weightValue <= Number(maxWeight) : true)
                            )
                        }
                    }
                }
                return false
            })
        }

        return filtered
    }, [products, selectedCategory, selectedSubcategories, selectedBrands, minPrice, maxPrice, minWeight, maxWeight])

    // Добавить новый useMemo для продуктов без ценового фильтра
    const productsWithoutPriceFilter = useMemo(() => {
        let filtered = products

        // Применяем все фильтры КРОМЕ цены
        if (selectedCategory) {
            filtered = filtered.filter(p => p.category?.slug === selectedCategory)
        }

        if (selectedSubcategories.length > 0) {
            filtered = filtered.filter(p => {
                return p.subcategories?.some(subcat =>
                    selectedSubcategories.includes(subcat.slug)
                )
            })
        }

        if (selectedBrands.length > 0) {
            filtered = filtered.filter(p =>
                p.brand && selectedBrands.includes(p.brand.slug)
            )
        }

        // Добавляем фильтрацию по весу (оставляем, так как это не ценовой фильтр)
        if (minWeight || maxWeight) {
            filtered = filtered.filter(p => {
                if (p.specificationValues) {
                    const weightSpec = p.specificationValues.find(spec =>
                        spec.specification.key === 'weight' ||
                        spec.specification.name.toLowerCase().includes('peso') ||
                        spec.specification.unit === 'kg'
                    )

                    if (weightSpec && weightSpec.value) {
                        const weightValue = parseFloat(weightSpec.value.replace(/[^\d.,]/g, '').replace(',', '.'))
                        if (!isNaN(weightValue) && weightValue > 0) {
                            return (
                                (minWeight ? weightValue >= Number(minWeight) : true) &&
                                (maxWeight ? weightValue <= Number(maxWeight) : true)
                            )
                        }
                    }
                }
                return false
            })
        }

        return filtered
    }, [products, selectedCategory, selectedSubcategories, selectedBrands, minWeight, maxWeight])

    // Категории из отфильтрованных продуктов
    const filteredCategories = useMemo(() => {
        const categoryMap = new Map()

        filteredProducts.forEach(product => {
            if (product.category) {
                const existing = categoryMap.get(product.category.id)
                if (existing) {
                    existing.productCount += 1
                } else {
                    categoryMap.set(product.category.id, {
                        id: product.category.id,
                        name: product.category.name,
                        slug: product.category.slug,
                        sortOrder: product.category.sortOrder,
                        productCount: 1
                    })
                }
            }
        })

        return Array.from(categoryMap.values()).sort((a, b) => a.sortOrder - b.sortOrder)
    }, [filteredProducts])

    // Активности (subcategories с isActivity: true) из отфильтрованных продуктов
    const filteredActividades = useMemo(() => {
        const subcategoryMap = new Map()

        filteredProducts.forEach(product => {
            if (product.subcategories) {
                product.subcategories.forEach(subcategory => {
                    if (subcategory.isActivity) {
                        const existing = subcategoryMap.get(subcategory.id)
                        if (existing) {
                            existing.productCount += 1
                        } else {
                            subcategoryMap.set(subcategory.id, {
                                id: subcategory.id,
                                name: subcategory.name,
                                slug: subcategory.slug,
                                isActivity: subcategory.isActivity,
                                sortOrder: subcategory.sortOrder,
                                productCount: 1
                            })
                        }
                    }
                })
            }
        })

        return Array.from(subcategoryMap.values()).sort((a, b) => a.sortOrder - b.sortOrder)
    }, [filteredProducts])

    // Бренды из отфильтрованных продуктов
    const filteredBrands = useMemo(() => {
        const categoryMap = new Map()

        filteredProducts.forEach(product => {
            if (product.brand) {
                const existing = categoryMap.get(product.brand.id)
                if (existing) {
                    existing.productCount += 1
                } else {
                    categoryMap.set(product.brand.id, {
                        id: product.brand.id,
                        name: product.brand.name,
                        slug: product.brand.slug,
                        sortOrder: product.brand.sortOrder,
                        productCount: 1
                    })
                }
            }
        })

        return Array.from(categoryMap.values()).sort((a, b) => a.sortOrder - b.sortOrder)
    }, [filteredProducts])

    const productsWithoutWeightFilter = useMemo(() => {
        let filtered = products

        // Применяем все фильтры КРОМЕ веса
        if (selectedCategory) {
            filtered = filtered.filter(p => p.category?.slug === selectedCategory)
        }

        if (selectedSubcategories.length > 0) {
            filtered = filtered.filter(p => {
                return p.subcategories?.some(subcat =>
                    selectedSubcategories.includes(subcat.slug)
                )
            })
        }

        if (selectedBrands.length > 0) {
            filtered = filtered.filter(p =>
                p.brand && selectedBrands.includes(p.brand.slug)
            )
        }

        // Применяем ценовые фильтры
        if (minPrice || maxPrice) {
            filtered = filtered.filter(p => {
                if (p.price) {
                    return (
                        (minPrice ? p.price >= Number(minPrice) : true) &&
                        (maxPrice ? p.price <= Number(maxPrice) : true)
                    )
                }
                return false
            })
        }

        return filtered
    }, [products, selectedCategory, selectedSubcategories, selectedBrands, minPrice, maxPrice])

    const weightRange = useMemo(() => {
        const weights: number[] = []

        productsWithoutWeightFilter.forEach(product => {
            if (product.specificationValues) {
                // Ищем спецификацию веса по ключу "weight" или содержащую "вес" в названии
                const weightSpec = product.specificationValues.find(spec =>
                    spec.specification.key === 'weight' ||
                    spec.specification.name.toLowerCase().includes('peso') ||
                    spec.specification.unit === 'kg'
                )

                if (weightSpec && weightSpec.value) {
                    // Парсим значение, убираем возможные единицы измерения
                    const weightValue = parseFloat(weightSpec.value.replace(/[^\d.,]/g, '').replace(',', '.'))
                    if (!isNaN(weightValue) && weightValue > 0) {
                        weights.push(weightValue)
                    }
                }
            }
        })

        if (weights.length === 0) {
            return { min: 0, max: 0 }
        }

        return {
            min: Math.min(...weights),
            max: Math.max(...weights)
        }
    }, [productsWithoutWeightFilter])

    // Интервал цен из продуктов БЕЗ ценового фильтра
    const priceRange = useMemo(() => {
        if (productsWithoutPriceFilter.length === 0) {
            return { min: 0, max: 0 }
        }

        const prices = productsWithoutPriceFilter
            .map(product => product.price)
            .filter(price => price != null && price > 0)

        if (prices.length === 0) {
            return { min: 0, max: 0 }
        }

        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        }
    }, [productsWithoutPriceFilter])

    return {
        filteredProducts,
        filteredCategories,
        filteredActividades,
        filteredBrands,
        priceRange,
        weightRange
    }
}

export default useProductFilters