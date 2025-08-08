'use server'

import prisma from "@/lib/prisma";
import { formatError } from "@/lib/utils";
import {readFile, writeFile} from 'fs/promises';
import { join } from 'path';
import {
    CatalogMenu,
    MenuCategory,
    MenuBrand,
    MenuSubcategory,
    AllBrand,
    catalogMenuSchema
} from "@/lib/validations/menu-validation";

type ActionResponse<T = undefined> = {
    success: boolean;
    data: T | null;
    message?: string;
};

export async function generateCatalogMenu(): Promise<ActionResponse<CatalogMenu>> {
    try {
        // БЛОК 1: Получение данных
        // Получаем все активные категории с подкатегориями
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            include: {
                categorySubcategories: {
                    include: {
                        subcategory: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                isActive: true,
                                isActivity: true
                            }
                        }
                    },
                    orderBy: { sortOrder: 'asc' }
                }
            },
            orderBy: { sortOrder: 'asc' }
        });

        // Получаем все активные продукты с категориями и брендами
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                stock: { gt: 0 } // Только товары в наличии
            },
            select: {
                id: true,
                categoryId: true,
                brandId: true,
                category: {
                    select: { id: true, name: true, slug: true }
                },
                brand: {
                    select: { id: true, name: true, slug: true }
                }
            }
        });

        // БЛОК 2: Подсчет товаров
        // Получаем связи продуктов с подкатегориями
        const productSubcategories = await prisma.productSubcategory.findMany({
            where: {
                product: {
                    isActive: true,
                    stock: { gt: 0 }
                }
            },
            select: {
                productId: true,
                subcategoryId: true
            }
        });

        // Создаем мапу продукт -> подкатегории
        const productSubcategoryMap = new Map<string, string[]>();
        productSubcategories.forEach(ps => {
            if (!productSubcategoryMap.has(ps.productId)) {
                productSubcategoryMap.set(ps.productId, []);
            }
            productSubcategoryMap.get(ps.productId)!.push(ps.subcategoryId);
        });

        // Подсчет товаров по категориям и подкатегориям
        const categoryProductMap = new Map<string, number>();
        const subcategoryProductMap = new Map<string, number>();

        // Группируем продукты по категориям и брендам
        const categoryBrandMap = new Map<string, Map<string, number>>();
        const brandTotalMap = new Map<string, {
            brand: { id: string, name: string, slug: string },
            count: number,
            categories: Set<string>
        }>();

        products.forEach(product => {
            const categoryId = product.categoryId;
            const brandId = product.brandId;

            // Подсчет товаров по категориям
            categoryProductMap.set(categoryId, (categoryProductMap.get(categoryId) || 0) + 1);

            // Подсчет товаров по подкатегориям
            const productSubcats = productSubcategoryMap.get(product.id) || [];
            productSubcats.forEach(subcategoryId => {
                subcategoryProductMap.set(subcategoryId, (subcategoryProductMap.get(subcategoryId) || 0) + 1);
            });

            // Для категорий и брендов внутри категорий
            if (!categoryBrandMap.has(categoryId)) {
                categoryBrandMap.set(categoryId, new Map());
            }
            const brandMap = categoryBrandMap.get(categoryId)!;
            brandMap.set(brandId, (brandMap.get(brandId) || 0) + 1);

            // Для общего списка брендов
            if (!brandTotalMap.has(brandId)) {
                brandTotalMap.set(brandId, {
                    brand: product.brand,
                    count: 0,
                    categories: new Set()
                });
            }
            const brandData = brandTotalMap.get(brandId)!;
            brandData.count += 1;
            brandData.categories.add(categoryId);
        });

        // БЛОК 3: Формирование меню категорий
        const menuCategories: MenuCategory[] = categories.map(category => {
            // Получаем товары только этой категории
            const categoryProducts = products.filter(product => product.categoryId === category.id);

            // Собираем все подкатегории, которые есть у товаров этой категории
            const categorySubcategoryIds = new Set<string>();
            categoryProducts.forEach(product => {
                const productSubcats = productSubcategoryMap.get(product.id) || [];
                productSubcats.forEach(subcategoryId => {
                    categorySubcategoryIds.add(subcategoryId);
                });
            });

            // Формируем список подкатегорий только тех, которые реально есть у товаров этой категории
            const activities: MenuSubcategory[] = category.categorySubcategories
                .filter(cs => {
                    // Проверяем: активна ли подкатегория И есть ли товары с ней в этой категории
                    return cs.subcategory.isActive &&
                        cs.subcategory.isActivity &&
                        categorySubcategoryIds.has(cs.subcategory.id);
                })
                .map(cs => {
                    // Подсчитываем товары этой подкатегории только в текущей категории
                    let productCount = 0;
                    categoryProducts.forEach(product => {
                        const productSubcats = productSubcategoryMap.get(product.id) || [];
                        if (productSubcats.includes(cs.subcategory.id)) {
                            productCount++;
                        }
                    });

                    return {
                        id: cs.subcategory.id,
                        name: cs.subcategory.name,
                        slug: cs.subcategory.slug,
                        productCount
                    };
                });

            // Получаем бренды для этой категории
            const categoryBrands: MenuBrand[] = [];
            const brandMap = categoryBrandMap.get(category.id);

            if (brandMap) {
                // Получаем уникальные бренды для категории
                const uniqueBrands = new Map<string, { id: string, name: string, slug: string }>();
                categoryProducts.forEach(product => {
                    uniqueBrands.set(product.brandId, product.brand);
                });

                uniqueBrands.forEach((brand, brandId) => {
                    const productCount = brandMap.get(brandId) || 0;
                    if (productCount > 0) {
                        categoryBrands.push({
                            id: brand.id,
                            name: brand.name,
                            slug: brand.slug,
                            productCount
                        });
                    }
                });
            }

            // Сортируем бренды по количеству товаров (убывание)
            categoryBrands.sort((a, b) => b.productCount - a.productCount);

            return {
                id: category.id,
                name: category.name,
                slug: category.slug,
                productCount: categoryProductMap.get(category.id) || 0,
                activities,
                brands: categoryBrands
            };
        });

        // БЛОК 4: Формирование общего списка брендов
        const allBrands: AllBrand[] = Array.from(brandTotalMap.entries())
            .map(([brandId, data]) => ({
                id: data.brand.id,
                name: data.brand.name,
                slug: data.brand.slug,
                totalProducts: data.count,
                categories: Array.from(data.categories)
            }))
            .sort((a, b) => b.totalProducts - a.totalProducts); // Сортируем по убыванию количества товаров

        // БЛОК 5: Сохранение результата
        // Формируем финальное меню
        const catalogMenu: CatalogMenu = {
            categories: menuCategories,
            allBrands,
            generatedAt: new Date().toISOString()
        };

        // Валидируем данные перед сохранением
        const validatedMenu = catalogMenuSchema.parse(catalogMenu);

        // Сохраняем меню в файл
        const menuPath = join(process.cwd(), 'public', 'catalog-menu.json');
        await writeFile(menuPath, JSON.stringify(validatedMenu, null, 2), 'utf-8');

        return {
            success: true,
            data: validatedMenu,
            message: `Menu generated successfully with ${menuCategories.length} categories and ${allBrands.length} brands`
        };

    } catch (error) {
        return {
            success: false,
            data: null,
            message: formatError(error)
        };
    }
}


export const getCatalogMenu = async (): Promise<CatalogMenu | null> => {
    try {
        const menuPath = join(process.cwd(), 'public', 'catalog-menu.json');
        const menuJson = await readFile(menuPath, 'utf-8');
        const menuData = JSON.parse(menuJson);

        // Валидируем и типизируем
        const validatedMenu = catalogMenuSchema.parse(menuData);
        return validatedMenu; // ДОБАВЛЕНО: возвращаем результат
    } catch (error) {
        console.error('Error reading catalog menu:', error);
        return null;
    }
};