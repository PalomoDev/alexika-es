'use server'

import prisma from "@/lib/prisma";
import { formatError } from "@/lib/utils"
import { revalidatePath } from "next/cache"

import {
    ProductCreate,
    productCreateSchema,
    ProductUpdate,
    productUpdateSchema
} from '@/lib/validations/product/product-validation'
import {ProductEditData, ProductTableItem} from "@/types/productos.type";



type ActionResponse<T = undefined> = {
    success: boolean;
    data: T | null;
    message?: string;
};

export async function productCreate({data}: {data: ProductCreate}): Promise<ActionResponse<string>> {
    try {
        const validatedData = productCreateSchema.parse(data);
        console.log(validatedData);

        // Проверяем уникальность slug
        const existingProduct = await prisma.product.findUnique({
            where: { slug: validatedData.slug }
        });

        if (existingProduct) {
            return {
                success: false,
                data: null,
                message: `Product with this slug already exists`
            };
        }

        // Создаем продукт с связями
        const newProduct = await prisma.product.create({
            data: {
                name: validatedData.name,
                slug: validatedData.slug,
                sku: validatedData.sku,
                categoryId: validatedData.categoryId,
                brandId: validatedData.brandId,
                imageIds: validatedData.imageIds,
                description: validatedData.description,
                stock: validatedData.stock,
                price: validatedData.price,
                isFeatured: validatedData.isFeatured,
                isActive: validatedData.isActive,
                // Создаем связи с подкатегориями
                productSubcategories: {
                    create: validatedData.subcategoryIds.map(subcategoryId => ({
                        subcategoryId
                    }))
                },
                // Создаем связи с особенностями
                features: {
                    create: validatedData.featureIds.map(featureId => ({
                        featureId
                    }))
                },
                // Создаем значения спецификаций
                specificationValues: {
                    create: validatedData.specificationValues.map(spec => ({
                        specificationId: spec.specificationId,
                        value: spec.value
                    }))
                }
            }
        });

        revalidatePath('/admin/products');
        return {
            success: true,
            data: newProduct.id,
            message: 'Product created successfully'
        };

    } catch (error) {
        return {
            success: false,
            data: null,
            message: formatError(error)
        };
    }
}

export async function getAllProducts(): Promise<ActionResponse<ProductTableItem[]>> {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: {
                    select: { id: true, name: true }
                },
                brand: {
                    select: { id: true, name: true }
                },
                productSubcategories: {
                    include: {
                        subcategory: {
                            select: { id: true, name: true }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Получаем только первое изображение для каждого продукта
        const productsWithImage = await Promise.all(
            products.map(async (product) => {
                const firstImage = product.imageIds.length > 0
                    ? await prisma.image.findFirst({
                        where: {
                            id: product.imageIds[0],
                            isDeleted: false
                        },
                        select: { url: true, alt: true }
                    })
                    : null;

                return {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    sku: product.sku,
                    price: Number(product.price),
                    stock: product.stock,
                    isActive: product.isActive,
                    isFeatured: product.isFeatured,
                    category: product.category,
                    brand: product.brand,
                    subcategories: product.productSubcategories.map(ps => ps.subcategory),
                    image: firstImage,
                    createdAt: product.createdAt
                };
            })
        );

        return {
            success: true,
            data: productsWithImage,
            message: 'Products retrieved successfully'
        };

    } catch (error) {
        return {
            success: false,
            data: null,
            message: formatError(error)
        };
    }
}

export async function getProductById(id: string): Promise<ActionResponse<ProductEditData>> {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: {
                    select: { id: true, name: true, slug: true }
                },
                brand: {
                    select: { id: true, name: true, slug: true }
                },
                productSubcategories: {
                    include: {
                        subcategory: {
                            select: { id: true, name: true, slug: true }
                        }
                    }
                },
                features: {
                    include: {
                        feature: {
                            select: { id: true, name: true, key: true }
                        }
                    }
                },
                specificationValues: {
                    include: {
                        specification: {
                            select: { id: true, name: true, key: true, type: true, unit: true }
                        }
                    }
                }
            }
        });

        if (!product) {
            return {
                success: false,
                data: null,
                message: 'Product not found'
            };
        }

        // Получаем изображения
        const images = product.imageIds.length > 0
            ? await prisma.image.findMany({
                where: {
                    id: { in: product.imageIds },
                    isDeleted: false
                },
                select: { id: true, url: true, alt: true, sortOrder: true },
                orderBy: { sortOrder: 'asc' }
            })
            : [];

        // Формируем данные для редактирования
        const productEditData: ProductEditData = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            categoryId: product.categoryId,
            brandId: product.brandId,
            imageIds: product.imageIds,
            images: images,
            description: product.description,
            stock: product.stock,
            price: Number(product.price),
            isFeatured: product.isFeatured,
            isActive: product.isActive,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            // Связи
            category: product.category,
            brand: product.brand,
            subcategoryIds: product.productSubcategories.map(ps => ps.subcategoryId),
            subcategories: product.productSubcategories.map(ps => ps.subcategory),
            featureIds: product.features.map(pf => pf.featureId),
            features: product.features.map(pf => pf.feature),
            specificationValues: product.specificationValues.map(sv => ({
                specificationId: sv.specificationId,
                value: sv.value,
                specification: sv.specification
            }))
        };

        return {
            success: true,
            data: productEditData,
            message: 'Product retrieved successfully'
        };

    } catch (error) {
        return {
            success: false,
            data: null,
            message: formatError(error)
        };
    }
}



