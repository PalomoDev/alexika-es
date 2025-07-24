// lib/validations/product/subcategory-validation.ts

import { z } from "zod";
import { subcategoryBaseSchema, imageBaseSchema } from "./base";
import { uuidSchema } from "@/lib/validations/base";

// Схема для изображения субкатегории
export const SubcategoryImage = imageBaseSchema.omit({
    createdAt: true,
    isDeleted: true,
    deletedAt: true,
    updatedAt: true,
    filename: true,
});

// Схема для полного ответа субкатегории в админке
export const subcategoryFullResponseSchema = subcategoryBaseSchema.extend({
    images: z.array(SubcategoryImage),
    _count: z.object({
        productSubcategories: z.number().int().min(0),
    }),
    categorySubcategories: z.array(z.object({
        category: z.object({
            id: z.string(),
            name: z.string(),
            isActive: z.boolean(),
        }),
        sortOrder: z.number().int(),
    })).optional(),
}).omit({
    imageIds: true,
});

// Схема для создания субкатегории
export const createSubcategorySchema = subcategoryBaseSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    categoryIds: z.array(uuidSchema).min(1, "At least one category must be selected"),
});

// Схема для редактирования субкатегории
export const updateSubcategorySchema = subcategoryBaseSchema.partial().omit({
    createdAt: true,
    updatedAt: true,
}).extend({
    categoryIds: z.array(uuidSchema).min(1, "At least one category must be selected").optional(),
});

// Схема для удаления субкатегории
export const deleteSubcategorySchema = subcategoryBaseSchema.pick({
    id: true,
});

// Схема для пользовательского фильтра
export const subcategoryFilterSchema = subcategoryBaseSchema.pick({
    id: true,
    name: true,
    slug: true,
    imageIds: true,
    isActive: true,
    isActivity: true,
}).extend({
    _count: z.object({
        productSubcategories: z.number().int().min(0),
    }),
    categories: z.array(z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
    })).optional(),
});

// Типы
export type SubcategoryFullResponse = z.infer<typeof subcategoryFullResponseSchema>;
export type SubcategoryCreate = z.infer<typeof createSubcategorySchema>;
export type SubcategoryUpdate = z.infer<typeof updateSubcategorySchema>;
export type SubcategoryDelete = z.infer<typeof deleteSubcategorySchema>;
export type SubcategoryFilter = z.infer<typeof subcategoryFilterSchema>;
export type SubcategoryImage = z.infer<typeof SubcategoryImage>;