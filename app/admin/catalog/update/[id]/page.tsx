import { getBrandById } from "@/lib/actions/catalog/brand.action";
import {getCategories, getCategoryById} from "@/lib/actions/catalog/category.action";
import { getSubcategoryById } from "@/lib/actions/catalog/subcategory.action";
import {EditBrandForm, EditCategoryForm, EditSubcategoryForm, EditFeatureForm} from "@/components/admin/forms/index";


import ErrorComponent from "@/components/admin/ErrorComponent";
import { getFeatureById } from "@/lib/actions/catalog/feature.action";
import {getSpecificationById} from "@/lib/actions/catalog/specification.action";
import EditSpecificationForm from "@/components/admin/forms/specification-edit-form";


interface EditCatalogPageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ type?: string }>;
}

export default async function EditCatalogPage({ params, searchParams }: EditCatalogPageProps) {
    const { id } = await params;
    const { type } = await searchParams;

    let content;

    switch (type) {
        case 'brand': {
            const response = await getBrandById(id);
            if (!response.success || !response.data) {
                content = <ErrorComponent message={response.message} />;
            } else {
                content = <EditBrandForm data={response.data} />;
            }
            break;
        }

        case 'category': {
            const response = await getCategoryById(id);
            if (!response.success || !response.data) {
                content = <ErrorComponent message={response.message} />;
            } else {
                content = <EditCategoryForm data={response.data} />;
            }
            break;
        }
        case 'subcategory': {
            const [subcategoryResponse, categoriesResponse] = await Promise.all([
                getSubcategoryById(id),
                getCategories()
            ]);

            if (!subcategoryResponse.success || !subcategoryResponse.data ||
                !categoriesResponse.success || !categoriesResponse.data) {
                const errorMessage = subcategoryResponse.message || categoriesResponse.message || 'Failed to load data';
                content = <ErrorComponent message={errorMessage} />;
            } else {
                content = <EditSubcategoryForm
                    data={subcategoryResponse.data}
                    categories={categoriesResponse.data}
                />;
            }
            break
        }
        case 'feature': {
            const [feature, categories] = await Promise.all([
                getFeatureById(id),
                getCategories()
            ]);

            if (!feature.success || !feature.data || !categories.success || !categories.data) {
                const errorMessage = feature.message || categories.message || 'Failed to load data';
                content = <ErrorComponent message={errorMessage} />;
                break;
            }

            content = <EditFeatureForm data={feature.data} categories={categories.data} />;
            break;
        }

        case 'specification': {
            const [specificationResponse, categoriesResponse] = await Promise.all([
                getSpecificationById(id),
                getCategories()
            ]);
            if (!specificationResponse.success || !specificationResponse.data ||
                !categoriesResponse.success || !categoriesResponse.data) {
                const errorMessage = specificationResponse.message || categoriesResponse.message || 'Failed to load data';
                content = <ErrorComponent message={errorMessage} />;
            } else {
                content = <EditSpecificationForm data={specificationResponse.data} categories={categoriesResponse.data}/>;
            }
            break;
        }

        default:
            content = <div>Invalid catalog type: {type}</div>;
    }

    return (
        <div className="wrapper">
            {content}
        </div>
    );
}