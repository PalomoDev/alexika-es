// lib/validations/product/feature-validation.ts - полная обновленная валидация
import { z } from "zod";
import { featureBaseSchema, imageBaseSchema, categoryBaseSchema } from "./base";

// Схема для изображения особенности
export const FeatureImage = imageBaseSchema.omit({
    createdAt: true,
    isDeleted: true,
    deletedAt: true,
    updatedAt: true,
    filename: true,
});

// Схема для полного ответа особенности в админке
export const featureFullResponseSchema = featureBaseSchema.extend({
    images: z.array(FeatureImage),
    category: categoryBaseSchema.pick({
        id: true,
        name: true,
        slug: true,
    }).nullable(), // Добавляем информацию о категории
}).omit({
    imageIds: true,
});

// Схема для создания особенности
export const createFeatureSchema = featureBaseSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

// Схема для редактирования особенности
export const updateFeatureSchema = featureBaseSchema.partial().omit({
    createdAt: true,
    updatedAt: true,
});

// Схема для удаления особенности
export const deleteFeatureSchema = featureBaseSchema.pick({
    id: true,
});

// Типы
export type FeatureFullResponse = z.infer<typeof featureFullResponseSchema>;
export type FeatureCreate = z.infer<typeof createFeatureSchema>;
export type FeatureUpdate = z.infer<typeof updateFeatureSchema>;
export type FeatureDelete = z.infer<typeof deleteFeatureSchema>;
export type FeatureImage = z.infer<typeof FeatureImage>;