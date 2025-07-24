// lib/validations/image.ts

import { z } from "zod";
import { imageBaseSchema } from "./base";
import { uuidSchema } from "@/lib/validations/base";

// Схема для создания изображения
export const createImageSchema = imageBaseSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    isDeleted: true,
    deletedAt: true,
});

export const createdImageResponse = imageBaseSchema.omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
})

export const imageUploaderResponseArraySchema = z.array(uuidSchema);

// Схема для обновления изображения (только alt и sortOrder)
export const updateImageSchema = z.object({
    id: uuidSchema,
    alt: z.string().nullable(),
    sortOrder: z.number().int().min(0),
});

// Схема для получения изображений по массиву ID
export const getImagesByIdsSchema = z.object({
    ids: z.array(uuidSchema).min(1, "At least one image ID is required"),
});

// Схема для удаления изображения
export const deleteImageSchema = z.object({
    id: uuidSchema,
});

// Схема для результата загрузки файла (из API)
export const uploadImageResponseSchema = imageBaseSchema;

// Схема для запроса загрузки изображения
export const uploadImageRequestSchema = z.object({
    prefix: z.string().min(1, "Prefix is required"),
    alt: z.string().nullable().default(null),
    sortOrder: z.number().int().min(0).default(0),
});

// Схема для получения неиспользуемых изображений
export const getUnusedImagesSchema = z.object({
    limit: z.number().int().min(1).max(100).default(50),
    offset: z.number().int().min(0).default(0),
});





// Типы для TypeScript
export type CreateImage = z.infer<typeof createImageSchema>;
export type UpdateImage = z.infer<typeof updateImageSchema>;
export type GetImagesByIds = z.infer<typeof getImagesByIdsSchema>;
export type DeleteImage = z.infer<typeof deleteImageSchema>;
export type UploadImageResponse = z.infer<typeof uploadImageResponseSchema>;
export type UploadImageRequest = z.infer<typeof uploadImageRequestSchema>;
export type GetUnusedImages = z.infer<typeof getUnusedImagesSchema>;
export type CreatedImageResponse = z.infer<typeof createdImageResponse>;
export type ImageUploaderResponseArray = z.infer<typeof imageUploaderResponseArraySchema>;
