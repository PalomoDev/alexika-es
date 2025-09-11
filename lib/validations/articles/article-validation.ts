import { z } from "zod";
import {uuidSchema} from "@/lib/validations/base";
import {images} from "next/dist/build/webpack/config/blocks/images";

// Схема для создания статьи
export const CreateArticleSchema = z.object({
    title: z.string().min(1, "El título es obligatorio").max(200, "El título no puede superar los 200 caracteres"),
    subtitle: z.string().min(1, "El subtítulo es obligatorio").max(300, "El subtítulo no puede superar los 300 caracteres"),
    slug: z.string().min(1, "El slug es obligatorio").regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones"),
    content:z.string().min(1, "El contenido es obligatorio"),
    excerpt: z.string().min(1, "El resumen es obligatorio").max(500, "El resumen no puede superar los 500 caracteres"),
    isPublished: z.boolean().optional(),
    imageFolder: z.string().optional(),
    seoTitle: z.string().max(60, "El título SEO no puede superar los 60 caracteres").optional(),
    seoDescription: z.string().max(160, "La descripción SEO no puede superar los 160 caracteres").optional(),
    category: z.string().optional(),
    isFeatured: z.boolean().optional(),

});

export const CreateArticleFormSchema = z.object({
    title: z.string().min(1, "El título es obligatorio").max(200, "El título no puede superar los 200 caracteres"),
    subtitle: z.string().min(1, "El subtítulo es obligatorio").max(300, "El subtítulo no puede superar los 300 caracteres"),
    slug: z.string().min(1, "El slug es obligatorio").regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones"),
    excerpt: z.string().min(1, "El resumen es obligatorio").max(500, "El resumen no puede superar los 500 caracteres"),
    content: z.instanceof(File).optional(),
    images: z.array(z.instanceof(File)).optional(),


    // Campos simplificados
    category: z.string().optional(),



    isFeatured: z.boolean().optional(),
    isPublished: z.boolean().optional(),


});

// Esquema para actualizar artículo
export const UpdateArticleSchema = CreateArticleSchema.partial().extend({
    id: uuidSchema,
});

// Tipos TypeScript
export type CreateArticle = z.infer<typeof CreateArticleSchema>;
export type CreateArticleForm = z.infer<typeof CreateArticleFormSchema>;
export type UpdateArticle = z.infer<typeof UpdateArticleSchema>;

export const ArticleFromDBSchema = z.object({
    id: uuidSchema,
    title: z.string(),
    subtitle: z.string(),
    slug: z.string(),
    content: z.string(),
    excerpt: z.string(),
    isPublished: z.boolean(),
    imageFolder: z.string().nullable(),
    coverImage: z.string().nullable(),

    // SEO поля
    seoTitle: z.string().nullable(),
    seoDescription: z.string().nullable(),

    // Упрощенные связи
    category: z.string().nullable(),
    author: z.string().nullable(),

    // Метаданные
    tags: z.array(z.string()),
    readTime: z.number().nullable(),
    viewCount: z.number().nullable(),
    isFeatured: z.boolean().nullable(),

    // Временные метки
    publishedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Схема для публичного API (без служебных полей)
export const ArticlePublicSchema = ArticleFromDBSchema.omit({
    createdAt: true,
    updatedAt: true,
});

// Схема для списка статей (краткая информация)
export const ArticleListItemSchema = ArticleFromDBSchema.pick({
    id: true,
    title: true,
    subtitle: true,
    slug: true,
    excerpt: true,
    category: true,
    isFeatured: true,
    publishedAt: true,
    imageFolder: true,
    coverImage: true,
});

// Типы TypeScript
export type ArticleFromDB = z.infer<typeof ArticleFromDBSchema>;
export type ArticlePublic = z.infer<typeof ArticlePublicSchema>;
export type ArticleListItem = z.infer<typeof ArticleListItemSchema>;