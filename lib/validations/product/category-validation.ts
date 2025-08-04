// lib/validations/product/category-validation.ts

import { z } from "zod";
import { categoryBaseSchema, imageBaseSchema } from "./base";

// Добавить схему для изображения категории
export const CategoryImage = imageBaseSchema.omit({
    createdAt: true,
    isDeleted: true,
    deletedAt: true,
    updatedAt: true,
    filename: true,
})

// Схема для списка категорий в админке
export const categoryFullResponseSchema = categoryBaseSchema.extend({
    images: z.array(CategoryImage),
    _count: z.object({
        products: z.number().int().min(0),
    }),
    categorySubcategories: z.array(z.object({
        subcategory: z.object({
            id: z.string(),
            name: z.string(),
            isActive: z.boolean(),
        }),
    })).optional(),
    categorySpecifications: z.array(z.object({
        specification: z.object({
            id: z.string(),
            name: z.string(),
            isActive: z.boolean(),
        }),
    })).optional(),
}).omit({
    imageIds: true,
})

// Схема для создания категории
export const createCategorySchema = categoryBaseSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

// Схема для редактирования категории
export const updateCategorySchema = categoryBaseSchema.partial().omit({
    createdAt: true,
    updatedAt: true,
});

// Схема для удаления категории
export const deleteCategorySchema = categoryBaseSchema.pick({
    id: true,
});

// Схема для пользовательского фильтра
export const categoryFilterSchema = categoryBaseSchema.pick({
    id: true,
    name: true,
    slug: true,
    imageIds: true,
}).extend({
    _count: z.object({
        products: z.number().int().min(0),
    }),
    products: z.array(z.object({
        slug: z.string(),
    })).optional(),
});

const categoryClientSubcategorySchema = z.object({
    subcategory: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
    }),
});
export const categoryClientResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    _count: z.object({
        products: z.number().int().min(0),
    }),
    categorySubcategories: z.array(categoryClientSubcategorySchema),
});
// Схема для ответа функции
export const categoriesClientApiResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(categoryClientResponseSchema).nullable(),
    message: z.string().nullable(),
});


// Типы
export type CategoryFullResponse = z.infer<typeof categoryFullResponseSchema>;
export type CategoryCreate = z.infer<typeof createCategorySchema>;
export type CategoryUpdate = z.infer<typeof updateCategorySchema>;
export type CategoryDelete = z.infer<typeof deleteCategorySchema>;
export type CategoryFilter = z.infer<typeof categoryFilterSchema>;
export type CategoryImage = z.infer<typeof CategoryImage>;
export type CategoryClientResponse = z.infer<typeof categoryClientResponseSchema>;
export type CategoriesClientApiResponse = z.infer<typeof categoriesClientApiResponseSchema>;
