import { z } from 'zod';
import { orderBaseSchema, orderItemBaseSchema, OrderBase, OrderItemBase } from '@/lib/validations/product/base';
import {uuidSchema} from "@/lib/validations/base";
import { ShippingAddressSchema } from '@/lib/validations/user/address-validation';

// Схема для отображения заказа в UI компонентах
export const orderDisplaySchema = orderBaseSchema.extend({
    items: z.array(orderItemBaseSchema)
});



// Схема для обновления заказа
export const orderUpdateSchema = orderBaseSchema.partial().omit({
    id: true,
    userId: true,
    createdAt: true
});

export const orderUserScheme = z.object({
    id: uuidSchema,
    name: z.string(),
    email: z.string(),

});
// Схема для резюме заказа (для компонента OrderTable)
export const orderSummarySchema = orderBaseSchema.pick({
    id: true,
    userId: true,
    paymentMethod: true,
    paymentResult: true,
    itemsPrice: true,
    shippingPrice: true,
    taxPrice: true,
    totalPrice: true,
    isPaid: true,
    paidAt: true,
    isDelivered: true,
    deliveredAt: true,
    status: true,
    createdAt: true,
    updatedAt: true
}).extend({
    shippingAddress: ShippingAddressSchema,
    items: z.array(orderItemBaseSchema),
    user: orderUserScheme,
});

export const orderCreateSchema = z.object({
    userId: z.string(),
    paymentMethod: z.string(),
    itemsPrice: z.number(),
    shippingPrice: z.number(),
    taxPrice: z.number(),
    totalPrice: z.number(),
    shippingAddress: ShippingAddressSchema,
    items: z.array(z.object({
        productId: z.string(),
        qty: z.number().min(1),
        price: z.number(),
        name: z.string(),
        slug: z.string(),
        image: z.string()
    })),
    user: orderUserScheme
});

export type OrderCreate = z.infer<typeof orderCreateSchema>;

// Схема для оплаты заказа
export const orderPaymentSchema = z.object({
    orderId: uuidSchema,
    paymentMethod: z.string(),
    paymentResult: z.any().optional()
});

// Схема для обновления статуса заказа
export const orderStatusUpdateSchema = z.object({
    orderId: uuidSchema,
    status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
    isPaid: z.boolean().optional(),
    paidAt: z.date().optional(),
    isDelivered: z.boolean().optional(),
    deliveredAt: z.date().optional()
});



// Типы выведенные из схем
export type OrderDisplay = z.infer<typeof orderDisplaySchema>;

export type OrderUpdate = z.infer<typeof orderUpdateSchema>;
export type OrderSummary = z.infer<typeof orderSummarySchema>;
export type OrderPayment = z.infer<typeof orderPaymentSchema>;
export type OrderStatusUpdate = z.infer<typeof orderStatusUpdateSchema>;


// Утилитарные типы
export type OrderStatus = OrderBase['status'];
export type PaymentMethod = OrderBase['paymentMethod'];

// Типы для API ответов
export type OrderWithItems = OrderBase & {
    items: OrderItemBase[];
};

export type OrderListItem = Pick<OrderBase,
    'id' | 'totalPrice' | 'status' | 'isPaid' | 'createdAt'
> & {
    itemCount: number;
};

// Схемы для валидации форм
export const orderFormSchema = z.object({
    shippingAddress: ShippingAddressSchema ,
    paymentMethod: z.string().min(1, "Selecciona un método de pago"),
    items: z.array(z.object({
        productId: uuidSchema,
        qty: z.number().int().min(1),
        price: z.number().min(0)
    })).min(1, "El carrito no puede estar vacío")
});

export type OrderForm = z.infer<typeof orderFormSchema>;