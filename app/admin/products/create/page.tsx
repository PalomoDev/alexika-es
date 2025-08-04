import ProductCreateForm from "@/components/admin/forms/product-create-form";
import {getCategories} from "@/lib/actions/catalog/category.action";
import {getBrands} from "@/lib/actions/catalog/brand.action";
import {getSubcategories} from "@/lib/actions/catalog/subcategory.action";
import {getFeatures} from "@/lib/actions/catalog/feature.action";
import {notFound} from "next/navigation";
import { getSpecificationsByCategory } from "@/lib/actions/catalog/specification.action";


type FormData = {
    categories: Array<{ id: string; name: string; isActive: boolean, slug: string }>;
    brands: Array<{ id: string; name: string; isActive: boolean }>;
    subcategories: Array<{ id: string; name: string; isActive: boolean }>;
    features: Array<{ id: string; name: string; isActive: boolean }>;
    specifications: Array<{ id: string; name: string;  type: "number" | "text"; unit: string | null; isRequired: boolean | null; sortOrder: number; key: string }>;
};

interface CreateProductPageProps {
    searchParams: Promise<{ category?: string; returnTab?: string }>; // Убрал params
}

export default async function CreateProductPage({ searchParams }: CreateProductPageProps) {
    const { category, returnTab } = await searchParams;

    if (!category || !returnTab) {
        notFound();
    }

    const [categoriesResponse, brandsResponse, subcategoriesResponse, featuresResponse, specificationsResponse] = await Promise.all([
        getCategories(),
        getBrands(),
        getSubcategories(),
        getFeatures(),
        getSpecificationsByCategory(category)
    ]);

    if (!categoriesResponse.success || !brandsResponse.success || !subcategoriesResponse.success || !featuresResponse.success || !specificationsResponse.success) {
        console.error('Failed to load data for product form');
    }

    // Ищем категорию по slug (не по id)
    const selectedCategory = categoriesResponse.data?.find(cat => cat.slug === category);

    if (!selectedCategory) {
        notFound();
    }



    const formData: FormData = {
        categories: [{
            id: selectedCategory.id,
            name: selectedCategory.name,
            slug: selectedCategory.slug,
            isActive: selectedCategory.isActive
        }],

        brands: brandsResponse.data?.filter(brand => brand.isActive).map(brand => ({
            id: brand.id,
            name: brand.name,
            isActive: brand.isActive
        })) || [],

        subcategories: subcategoriesResponse.data?.filter(sub =>
            sub.isActive &&
            sub.categorySubcategories?.some(cs => cs.category.id === selectedCategory.id)
        ).map(sub => ({
            id: sub.id,
            name: sub.name,
            isActive: sub.isActive
        })) || [],

        features: featuresResponse.data?.filter(feature =>
            feature.isActive &&
            feature.categoryId === selectedCategory.id  // убираем || feature.categoryId === null
        ).map(feature => ({
            id: feature.id,
            name: feature.name,
            isActive: feature.isActive
        })) || [],

        specifications: specificationsResponse.data?.map(spec => ({
            id: spec.id,
            name: spec.name,
            key: spec.key,
            type: spec.type,
            unit: spec.unit,
            isRequired: false,
            sortOrder: spec.sortOrder,
        })) || []
    };



    return (
        <div className="wrapper">
            <div className="py-6">
                <ProductCreateForm
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