import { getBrandById } from "@/lib/actions/catalog/brand.action";
import { getCategoryById } from "@/lib/actions/catalog/category.action";

// ... другие импорты

import EditBrandForm from "@/components/admin/forms/brand-edit-form";
import EditCategoryForm from "@/components/admin/forms/category-edit-form";

import ErrorComponent from "@/components/admin/ErrorComponent";
// ... другие формы

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

        // ... остальные случаи

        default:
            content = <div>Invalid catalog type: {type}</div>;
    }

    return (
        <div className="wrapper">
            {content}
        </div>
    );
}