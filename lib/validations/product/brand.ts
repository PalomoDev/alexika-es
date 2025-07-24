// lib/validations/product/brand.ts

import { z } from "zod";
import {brandBaseSchema, imageBaseSchema} from "./base";


export const BrandImage = imageBaseSchema.omit({
    createdAt: true,
    isDeleted: true,
    deletedAt: true,
    updatedAt: true,
    filename: true,
})

// Схема для списка брендов в админке
export const brandFullResponseSchema = brandBaseSchema.extend({
    images: z.array(BrandImage),
    _count: z.object({
        products: z.number().int().min(0),
    }),
}).omit({
    imageIds: true,
})

// Схема для создания бренда
export const createBrandSchema = brandBaseSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

// Схема для редактирования бренда - убрали id из omit
export const updateBrandSchema = brandBaseSchema.partial().omit({
    createdAt: true,
    updatedAt: true,
});

// Схема для удаления бренда
export const deleteBrandSchema = brandBaseSchema.pick({
    id: true,
});

// Схема для пользовательского фильтра
export const brandFilterSchema = brandBaseSchema.pick({
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

// Типы
export type BrandFullResponse = z.infer<typeof brandFullResponseSchema>;
export type BrandCreate = z.infer<typeof createBrandSchema>;
export type BrandUpdate = z.infer<typeof updateBrandSchema>;
export type BrandDelete = z.infer<typeof deleteBrandSchema>;
export type BrandFilter = z.infer<typeof brandFilterSchema>;
export type BrandImage = z.infer<typeof BrandImage>;

