import {z} from "zod";
import {uuidSchema, urlSchema, emailSchema} from "@/lib/validations/base";

// Схема для централизованных изображений
// Базовая схема изображения с мягким удалением
export const imageBaseSchema = z.object({
    id: uuidSchema,
    filename: z.string().min(1).max(255),
    url: z.string().min(1),
    alt: z.string().nullable(),
    sortOrder: z.number().int().min(0),
    isDeleted: z.boolean(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const productBaseSchema = z.object({
    id: uuidSchema,
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),
    sku: z.string().min(1).max(100),
    categoryId: uuidSchema,
    brandId: uuidSchema,
    imageIds: z.array(uuidSchema), // Массив UUID изображений
    description: z.string().min(1),
    stock: z.number().int().min(0),
    price: z.number().min(0),
    rating: z.number().min(0).max(5),
    numReviews: z.number().int().min(0),
    isFeatured: z.boolean(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const brandBaseSchema = z.object({
    id: uuidSchema,
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),
    description: z.string().nullable(),
    imageIds: z.array(uuidSchema), // Массив UUID изображений (логотип)
    website: urlSchema.nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int().min(0),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const categoryBaseSchema = z.object({
    id: uuidSchema,
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),
    description: z.string().nullable(),
    imageIds: z.array(uuidSchema), // Массив UUID изображений
    isActive: z.boolean(),
    sortOrder: z.number().int().min(0),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const subcategoryBaseSchema = z.object({
    id: uuidSchema,
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),
    description: z.string().nullable(),
    imageIds: z.array(uuidSchema), // Массив UUID изображений
    isActivity: z.boolean(),
    isActive: z.boolean(),
    sortOrder: z.number().int().min(0),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const specificationBaseSchema = z.object({
    id: uuidSchema,
    name: z.string().min(1).max(255),
    key: z.string().min(1).max(255),
    description: z.string().nullable(),
    unit: z.string().nullable(),
    type: z.enum(["number", "text"]), // Только два типа
    imageIds: z.array(uuidSchema),
    category: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int().min(0),
    createdAt: z.date(), updatedAt: z.date(),

});

export const featureBaseSchema = z.object({
    id: uuidSchema,
    name: z.string().min(1).max(255),
    key: z.string().min(1).max(255),
    imageIds: z.array(uuidSchema), // Массив UUID изображений (иконки)
    description: z.string().nullable(),
    categoryId: uuidSchema.nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int().min(0),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const userBaseSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    email: emailSchema,
    emailVerified: z.boolean(),
    image: urlSchema.nullable(), // Оставляем как есть для авторизации
    role: z.string().default("user"),
    address: z.any().nullable(),
    paymentMethod: z.string().nullable(),
    banned: z.boolean().nullable(),
    banReason: z.string().nullable(),
    banExpires: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});



export const reviewBaseSchema = z.object({
    id: uuidSchema,
    userId: z.string(),
    productId: uuidSchema,
    rating: z.number().int().min(1).max(5),
    title: z.string().min(1),
    description: z.string().min(1),
    isVerifiedPurchase: z.boolean().default(true),
    isApproved: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const orderBaseSchema = z.object({
    id: uuidSchema,
    userId: z.string(),
    shippingAddress: z.any(),
    paymentMethod: z.string(),
    paymentResult: z.any().nullable(),
    itemsPrice: z.number().min(0),
    shippingPrice: z.number().min(0),
    taxPrice: z.number().min(0),
    totalPrice: z.number().min(0),
    isPaid: z.boolean().default(false),
    paidAt: z.date().nullable(),
    isDelivered: z.boolean().default(false),
    deliveredAt: z.date().nullable(),
    status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const orderItemBaseSchema = z.object({
    orderId: uuidSchema,
    productId: uuidSchema,
    qty: z.number().int().min(1),
    price: z.number().min(0),
    name: z.string().min(1),
    slug: z.string().min(1),
    image: urlSchema, // Оставляем для совместимости заказов
});

export type UserBase = z.infer<typeof userBaseSchema>;
export type OrderBase = z.infer<typeof orderBaseSchema>;
export type OrderItemBase = z.infer<typeof orderItemBaseSchema>;
