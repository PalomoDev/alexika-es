import { SpecificationCreateForm, FeatureCreateForm, SubcategoryCreateForm, CategoryCreateForm, BrandCreateForm } from "@/components/admin/forms/index";
import {getCategories} from "@/lib/actions/catalog/category.action";

export default async function ProductPage({
                                              params,
                                          }: {
    params: Promise<{ slug: string }>;
}) {
    const {slug} = await params;
    const categories = await getCategories();
    let content;

    switch (slug) {
        case 'marca':
            content = <BrandCreateForm/>
            break;
        case 'categoria':
            content = <CategoryCreateForm/>
            break;
        case 'subcategory':

            content = <SubcategoryCreateForm categories={categories?.data || []}/>
            break;
        case 'features':
            content = <FeatureCreateForm categories={categories?.data || []}/>
            break;
        case 'specifications':

            content = <SpecificationCreateForm  categories={categories?.data || []}/>
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