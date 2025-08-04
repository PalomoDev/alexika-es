// lib/validations/product/specification-validation.ts

import { z } from "zod";
import { imageBaseSchema, specificationBaseSchema } from "./base";
import { uuidSchema } from "@/lib/validations/base";
import { specificationFullSchema } from "@/lib/validations/product/full";


// Схема для изображения спецификации
export const SpecificationImage = imageBaseSchema.omit({
  createdAt: true,
  isDeleted: true,
  deletedAt: true,
  updatedAt: true,
  filename: true,
});

// Схема для полного ответа спецификации в админке (выводим из полной схемы)
export const specificationFullResponseSchema = specificationFullSchema
  .extend({
    images: z.array(SpecificationImage),
    _count: z.object({
      productSpecifications: z.number().int().min(0),
      categorySpecs: z.number().int().min(0),
    }),
  })
  .omit({
    imageIds: true,
    productSpecifications: true, // Убираем полные данные продуктов для админки
  });

export const specificationResponseForProducts = specificationFullSchema.omit({
    imageIds: true,
    productSpecifications: true,
})

export const createSpecificationSchema = specificationBaseSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    categoryIds: z
      .array(uuidSchema)
      .min(1, "At least one category must be selected"),
  });

// Схема для редактирования спецификации (выводим из базовой)
export const updateSpecificationSchema = specificationBaseSchema
  .partial()
  .omit({
    createdAt: true,
    updatedAt: true,
  }).extend({
        categoryIds: z
            .array(uuidSchema)
            .min(1, "At least one category must be selected"),
    });

// Схема для удаления спецификации (выводим из базовой)
export const deleteSpecificationSchema = specificationBaseSchema.pick({
  id: true,
});

// Схема для пользовательского фильтра (выводим из базовой)
export const specificationFilterSchema = specificationBaseSchema
  .pick({
    id: true,
    name: true,
    key: true,
    type: true,
    unit: true,
    category: true,
    isActive: true,
  })
  .extend({
    _count: z.object({
      productSpecifications: z.number().int().min(0),
      categorySpecs: z.number().int().min(0),
    }),
  });

// Типы
export type SpecificationFullResponse = z.infer<typeof specificationFullResponseSchema>;
export type SpecificationResponseForProducts = z.infer<typeof specificationResponseForProducts>;
export type SpecificationCreate = z.infer<typeof createSpecificationSchema>;
export type SpecificationUpdate = z.infer<typeof updateSpecificationSchema>;
export type SpecificationDelete = z.infer<typeof deleteSpecificationSchema>;
export type SpecificationFilter = z.infer<typeof specificationFilterSchema>;
export type SpecificationImage = z.infer<typeof SpecificationImage>;