export async function productUpdate(data: ProductUpdate): Promise<ActionResponse<string>> {
    try {
        const validatedData = productUpdateSchema.parse(data);

        // Проверяем уникальность slug (исключая текущий продукт)
        const existingProduct = await prisma.product.findFirst({
            where: {
                slug: validatedData.slug,
                NOT: { id: validatedData.id }
            }
        });

        if (existingProduct) {
            return {
                success: false,
                data: null,
                message: 'Product with this slug already exists'
            };
        }

        // Обновляем продукт с пересозданием связей
        const updatedProduct = await prisma.product.update({
            where: { id: validatedData.id },
            data: {
                name: validatedData.name,
                slug: validatedData.slug,
                sku: validatedData.sku,
                brandId: validatedData.brandId,
                imageIds: validatedData.imageIds,
                description: validatedData.description,
                stock: validatedData.stock,
                price: validatedData.price,
                isFeatured: validatedData.isFeatured,
                isActive: validatedData.isActive,

                // Пересоздаем связи с подкатегориями
                productSubcategories: {
                    deleteMany: {}, // Удаляем старые
                    create: validatedData.subcategoryIds.map(subcategoryId => ({
                        subcategoryId
                    }))
                },

                // Пересоздаем связи с особенностями
                features: {
                    deleteMany: {}, // Удаляем старые
                    create: validatedData.featureIds.map(featureId => ({
                        featureId
                    }))
                },

                // Пересоздаем значения спецификаций
                specificationValues: {
                    deleteMany: {}, // Удаляем старые
                    create: validatedData.specificationValues.map(spec => ({
                        specificationId: spec.specificationId,
                        value: spec.value
                    }))
                }
            }
        });

        revalidatePath('/admin/products');
        return {
            success: true,
            data: updatedProduct.id,
            message: 'Product updated successfully'
        };

    } catch (error) {
        return {
            success: false,
            data: null,
            message: formatError(error)
        };
    }
}

export async function productDelete(id: string): Promise<ActionResponse<string>> {
    try {
        // Проверяем существование продукта
        const existingProduct = await prisma.product.findUnique({
            where: { id },
            include: {
                OrderItem: true, // Проверяем есть ли заказы с этим продуктом
                Review: true     // Проверяем есть ли отзывы
            }
        });

        if (!existingProduct) {
            return {
                success: false,
                data: null,
                message: 'Product not found'
            };
        }

        // Проверяем можно ли удалить (есть ли связанные заказы)
        if (existingProduct.OrderItem.length > 0) {
            return {
                success: false,
                data: null,
                message: 'Cannot delete product: it has associated orders'
            };
        }

        // Удаляем продукт (каскадные удаления сработают автоматически)
        await prisma.product.delete({
            where: { id }
        });

        revalidatePath('/admin/products');
        return {
            success: true,
            data: id,
            message: 'Product deleted successfully'
        };

    } catch (error) {
        return {
            success: false,
            data: null,
            message: formatError(error)
        };
    }
}