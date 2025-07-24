import { z } from "zod";
import {
    productBaseSchema,
    brandBaseSchema,
    categoryBaseSchema,
    subcategoryBaseSchema,
    specificationBaseSchema,
    featureBaseSchema,
    userBaseSchema,
    reviewBaseSchema,
    orderBaseSchema,
    orderItemBaseSchema,
} from "./base";
import { uuidSchema } from "@/lib/validations/base";

export const productFullSchema = productBaseSchema.extend({
    category: categoryBaseSchema.optional(),
    brand: brandBaseSchema.optional(),
    productSubcategories: z.array(z.object({
        id: uuidSchema,
        subcategory: subcategoryBaseSchema,
    })).optional(),
    specificationValues: z.array(z.object({
        id: uuidSchema,
        value: z.string(),
        specification: specificationBaseSchema,
    })).optional(),
    features: z.array(z.object({
        feature: featureBaseSchema,
    })).optional(),
    OrderItem: z.array(orderItemBaseSchema).optional(),
    Review: z.array(reviewBaseSchema).optional(),
});

export const brandFullSchema = brandBaseSchema.extend({
    products: z.array(productBaseSchema).optional(),
});

export const categoryFullSchema = categoryBaseSchema.extend({
    products: z.array(productBaseSchema).optional(),
    categorySubcategories: z.array(z.object({
        id: uuidSchema,
        sortOrder: z.number().int(),
        subcategory: subcategoryBaseSchema,
    })).optional(),
    categorySpecifications: z.array(z.object({
        id: uuidSchema,
        isRequired: z.boolean(),
        sortOrder: z.number().int(),
        specification: specificationBaseSchema,
    })).optional(),
});

export const subcategoryFullSchema = subcategoryBaseSchema.extend({
    categorySubcategories: z.array(z.object({
        id: uuidSchema,
        sortOrder: z.number().int(),
        category: categoryBaseSchema,
    })).optional(),
    productSubcategories: z.array(z.object({
        id: uuidSchema,
        product: productBaseSchema,
    })).optional(),
});

export const specificationFullSchema = specificationBaseSchema.extend({
    productSpecifications: z.array(z.object({
        id: uuidSchema,
        value: z.string(),
        product: productBaseSchema,
    })).optional(),
    categorySpecs: z.array(z.object({
        id: uuidSchema,
        isRequired: z.boolean(),
        sortOrder: z.number().int(),
        category: categoryBaseSchema,
    })).optional(),
});

export const featureFullSchema = featureBaseSchema.extend({
    productFeatures: z.array(z.object({
        product: productBaseSchema,
    })).optional(),
});

export const userFullSchema = userBaseSchema.extend({
    carts: z.array(z.object({
        id: uuidSchema,
        sessionCartId: z.string(),
        items: z.array(z.any()),
        itemsPrice: z.number(),
        totalPrice: z.number(),
        shippingPrice: z.number(),
        taxPrice: z.number(),
    })).optional(),
    orders: z.array(orderBaseSchema).optional(),
    reviews: z.array(reviewBaseSchema).optional(),
});

export const reviewFullSchema = reviewBaseSchema.extend({
    product: productBaseSchema.optional(),
    user: userBaseSchema.optional(),
});

export const orderFullSchema = orderBaseSchema.extend({
    user: userBaseSchema.optional(),
    orderitems: z.array(orderItemBaseSchema).optional(),
});

export const orderItemFullSchema = orderItemBaseSchema.extend({
    order: orderBaseSchema.optional(),
    product: productBaseSchema.optional(),
});

