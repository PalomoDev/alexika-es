import CreateBrandForm from "@/components/admin/forms/brand-create-form";
import CategoryCreateForm from "@/components/admin/forms/category-create-form";
import SubcategoryCreateForm from "@/components/admin/forms/subcategory-create-form";
import {getCategories} from "@/lib/actions/catalog/category.action";

export default async function ProductPage({
                                              params,
                                          }: {
    params: Promise<{ slug: string }>;
}) {
    const {slug} = await params;

    let content;

    switch (slug) {
        case 'marca':
            content = <CreateBrandForm/>
            break;
        case 'categoria':
            content = <CategoryCreateForm/>
            break;
        case 'subcategory':
            const categories = await getCategories();
            content = <SubcategoryCreateForm categories={categories?.data || []}/>
            break;
        default:
            return <div>404</div>
    }

    return (
        <div className="wrapper">
            <h1>Create {slug}</h1>
            {content}
        </div>
    );

}

// router.push('/admin/catalog?tab=brands');categories subcategories