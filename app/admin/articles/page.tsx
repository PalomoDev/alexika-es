import { CatalogTabs } from "@/components/admin/CatalogTabs";
import {getBrands} from "@/lib/actions/catalog/brand.action";
import {getCategories} from "@/lib/actions/catalog/category.action";
import LoadingSpinner from "@/components/LoadingSpinner";
import {getSubcategories} from "@/lib/actions/catalog/subcategory.action";
import {getFeatures} from "@/lib/actions/catalog/feature.action";
import {getSpecifications} from "@/lib/actions/catalog/specification.action";
import { Card, CardContent } from "@/components/ui/card";
import ArticlesTable from "@/components/admin/tables/articles-table";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import Link from "next/link";
import {getAllArticles} from "@/lib/actions/articles/article-actions";



const ArticlesPage = async () => {

    const articlesGetResponse =  await getAllArticles()
    const allSuccess = articlesGetResponse.success && articlesGetResponse.data;
    console.log(articlesGetResponse.data)



    return (
        <div className="wrapper">
            <div className="py-6">
                <div className="mb-6 pl-2 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Gestión de artículos</h1>
                    <Link href={`/admin/articles/create`}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Crear article
                        </Button>
                    </Link>

                </div>

                {!allSuccess ? (
                    <LoadingSpinner text="Loading catalog data..." />
                ) : (
                    <>
                        <ArticlesTable data={articlesGetResponse.data || []} />
                    </>
                )}
            </div>
        </div>
    );
};

export default ArticlesPage;