"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandsTable, CategoriesTable, SubcategoriesTable } from '@/components/admin/tables'
import {BrandFullResponse} from "@/lib/validations/product/brand";
import {CategoryFullResponse} from "@/lib/validations/product/category-validation";
import {SubcategoryFullResponse} from "@/lib/validations/product/subcategory-validation";


const CreateButton = ({ name, tabValue }: { name: string; tabValue: string }) => {
    return (
        <Link href={`/admin/catalog/create/${name}?returnTab=${tabValue}`}>
            <Button>
                <Plus className="w-4 h-4 mr-2" />
                {`Crear ${name}`}
            </Button>
        </Link>
    );
};


const SpecificationsTable = () => (
    <div className="border rounded-lg p-4">
        <p className="text-muted-foreground">Tabla de especificaciones</p>
    </div>
);

const FeaturesTable = () => (
    <div className="border rounded-lg p-4">
        <p className="text-muted-foreground">Tabla de características</p>
    </div>
);

interface CatalogTabsProps {
    activeTab: string;
    data: {
        brands: BrandFullResponse[]
        categories: CategoryFullResponse[]
        subcategories: SubcategoryFullResponse[]
    }
}

export const CatalogTabs = ({ activeTab, data }: CatalogTabsProps) => {
    const router = useRouter();

    const handleTabChange = (value: string) => {
        router.push(`/admin/catalog?tab=${value}`);
    };

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="brands">Marcas</TabsTrigger>
                <TabsTrigger value="categories">Categorías</TabsTrigger>
                <TabsTrigger value="subcategories">Subcategorías</TabsTrigger>
                <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
                <TabsTrigger value="features">Características</TabsTrigger>
            </TabsList>

            <TabsContent value="brands" className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold">Marcas</h2>
                        <p className="text-muted-foreground">Gestión de marcas de productos</p>
                    </div>
                    <CreateButton name="marca" tabValue="brands" />
                </div>
                <BrandsTable data={data.brands}/>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold">Categorías</h2>
                        <p className="text-muted-foreground">Gestión de categorías de productos</p>
                    </div>
                    <CreateButton name="categoria" tabValue="categories" />
                </div>
                <CategoriesTable data={data.categories}/>
            </TabsContent>

            <TabsContent value="subcategories" className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold">Subcategorías</h2>
                        <p className="text-muted-foreground">Gestión de subcategorías de productos</p>
                    </div>
                    <CreateButton name="subcategory" tabValue="subcategories" />
                </div>
                <SubcategoriesTable data={data.subcategories}/>
            </TabsContent>

            <TabsContent value="specifications" className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold">Especificaciones</h2>
                        <p className="text-muted-foreground">Gestión de características de productos</p>
                    </div>
                    <CreateButton name="specifications" tabValue="specifications" />
                </div>
                <SpecificationsTable />
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold">Características</h2>
                        <p className="text-muted-foreground">Gestión de características especiales de productos</p>
                    </div>
                    <CreateButton name="features" tabValue="features" />
                </div>
                <FeaturesTable />
            </TabsContent>
        </Tabs>
    );
};