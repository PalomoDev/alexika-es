import { CatalogTabs } from "@/components/admin/CatalogTabs";
import {getBrands} from "@/lib/actions/catalog/brand.action";
import {getCategories} from "@/lib/actions/catalog/category.action";
import LoadingSpinner from "@/components/LoadingSpinner";
import {getSubcategories} from "@/lib/actions/catalog/subcategory.action";
import {getFeatures} from "@/lib/actions/catalog/feature.action";
import {getSpecifications} from "@/lib/actions/catalog/specification.action";
import { Card, CardContent } from "@/components/ui/card";

interface CatalogPageProps {
    searchParams: Promise<{ tab?: string }>;
}

const CatalogPage = async ({ searchParams }: CatalogPageProps) => {
    const { tab } = await searchParams;
    const activeTab = tab || 'brands';

    const results = await Promise.all([getBrands(), getCategories(), getSubcategories(), getFeatures(), getSpecifications()]);
    const allSuccess = results.every(result => result.success && result.data);
    const [brands, categories, subcategories, features, specifications] = results;
    const data = {
        brands: brands.data!,
        categories: categories.data!,
        subcategories: subcategories.data!,
        features: features.data!,
        specifications: specifications.data!
    };

    return (
        <div className="wrapper">
            <div className="py-6">
                <div className="mb-6 pl-2">
                    <h1 className="text-3xl font-bold">Gestión de catálogo</h1>
                    <p className="text-muted-foreground">
                        Gestión de marcas, categorías y características de productos
                    </p>
                </div>

                {!allSuccess ? (
                    <LoadingSpinner text="Loading catalog data..." />
                ) : (
                    <>
                        {/* Сводка данных */}
                        <Card className="mb-12">
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                                    {[
                                        { label: 'Brands', count: data.brands.length },
                                        { label: 'Categories', count: data.categories.length },
                                        { label: 'Subcategories', count: data.subcategories.length },
                                        { label: 'Features', count: data.features.length },
                                        { label: 'Specifications', count: data.specifications.length },
                                    ].map((item) => (
                                        <div key={item.label} className="space-y-2">
                                            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                                            <span className="text-2xl font-bold">{item.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <CatalogTabs activeTab={activeTab} data={data} />
                    </>
                )}
            </div>
        </div>
    );
};

export default CatalogPage;