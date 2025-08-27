// app/admin/products/edit/[id]/_page.tsx

import { notFound } from "next/navigation";
import { getProductById } from "@/lib/actions/product/product.action";
import { getCategories } from "@/lib/actions/catalog/category.action";
import { getBrands } from "@/lib/actions/catalog/brand.action";
import { getSubcategories } from "@/lib/actions/catalog/subcategory.action";
import { getFeatures } from "@/lib/actions/catalog/feature.action";
import { getSpecificationsByCategory } from "@/lib/actions/catalog/specification.action";
import ProductEditForm from "@/components/admin/forms/product-edit-form";
import {ProductEditData} from "@/types/productos.type";

type FormData = {
    categories: Array<{ id: string; name: string; isActive: boolean; slug: string }>;
    brands: Array<{ id: string; name: string; isActive: boolean }>;
    subcategories: Array<{ id: string; name: string; isActive: boolean }>;
    features: Array<{ id: string; name: string; isActive: boolean }>;
    specifications: Array<{
        id: string;
        name: string;
        key: string;
        type: "number" | "text";
        unit: string | null;
        isRequired: boolean | null;
        sortOrder: number;
    }>;
};

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;

    // Получаем продукт
    const productResponse = await getProductById(id);

    if (!productResponse.success || !productResponse.data) {
        notFound();
    }


    const product:ProductEditData = productResponse.data;

    // Получаем все справочники параллельно
    const [categoriesResponse, brandsResponse, subcategoriesResponse, featuresResponse, specificationsResponse] = await Promise.all([
        getCategories(),
        getBrands(),
        getSubcategories(),
        getFeatures(),
        getSpecificationsByCategory(product.category.slug) // используем slug категории продукта
    ]);

    if (!categoriesResponse.success || !brandsResponse.success || !subcategoriesResponse.success ||
        !featuresResponse.success || !specificationsResponse.success) {
        console.error('Failed to load data for product edit form');
        notFound();
    }

    const formData: FormData = {
        categories: categoriesResponse.data?.filter(cat => cat.isActive).map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            isActive: cat.isActive
        })) || [],

        brands: brandsResponse.data?.filter(brand => brand.isActive).map(brand => ({
            id: brand.id,
            name: brand.name,
            isActive: brand.isActive
        })) || [],

        subcategories: subcategoriesResponse.data?.filter(sub =>
            sub.isActive &&
            sub.categorySubcategories?.some(cs => cs.category.id === product.categoryId)
        ).map(sub => ({
            id: sub.id,
            name: sub.name,
            isActive: sub.isActive
        })) || [],

        features: featuresResponse.data?.filter(feature =>
            feature.isActive &&
            feature.categoryId === product.categoryId
        ).map(feature => ({
            id: feature.id,
            name: feature.name,
            isActive: feature.isActive
        })) || [],

        specifications: specificationsResponse.data?.map(spec => ({
            id: spec.id,
            name: spec.name,
            type: spec.type,
            unit: spec.unit,
            key: spec.key,
            isRequired: false,
            sortOrder: spec.sortOrder,
        })) || []
    };

    return (
        <div className="wrapper">
            <div className="py-6">
                <ProductEditForm
                    product={product}
                    categories={formData.categories}
                    brands={formData.brands}
                    subcategories={formData.subcategories}
                    features={formData.features}
                    specifications={formData.specifications}
                />
            </div>
        </div>
    );
}