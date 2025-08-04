'use client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {Check, X, Pencil, ExternalLink} from "lucide-react";
import {Button} from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";
import {ROUTES} from "@/lib/constants/routes";
import DeleteDialog from "@/components/admin/DeleteDialog";
import {ProductTableItem} from "@/types/productos.type";
import {productDelete} from "@/lib/actions/product/product.action";

interface ProductTableProps {
    data: ProductTableItem[];
    hideCategory?: boolean;
}

const ProductTable = ({data}: ProductTableProps) => {
    return (
        <Table className="mt-4 border bg-white">
            <TableHeader>
                <TableRow>
                    <TableHead className="border-r border-l text-center w-[80px]">
                        IMAGE
                    </TableHead>
                    <TableHead className="border-r text-center w-[200px]">
                        NAME
                    </TableHead>
                    <TableHead className="border-r text-center w-[100px]">
                        SKU
                    </TableHead>
                    <TableHead className="border-r text-center w-[120px]">
                        SUBCATEGORIES
                    </TableHead>
                    <TableHead className="border-r text-center w-[100px]">
                        PRICE
                    </TableHead>
                    <TableHead className="border-r text-center w-[80px]">
                        STOCK
                    </TableHead>
                    {/*<TableHead className="border-r text-center w-[120px]">*/}
                    {/*    CATEGORY*/}
                    {/*</TableHead>*/}
                    <TableHead className="border-r text-center w-[120px]">
                        BRAND
                    </TableHead>
                    <TableHead className="border-r text-center w-[80px]">
                        ACTIVE
                    </TableHead>
                    <TableHead className="border-r text-center w-[120px]">
                        ACTIONS
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            No products found
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((product) => (
                        <TableRow key={product.id}>
                            {/* Image */}
                            <TableCell className="border-r text-center">
                                {product.image ? (
                                    <div className="w-12 h-12 relative mx-auto">
                                        <Image
                                            src={product.image.url}
                                            alt={product.image.alt || product.name}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded mx-auto flex items-center justify-center">
                                        <span className="text-xs text-gray-500">No img</span>
                                    </div>
                                )}
                            </TableCell>

                            {/* Name */}
                            <TableCell className="border-r text-left px-2">
                                <div className="font-medium">{product.name}</div>

                            </TableCell>

                            {/* SKU */}
                            <TableCell className="border-r text-center font-mono">
                                {product.sku}
                            </TableCell>

                            {/* Subcategories - новый столбец */}
                            <TableCell className="border-r text-center">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="truncate max-w-[100px] cursor-help">
                                            {product.subcategories.length > 0
                                                ? product.subcategories[0].name + (product.subcategories.length > 1 ? '...' : '')
                                                : 'None'
                                            }
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <div className="text-sm">
                                            {product.subcategories.length > 0
                                                ? product.subcategories.map(sub => sub.name).join(', ')
                                                : 'No subcategories assigned'
                                            }
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TableCell>

                            {/* Price */}
                            <TableCell className="border-r text-center">
                                €{Number(product.price).toFixed(2)}
                            </TableCell>

                            {/* Stock */}
                            <TableCell className="border-r text-center">
                               <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : product.stock < 10 ? 'text-orange-500' : 'text-green-600'}`}>
                                   {product.stock}
                               </span>
                            </TableCell>

                            {/* Category */}
                            {/*<TableCell className="border-r text-center">*/}
                            {/*    {product.category.name}*/}
                            {/*</TableCell>*/}

                            {/* Brand */}
                            <TableCell className="border-r text-center">
                                {product.brand.name}
                            </TableCell>

                            {/* Active Status */}
                            <TableCell className="border-r text-center">
                                <Tooltip>
                                    <TooltipTrigger>
                                        {product.isActive ? (
                                            <Check className="h-4 w-4 text-green-600 mx-auto" />
                                        ) : (
                                            <X className="h-4 w-4 text-red-500 mx-auto" />
                                        )}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {product.isActive ? 'Active' : 'Inactive'}
                                    </TooltipContent>
                                </Tooltip>
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="border-r text-center">
                                <div className="flex items-center justify-center gap-1">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                asChild
                                            >
                                                <Link href={`${ROUTES.ADMIN_PAGES.PRODUCTS}/update/${product.id}`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Edit product</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                asChild
                                            >
                                                <Link href={`${ROUTES.PAGES.PRODUCT}${product.slug}`}>
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>View product</TooltipContent>
                                    </Tooltip>

                                    <DeleteDialog
                                        id={product.id}
                                        action={async (id) => {
                                            const result = await productDelete(id);
                                            return {
                                                success: result.success,
                                                data: undefined, // Приводим к нужному типу
                                                message: result.message
                                            };
                                        }}
                                        title="This will permanently delete the product"
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}

export default ProductTable;