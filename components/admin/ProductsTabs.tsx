"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductTable from '@/components/admin/tables/products-table';
import {CategoryFullResponse} from "@/lib/validations/product/category-validation";
import {ProductTableItem} from "@/types/productos.type";

interface CatalogTabsProps {
    activeTab: string;
    data: {
        categories: CategoryFullResponse[]
        products: ProductTableItem[]
    }
}

export const ProductsTabs = ({ activeTab, data }: CatalogTabsProps) => {
    const router = useRouter();

    const handleTabChange = (value: string) => {
        router.push(`/admin/products?tab=${value}`);
    };

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className={`grid w-full grid-cols-${data.categories.length}`}>
                {data.categories
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((category) => (
                        <TabsTrigger key={category.id} value={category.slug}>
                            {category.name}
                        </TabsTrigger>
                    ))}
            </TabsList>

            {data.categories.map((category) => {
                const categoryProducts = data.products.filter(p => p.category.id === category.id);

                return (
                    <TabsContent key={category.id} value={category.slug}>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">
                                    {category.name} ({categoryProducts.length} productos)
                                </h3>
                                <Link href={`/admin/products/create?category=${category.slug}&returnTab=${category.slug}`}>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Crear producto
                                    </Button>
                                </Link>
                            </div>

                            <ProductTable
                                data={categoryProducts}
                                hideCategory={true}
                            />
                        </div>
                    </TabsContent>
                );
            })}
        </Tabs>
    );
};