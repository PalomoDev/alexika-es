import { CatalogTabs } from "@/components/admin/CatalogTabs";
import {getBrands} from "@/lib/actions/catalog/brand.action";
import {getCategories} from "@/lib/actions/catalog/category.action";
import LoadingSpinner from "@/components/LoadingSpinner";
import {getSubcategories} from "@/lib/actions/catalog/subcategory.action";

interface CatalogPageProps {
    searchParams: Promise<{ tab?: string }>;
}

const CatalogPage = async ({ searchParams }: CatalogPageProps) => {
    const { tab } = await searchParams;
    const activeTab = tab || 'brands';

    const results = await Promise.all([getBrands(), getCategories(), getSubcategories()]);
    const allSuccess = results.every(result => result.success && result.data);
    const [brands, categories, subcategories] = results;
    const data = {
        brands: brands.data!,
        categories: categories.data!,
        subcategories: subcategories.data!
    };

    return (
        <div className="wrapper">
            <div className="py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Gestión de catálogo</h1>
                    <p className="text-muted-foreground">
                        Gestión de marcas, categorías y características de productos
                    </p>
                </div>

                {!allSuccess ? (
                    <LoadingSpinner text="Loading catalog data..." />
                ) : (
                    <CatalogTabs activeTab={activeTab} data={data} />
                )}
            </div>
        </div>
    );
};

export default CatalogPage;