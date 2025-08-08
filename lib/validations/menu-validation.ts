import { z } from "zod";
import { uuidSchema } from "@/lib/validations/base";
import {
    categoryBaseSchema,
    brandBaseSchema,
    subcategoryBaseSchema
} from "@/lib/validations/product/base";

// Схема для бренда в меню (упрощенная версия)
export const menuBrandSchema = brandBaseSchema.pick({
    id: true,
    name: true,
    slug: true,
}).extend({
    productCount: z.number().int().min(0), // Количество товаров в конкретной категории
});

// Схема для подкатегории в меню (упрощенная версия)
export const menuSubcategorySchema = subcategoryBaseSchema.pick({
    id: true,
    name: true,
    slug: true,
}).extend({
    productCount: z.number().int().min(0), // Количество товаров в подкатегории
});

// Схема для категории в меню
export const menuCategorySchema = categoryBaseSchema.pick({
    id: true,
    name: true,
    slug: true,
}).extend({
    productCount: z.number().int().min(0), // Общее количество товаров в категории
    activities: z.array(menuSubcategorySchema),
    brands: z.array(menuBrandSchema), // Бренды, доступные в этой категории
});

// Схема для бренда в общем списке
export const allBrandSchema = brandBaseSchema.pick({
    id: true,
    name: true,
    slug: true,
}).extend({
    totalProducts: z.number().int().min(0), // Общее количество товаров бренда
    categories: z.array(uuidSchema), // ID категорий, где представлен бренд
});

// Основная схема меню каталога
export const catalogMenuSchema = z.object({
    categories: z.array(menuCategorySchema),
    allBrands: z.array(allBrandSchema),
    generatedAt: z.string().datetime(), // ISO строка даты генерации
});

// Экспортируем типы
export type MenuBrand = z.infer<typeof menuBrandSchema>;
export type MenuSubcategory = z.infer<typeof menuSubcategorySchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;
export type AllBrand = z.infer<typeof allBrandSchema>;
export type CatalogMenu = z.infer<typeof catalogMenuSchema>;

// Дополнительные типы для работы с фильтрами
export type FilterState = {
    categoryId?: string;
    subcategoryIds?: string[];
    brandIds?: string[];
    priceRange?: {
        min: number;
        max: number;
    };
};

// Схема для валидации состояния фильтров
export const filterStateSchema = z.object({
    categoryId: uuidSchema.optional(),
    subcategoryIds: z.array(uuidSchema).optional(),
    brandIds: z.array(uuidSchema).optional(),
    priceRange: z.object({
        min: z.number().min(0),
        max: z.number().min(0),
    }).refine(data => data.max >= data.min, {
        message: "Max price must be greater than or equal to min price",
    }).optional(),
});

export type FilterStateValidated = z.infer<typeof filterStateSchema>;