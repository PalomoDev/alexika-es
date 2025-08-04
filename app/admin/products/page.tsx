
import {getAllProducts} from "@/lib/actions/product/product.action";
import {getCategories} from "@/lib/actions/catalog/category.action";
import LoadingSpinner from "@/components/LoadingSpinner";
import {Card, CardContent} from "@/components/ui/card";
import {ProductsTabs} from "@/components/admin/ProductsTabs";



interface ProductAdminPageProps {
    searchParams: Promise<{ tab?: string }>;
}


export default async function ProductAdminPage({ searchParams }: ProductAdminPageProps) {
    const { tab } = await searchParams;
    const activeTab = tab || 'tiendas-de-campana';

    const results = await Promise.all([getCategories(), getAllProducts()]);
    const allSuccess = results.every(result => result.success && result.data);
    const [categories, productos] = results;
    const data = {
        categories: categories.data!,
        products: productos.data!,
    };

    return (
      <div className="wrapper">
          <div className="py-6 flex flex-col gap-6">

                  <h1 className="text-3xl font-bold">Gestión de productos</h1>
                  {!allSuccess ? (
                      <LoadingSpinner text="Loading catalog data..." />
                  ) : (
                      <>
                          {/* Сводка данных */}
                          <Card className="mb-12">
                              <CardContent className="pt-6">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                      {/* Общая статистика */}
                                      <div className="text-center">
                                          <div className="text-2xl font-bold text-blue-600">{data.products.length}</div>
                                          <div className="text-sm text-muted-foreground">Total Products</div>
                                      </div>

                                      <div className="text-center">
                                          <div className="text-2xl font-bold text-green-600">{data.categories.length}</div>
                                          <div className="text-sm text-muted-foreground">Categories</div>
                                      </div>

                                      <div className="text-center">
                                          <div className="text-2xl font-bold text-orange-600">
                                              {data.products.filter(p => p.stock === 0).length}
                                          </div>
                                          <div className="text-sm text-muted-foreground">Out of Stock</div>
                                      </div>
                                  </div>

                                  {/* Продукты по категориям */}
                                  <div className="mt-6 pt-4 border-t">
                                      <h3 className="text-lg font-semibold mb-3">Products by Category</h3>
                                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                          {data.categories.map((category) => {
                                              const productCount = data.products.filter(p => p.category.id === category.id).length;
                                              return (
                                                  <div key={category.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                      <span className="text-sm font-medium">{category.name}</span>
                                                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                               {productCount}
                           </span>
                                                  </div>
                                              );
                                          })}
                                      </div>
                                  </div>
                              </CardContent>
                          </Card>

                          <ProductsTabs activeTab={activeTab} data={data}/>
                      </>
                  )}
              </div>


      </div>
  );
}