// app/products/[slug]/page.tsx
import { getProductBySlugForClient } from "@/lib/actions/product/product.client.action";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, ShoppingCart, Heart } from "lucide-react";

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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Галерея изображений */}
                <div className="space-y-4">
                    {/* Главное изображение */}
                    <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                        {product.images[0] ? (
                            <Image
                                src={product.images[0].url}
                                alt={product.images[0].alt || product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                Sin imagen
                            </div>
                        )}
                    </div>

                    {/* Миниатюры */}
                    {product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {product.images.slice(1, 5).map((image) => (
                                <div
                                    key={image.id}
                                    className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80"
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt || product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Информация о продукте */}
                <div className="space-y-6">
                    {/* Заголовок и навигация */}
                    <div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span>{product.category?.name}</span>
                            {product.subcategories && product.subcategories.length > 0 && (
                                <>
                                    <span className="mx-2">•</span>
                                    <span>{product.subcategories[0].name}</span>
                                </>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {product.name}
                        </h1>
                        <p className="text-gray-600">
                            Marca: <span className="font-medium">{product.brand?.name}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                            SKU: {product.sku}
                        </p>
                    </div>

                    {/* Рейтинг */}
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${
                                        star <= product.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-gray-600">
                            {product.rating.toFixed(1)}
                        </span>
                    </div>

                    {/* Цена */}
                    <div className="space-y-2">
                        <div className="text-3xl font-bold text-gray-900">
                            {product.formattedPrice}
                        </div>
                        <div className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                            {product.inStock ? `En stock (${product.stock} disponibles)` : 'Agotado'}
                        </div>
                    </div>

                    {/* Особенности */}
                    {product.features && product.features.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Características destacadas</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.features.map((feature) => (
                                    <span
                                        key={feature.id}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                    >
                                        {feature.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Кнопки действий */}
                    <div className="space-y-3">
                        <button
                            disabled={!product.inStock}
                            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span>
                                {product.inStock ? 'Añadir al carrito' : 'Agotado'}
                            </span>
                        </button>

                        <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                            <Heart className="w-5 h-5" />
                            <span>Añadir a favoritos</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Descripción */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Descripción</h2>
                <div className="prose max-w-none text-gray-700">
                    <p>{product.description}</p>
                </div>
            </div>

            {/* Especificaciones */}
            {product.specificationValues && product.specificationValues.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Especificaciones técnicas</h2>
                    <div className="bg-gray-50 rounded-lg p-6">
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
                </div>
            )}

            {/* Subcategorías */}
            {product.subcategories && product.subcategories.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorías</h2>
                    <div className="flex flex-wrap gap-3">
                        {product.subcategories.map((subcategory) => (
                            <div key={subcategory.id} className="bg-gray-100 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900">{subcategory.name}</h3>
                                {subcategory.description && (
                                    <p className="text-sm text-gray-600 mt-1">{subcategory.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}