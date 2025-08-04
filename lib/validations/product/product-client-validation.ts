import { z } from 'zod'
import { categoryClientResponseSchema } from "./category-validation";

const ProductSchema = z.object({
    id: z.string().min(1, 'ID обязателен'),
    name: z.string().min(1, 'Название обязательно').max(100, 'Название слишком длинное'),
    description: z.string().min(1, 'Описание обязательно').max(500, 'Описание слишком длинное'),
    image: z.string().url('Некорректный URL изображения').or(z.string().startsWith('/', 'Путь должен начинаться с /')),
    price: z.number().positive('Цена должна быть положительной').max(1000000, 'Цена слишком высокая'),
    slug: z.string().min(1, 'Slug обязателен').regex(/^[a-z0-9-]+$/, 'Slug может содержать только строчные буквы, цифры и дефисы'),
    category: categoryClientResponseSchema,
    subcategory: z.string().min(1, 'Подкатегория обязательна'),
    brand: z.string().min(1, 'Бренд обязателен').max(50, 'Название бренда слишком длинное'),
    weight: z.number().positive('Вес должен быть положительным').max(100, 'Вес слишком большой'),
    capacity: z.number().min(0, 'Вместимость не может быть отрицательной').max(1000, 'Вместимость слишком большая'),
    season: z.enum(['leto', 'zima', 'tri-sezona', 'chetyre-sezona', 'universal'], {
        message: 'Неверное значение сезона'
    }),
    waterproof: z.number().min(0, 'Водостойкость не может быть отрицательной').max(50000, 'Водостойкость слишком высокая'),
    inStock: z.boolean(),
    discount: z.number().min(0, 'Скидка не может быть отрицательной').max(100, 'Скидка не может быть больше 100%')
})

export const ProductApiResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(ProductSchema).nullable(),
    message: z.string().nullable(),
})



export type Product = z.infer<typeof ProductSchema>
export type ProductApiResponse = z.infer<typeof ProductApiResponseSchema>


