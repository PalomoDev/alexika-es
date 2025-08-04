import { productFullSchema } from './full'
import {imageBaseSchema, productBaseSchema} from "@/lib/validations/product/base";
import {z} from "zod";
import {uuidSchema} from "@/lib/validations/base";


// Схема для изображения особенности
export const FeatureImage = imageBaseSchema.omit({
    createdAt: true,
    isDeleted: true,
    deletedAt: true,
    updatedAt: true,
    filename: true,
});

// Схема для полного ответа особенности в админке
export const productFullResponseSchema = productFullSchema.extend({
    images: z.array(FeatureImage),
}).omit({
    imageIds: true,
});

export const productCreateSchema = productBaseSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    numReviews: true,
    rating: true,
}).extend({
    // Связи many-to-many через ID
    subcategoryIds: z.array(uuidSchema).min(1, "At least one subcategory must be selected"),
    featureIds: z.array(uuidSchema),
    specificationValues: z.array(z.object({
        specificationId: uuidSchema,
        value: z.string().min(1, "Specification value is required"),
    })),
});

export const productUpdateSchema = productBaseSchema.omit({
    createdAt: true,
    updatedAt: true,
    numReviews: true,
    rating: true,
}).extend({
    // Связи many-to-many через ID
    subcategoryIds: z.array(uuidSchema).min(1, "At least one subcategory must be selected"),
    featureIds: z.array(uuidSchema),
    specificationValues: z.array(z.object({
        specificationId: uuidSchema,
        value: z.string().min(1, "Specification value is required"),
    })),
});


export type ProductFullResponse = z.infer<typeof productFullResponseSchema>;
export type ProductCreate = z.infer<typeof productCreateSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;