// components/SearchResultsTable.tsx
'use client'

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { ROUTES } from "@/lib/constants/routes";
import {ProductClient} from "@/lib/validations/product/client";

interface SearchResultsTableProps {
    products: ProductClient[];
}

const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
};

export const SearchResultsTable = ({ products }: SearchResultsTableProps) => {
    if (products.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No se encontraron productos</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-20">Foto</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead className="hidden lg:table-cell">Marca</TableHead>
                        <TableHead className="hidden lg:table-cell">Categoría</TableHead>
                        <TableHead className="hidden md:table-cell">Descripción</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-center">Stock</TableHead>
                        <TableHead className="text-center">Acción</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            {/* Фото товара */}
                            <TableCell>
                                <div className="relative w-16 h-16 rounded-md overflow-hidden ">
                                    {product.images && product.images.length > 0 ? (
                                        <Image
                                            src={product.images[0].url}
                                            alt={product.images[0].alt || product.name}
                                            fill
                                            className="object-contain"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <span className="text-xs">Sin foto</span>
                                        </div>
                                    )}
                                </div>
                            </TableCell>



                            {/* Название товара */}
                            <TableCell>
                                <div className="font-medium">{product.name}</div>

                            </TableCell>

                            {/* Бренд (скрыт на планшетах и мобильных) */}
                            <TableCell className="hidden lg:table-cell">
                                <span className="text-sm">{product.brand?.name || "—"}</span>
                            </TableCell>

                            {/* Категория (скрыта на планшетах и мобильных) */}
                            <TableCell className="hidden lg:table-cell">
                                <span className="text-sm">{product.category?.name || "—"}</span>
                            </TableCell>


                            <TableCell className="hidden md:table-cell">
                                <div className="w-96 ">
                                    <p className="text-sm text-gray-600 truncate">
                                        {product.description.split('.')[0] + (product.description.includes('.') ? '.' : '')}
                                    </p>
                                </div>
                            </TableCell>

                            {/* Цена */}
                            <TableCell className="text-right">
                                <div className="font-semibold text-lg">
                                    {product.formattedPrice}
                                </div>
                            </TableCell>

                            {/* Наличие на складе */}
                            <TableCell className="text-center">
                                {product.inStock ? (
                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                        En stock ({product.stock})
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                                        Agotado
                                    </Badge>
                                )}
                            </TableCell>

                            {/* Кнопка перехода к товару */}
                            <TableCell className="text-center">
                                <Button asChild size="sm">
                                    <Link href={`${ROUTES.PAGES.PRODUCT}/${product.slug}`}>
                                        Ver producto
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};