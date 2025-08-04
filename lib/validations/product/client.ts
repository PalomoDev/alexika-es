// Упрощенная схема изображения для клиента
import {
    brandBaseSchema,
    categoryBaseSchema, featureBaseSchema,
    imageBaseSchema,
    productBaseSchema, specificationBaseSchema,
    subcategoryBaseSchema
} from "@/lib/validations/product/base";
import {z} from "zod";
import {uuidSchema} from "@/lib/validations/base";

export const imageClientSchema = imageBaseSchema.pick({
    id: true,
    url: true,
    alt: true,
});

// Упрощенные схемы для связанных сущностей (клиентские версии)
export const categoryClientSchema = categoryBaseSchema.pick({
    id: true,
    name: true,
    slug: true,
});

export const brandClientSchema = brandBaseSchema.pick({
    id: true,
    name: true,
    slug: true,
});

export const subcategoryClientSchema = subcategoryBaseSchema.pick({
    id: true,
    name: true,
    slug: true,
    description: true,
});

export const featureClientSchema = featureBaseSchema.pick({
    id: true,
    name: true,
    key: true,
    description: true,
    imageIds: true,
});

export const specificationClientSchema = specificationBaseSchema.pick({
    id: true,
    name: true,
    key: true,
    type: true,
    unit: true,
    description: true,
});

// Основная схема продукта для клиента
export const productClientSchema = productBaseSchema
    .omit({
        imageIds: true, // Заменяем на массив images
        numReviews: true, // Убираем пока не нужно
        createdAt: true, // Убираем служебные поля
        updatedAt: true,
    })
    .extend({
        // Заменяем imageIds на готовые изображения
        images: z.array(imageClientSchema),
        // Computed поля
        formattedPrice: z.string(),
        inStock: z.boolean(),
        // Связи (упрощенные версии)
        category: categoryClientSchema.optional(),
        brand: brandClientSchema.optional(),
        subcategories: z.array(subcategoryClientSchema).optional(),
        features: z.array(featureClientSchema).optional(),
        specificationValues: z.array(z.object({
            id: uuidSchema,
            value: z.string(),
            specification: specificationClientSchema,
        })).optional(),
    });

export type ProductClient = z.infer<typeof productClientSchema>;