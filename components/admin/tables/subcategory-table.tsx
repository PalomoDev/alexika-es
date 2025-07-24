// components/admin/tables/subcategory-table.tsx

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
import { Badge } from "@/components/ui/badge";
import {Check, X, Pencil, Trash2, Activity} from "lucide-react";
import {Button} from "@/components/ui/button";
import {SubcategoryFullResponse} from "@/lib/validations/product/subcategory-validation";
import Image from "next/image";
import Link from "next/link";
import {ROUTES} from "@/lib/constants/routes";
import DeleteDialog from "@/components/admin/DeleteDialog";
import {deleteSubcategory} from "@/lib/actions/catalog/subcategory.action";
import { SubcategoryDelete } from '@/lib/validations/product/subcategory-validation'

interface SubcategoriesTableProps {
    data: SubcategoryFullResponse[]
}

const SubcategoriesTable = ({data}: SubcategoriesTableProps) => {
    return (
        <Table className="mt-4 border">
            <TableHeader>
                <TableRow>
                    <TableHead className="border-r border-l text-center w-[150px]">
                        SUBCATEGORY
                    </TableHead>
                    <TableHead className="border-r text-center">
                        SLUG
                    </TableHead>
                    <TableHead className="border-r text-center">
                        DESCRIPTION
                    </TableHead>
                    <TableHead className="border-r text-center w-[80px]">
                        IMAGE
                    </TableHead>
                    <TableHead className="border-r text-center w-[200px]">
                        CATEGORIES
                    </TableHead>
                    <TableHead className="border-r text-center w-[80px]">
                        PRODUCTS
                    </TableHead>
                    <TableHead className="border-r text-center w-[60px]">
                        ORDER
                    </TableHead>
                    <TableHead className="border-r text-center w-[80px]">
                        ACTIVITY
                    </TableHead>
                    <TableHead className="border-r text-center w-[80px]">
                        ACTIVE
                    </TableHead>
                    <TableHead className="border-r text-center w-[120px]">
                        ACTION
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                            No subcategories found
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((subcategory) => (
                        <TableRow key={subcategory.id}>
                            <TableCell className="border-r border-l text-center font-medium">
                                {subcategory.name}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {subcategory.slug}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {subcategory.description ? (
                                    subcategory.description.length > 30 ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="cursor-help hover:text-blue-600 transition-colors">
                                                    {subcategory.description.substring(0, 30)}...
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs bg-slate-500 text-white p-3 rounded-md shadow-lg">
                                                <p className="text-sm leading-relaxed">{subcategory.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <span>{subcategory.description}</span>
                                    )
                                ) : (
                                    "–"
                                )}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {subcategory.images[0] ? (
                                    <Image
                                        src={subcategory.images[0].url}
                                        alt={subcategory.images[0].alt || ''}
                                        width={32}
                                        height={32}
                                        className="object-contain mx-auto"
                                    />
                                ) : (
                                    "–"
                                )}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {subcategory.categorySubcategories && subcategory.categorySubcategories.length > 0 ? (
                                    <div className="flex flex-wrap gap-1 justify-center">
                                        {subcategory.categorySubcategories.map((item) => (
                                            <Badge key={item.category.id} variant="secondary" className="text-xs">
                                                {item.category.name}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    "–"
                                )}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {subcategory._count?.productSubcategories || 0}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {subcategory.sortOrder}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {subcategory.isActivity ? (
                                    <Activity className="w-4 h-4 text-blue-600 mx-auto"/>
                                ) : (
                                    <X className="w-4 h-4 text-gray-400 mx-auto"/>
                                )}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {subcategory.isActive ? (
                                    <Check className="w-4 h-4 text-green-600 mx-auto"/>
                                ) : (
                                    <X className="w-4 h-4 text-red-600 mx-auto"/>
                                )}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                <div className="flex justify-center gap-1">
                                    <Button asChild variant="ghost" size="sm">
                                        <Link
                                            href={`${ROUTES.ADMIN_PAGES.CATALOG}/update/${subcategory.id}?type=subcategory`}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                    {subcategory._count?.productSubcategories > 0 ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled
                                            title={`Cannot delete: subcategory has ${subcategory._count.productSubcategories} products`}
                                        >
                                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                                        </Button>
                                    ) : (
                                        <DeleteDialog id={subcategory.id} action={deleteSubcategory}/>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
};

export default SubcategoriesTable