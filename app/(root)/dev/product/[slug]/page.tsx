import { getProductBySlugForClient } from "@/lib/actions/product/product.client.action";
import { notFound } from "next/navigation";
import Breadcrumbs, {BreadcrumbItem} from "@/components/ui/breadcrumps";
import {ROUTES} from "@/lib/constants/routes";
import ProductImageGallery from "@/components/shared/products/ProductImageGallery";
import ProductInformation from "@/components/shared/products/ProductInformation";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const result = await getProductBySlugForClient(slug);

    if (!result.success || !result.data) {
        notFound();
    }

    const product = result.data;
    const acivity = product.specificationValues?.find(sv => sv.specification?.key === 'actividades')?.value || ''
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'EQUIPO', href: `${ROUTES.PAGES.PRODUCTS}` },
        { label: product.category?.name || '', href: `${ROUTES.PAGES.PRODUCTS}/${product.category?.slug}?category=${product.category?.slug}` },
        {label: acivity, href: `${ROUTES.PAGES.PRODUCTS}/actividades?subcategory=${acivity}`},
        { label: product.name }
    ];

    return (
        <div className="main-wrapper flex flex-col mt-10 px-4 ">
            <Breadcrumbs items={breadcrumbs} className={'pl-1'}/>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <ProductImageGallery product={product} />
                </div>

                <div className="lg:col-span-1">
                    <ProductInformation product={product} className={'md:min-h-[932px]'} />
                </div>
            </div>

            <div className="mt-12 ">
                <Accordion type="single" collapsible className="w-full">
                    {/* Descripción */}
                    <AccordionItem value="description">
                        <AccordionTrigger>
                            <h2 className="text-xl font-bold text-gray-900">Descripción</h2>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="prose max-w-none text-gray-700 pt-4">
                                <p>{product.description}</p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Especificaciones */}
                    {product.specificationValues && product.specificationValues.length > 0 && (
                        <AccordionItem value="specifications">
                            <AccordionTrigger>
                                <h2 className="text-xl font-bold text-gray-900">Especificaciones técnicas</h2>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="bg-gray-50 rounded-lg p-6 mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {product.specificationValues.map((spec) => (
                                            <div key={spec.id} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                                               <span className="font-medium text-gray-900">
                                                   {spec.specification.name}
                                               </span>
                                                <span className="text-gray-700">
                                                   {spec.value} {spec.specification.unit && spec.specification.unit}
                                               </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {/* Subcategorías */}
                    {product.subcategories && product.subcategories.length > 0 && (
                        <AccordionItem value="categories">
                            <AccordionTrigger>
                                <h2 className="text-xl font-bold text-gray-900">Categorías</h2>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {product.subcategories.map((subcategory) => (
                                        <div key={subcategory.id} className="bg-gray-100 rounded-lg p-4">
                                            <h3 className="font-medium text-gray-900">{subcategory.name}</h3>
                                            {subcategory.description && (
                                                <p className="text-sm text-gray-600 mt-1">{subcategory.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
            </div>
        </div>
    );
}