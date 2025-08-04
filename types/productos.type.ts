export type ProductTableItem = {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    stock: number;
    isActive: boolean;
    isFeatured: boolean;
    category: {
        id: string;
        name: string;
    };
    brand: {
        id: string;
        name: string;
    };
    subcategories: Array<{
        id: string;
        name: string;
    }>;
    image: {
        url: string;
        alt: string | null;
    } | null;
    createdAt: Date;
};

// Типы для редактирования продукта
export type ProductEditData = {
    id: string;
    name: string;
    slug: string;
    sku: string;
    categoryId: string;
    brandId: string;
    imageIds: string[];
    images: Array<{ id: string; url: string; alt: string | null; sortOrder: number }>;
    description: string;
    stock: number;
    price: number;
    isFeatured: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    // Связи
    category: { id: string; name: string; slug: string };
    brand: { id: string; name: string; slug: string };
    subcategoryIds: string[];
    subcategories: Array<{ id: string; name: string; slug: string }>;
    featureIds: string[];
    features: Array<{ id: string; name: string; key: string }>;
    specificationValues: Array<{
        specificationId: string;
        value: string;
        specification: { id: string; name: string; key: string; type: string; unit: string | null };
    }>;
};