
import {z} from "zod";
import {formatNumberWithDecimal} from "@/lib/utils";
import {uuidSchema, urlSchema} from "@/lib/validations/base";

const currency = z
    .string()
    .refine(
        (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
        'Price must have exactly two decimal places'
    );


// Схема для валидации товара в корзине
export const cartItemSchema = z.object({
    id: z.string().min(1, 'Product ID is required'),
    sku: z.string().min(1, 'Product SKU is required'),
    name: z.string().min(1, 'Product name is required'),
    price: currency,
    qty: z.number().int().min(1, 'Quantity must be at least 1'),
    image: urlSchema,
    slug: z.string().min(1, 'Product slug is required'),
    weight: z.number().min(0),
});

// Схема для валидации корзины
export const cartSchema = z.object({
    id: uuidSchema,
    userId: z.string().nullable(),
    sessionCartId: z.string().min(1, 'Session cart ID is required'),
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    totalWeight: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

// Схема для создания корзины
export const createCartSchema = z.object({
    sessionCartId: z.string().min(1, 'Session cart ID is required'),
    userId: z.string().optional(),
    items: z.array(cartItemSchema).optional(),
    itemsPrice: z.number(),
    totalPrice: z.number(),
    shippingPrice: z.number(),
    taxPrice: z.number()
});


export type CartItem = z.infer<typeof cartItemSchema>;
export type ClientCart = z.infer<typeof cartSchema>;
export type CreateCart = z.infer<typeof createCartSchema>;




export const CartUpdateItemSchema = z.object({
    itemId: z.string().min(1, 'ID товара обязателен'),
    currentQty: z.number().int().min(1, 'Текущее количество должно быть больше 0'),
    newQty: z.number().int().min(1, 'Новое количество должно быть больше 0'),
    name: z.string().min(1, 'Название товара обязательно'),
    sku: z.string().min(1, 'SKU товара обязателен')
});

export const CartSummarySchema = z.object({
    itemsPrice: z.string().regex(/^\d+\.\d{2}$/, 'Цена товаров должна быть в формате 0.00'),
    tax: z.string().regex(/^\d+\.\d{2}$/, 'Налог должен быть в формате 0.00'),
    shipping: z.string().regex(/^\d+\.\d{2}$/, 'Стоимость доставки должна быть в формате 0.00'),
    totalWeight: z.number().min(0, 'Общий вес не может быть отрицательным'),
    totalPrice: z.string().regex(/^\d+\.\d{2}$/, 'Общая цена должна быть в формате 0.00'),
    itemsCount: z.number().int().min(1, 'Количество товаров должно быть больше 0')
});

export const CartUpdateDataSchema = z.object({
    hasChanges: z.boolean(),
    updates: z.array(CartUpdateItemSchema),
    summary: CartSummarySchema
}).refine((data) => {
    // Если hasChanges true, то должны быть updates
    if (data.hasChanges && data.updates.length === 0) {
        return false;
    }
    // Если updates есть, то hasChanges должен быть true
    if (data.updates.length > 0 && !data.hasChanges) {
        return false;
    }
    return true;
}, {
    message: 'Несоответствие между hasChanges и updates',
    path: ['hasChanges']
}).refine((data) => {
    // Проверяем, что все количества в updates валидны
    return data.updates.every(update =>
        update.newQty !== update.currentQty &&
        update.newQty > 0 &&
        update.currentQty > 0
    );
}, {
    message: 'Новое количество должно отличаться от текущего и быть больше 0',
    path: ['updates']
}).refine((data) => {
    // Проверяем математическую корректность summary
    const itemsPrice = parseFloat(data.summary.itemsPrice);
    const tax = parseFloat(data.summary.tax);
    const shipping = parseFloat(data.summary.shipping);
    const totalPrice = parseFloat(data.summary.totalPrice);

    const calculatedTotal = parseFloat((itemsPrice + tax + shipping).toFixed(2));

    return Math.abs(totalPrice - calculatedTotal) < 0.01; // Допуск на округление
}, {
    message: 'Общая сумма не соответствует сумме компонентов',
    path: ['summary', 'totalPrice']
});

export type CartUpdateData = z.infer<typeof CartUpdateDataSchema>;
export type CartUpdateItem = z.infer<typeof CartUpdateItemSchema>;
export type CartSummary = z.infer<typeof CartSummarySchema>;

const CartValidationSchema = z.object({
    id: uuidSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
    userId: uuidSchema.nullable(),
    sessionCartId: z.string().min(1, 'ID de sesión requerido'),
    items: z.array(z.any()).min(1, 'El carrito debe tener al menos un producto'),
    itemsPrice: z.number().positive('Precio de productos debe ser positivo'),
    totalPrice: z.number().positive('Precio total debe ser positivo'),
    shippingPrice: z.number().nonnegative('Precio de envío no puede ser negativo'),
    taxPrice: z.number().nonnegative('Impuestos no pueden ser negativos'),
    totalWeight: z.number().positive().nullable()
});

export type Cart = z.infer<typeof CartValidationSchema>;





