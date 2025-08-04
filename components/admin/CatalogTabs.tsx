"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandsTable, CategoriesTable, SubcategoriesTable, FeaturesTable, SpecificationsTable } from '@/components/admin/tables'
import {BrandFullResponse} from "@/lib/validations/product/brand";
import {CategoryFullResponse} from "@/lib/validations/product/category-validation";
import {SubcategoryFullResponse} from "@/lib/validations/product/subcategory-validation";
import {FeatureFullResponse} from "@/lib/validations/product/feature-validation";
import {SpecificationFullResponse} from "@/lib/validations/product/specification-validation";


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

interface CatalogTabsProps {
    activeTab: string;
    data: {
        brands: BrandFullResponse[]
        categories: CategoryFullResponse[]
        subcategories: SubcategoryFullResponse[]
        features: FeatureFullResponse[]
        specifications: SpecificationFullResponse[]
    }
}

export const CatalogTabs = ({ activeTab, data }: CatalogTabsProps) => {
    const router = useRouter();

    const handleTabChange = (value: string) => {
        router.push(`/admin/catalog?tab=${value}`);
    };

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="brands">Marcas</TabsTrigger>
                <TabsTrigger value="categories">Categorías</TabsTrigger>
                <TabsTrigger value="subcategories">Subcategorías</TabsTrigger>
                <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
                <TabsTrigger value="features">Características</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            {[
                {
                    value: "brands",
                    title: "Marcas",
                    description: "Gestión de marcas de productos",
                    createName: "marca",
                    isCreated: true,
                    component: <BrandsTable data={data.brands} />
                },
                {
                    value: "categories",
                    title: "Categorías",
                    description: "Gestión de categorías de productos",
                    isCreated: true,
                    createName: "categoria",
                    component: <CategoriesTable data={data.categories} />
                },
                {
                    value: "subcategories",
                    title: "Subcategorías",
                    description: "Gestión de subcategorías de productos",
                    isCreated: true,
                    createName: "subcategory",
                    component: <SubcategoriesTable data={data.subcategories} />
                },
                {
                    value: "specifications",
                    title: "Especificaciones",
                    description: "Gestión de características de productos",
                    isCreated: true,
                    createName: "specifications",
                    component: <SpecificationsTable data={data.specifications} />
                },
                {
                    value: "features",
                    title: "Características",
                    description: "Gestión de características especiales de productos",
                    isCreated: true,
                    createName: "features",
                    component: <FeaturesTable data={data.features} />
                },
                {
                    value: "images",
                    title: "Images",
                    description: "Gestión de images",
                    isCreated: false,
                    createName: "images",
                    component: <div>TODO</div>
                }
            ].map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className={'pl-4'}>
                            <h2 className="text-2xl font-semibold">{tab.title}</h2>
                            <p className="text-muted-foreground">{tab.description}</p>
                        </div>
                        { tab.isCreated && <CreateButton name={tab.createName} tabValue={tab.value} />}
                    </div>
                    {tab.component}
                </TabsContent>
            ))}
        </Tabs>
    );
};