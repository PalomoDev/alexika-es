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
import {Check, X, Pencil, Trash2, ExternalLink} from "lucide-react";
import {Button} from "@/components/ui/button";
import {BrandFullResponse} from "@/lib/validations/product/brand";
import Image from "next/image";
import Link from "next/link";
import {ROUTES} from "@/lib/constants/routes";
import DeleteDialog from "@/components/admin/DeleteDialog";
import {deleteBrand} from "@/lib/actions/catalog/brand.action";

interface BrandsTableProps {
    data: BrandFullResponse[]
}

const BrandsTable = ({data}: BrandsTableProps) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-4">
                No brands found
            </div>
        );
    }

    return (
        <Table className="mt-4 border">
            <TableHeader>
                <TableRow>
                    <TableHead className="border-r border-l text-center w-[150px]">
                        BRAND
                    </TableHead>
                    <TableHead className="border-r text-center">
                        SLUG
                    </TableHead>
                    <TableHead className="border-r text-center">
                        DESCRIPTION
                    </TableHead>
                    <TableHead className="border-r text-center w-[80px]">
                        LOGO
                    </TableHead>
                    <TableHead className="border-r text-center w-[100px]">
                        WEBSITE
                    </TableHead>
                    <TableHead className="border-r text-center w-[80px]">
                        PRODUCTS
                    </TableHead>
                    <TableHead className="border-r text-center w-[60px]">
                        ORDER
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
                {data.map((brand) => (
                    <TableRow key={brand.id}>
                        <TableCell className="border-r border-l text-center font-medium">
                            {brand.name}
                        </TableCell>
                        <TableCell className="border-r border-l text-center">
                            {brand.slug}
                        </TableCell>
                        <TableCell className="border-r border-l text-center">
                            {brand.description ? (
                            brand.description.length > 30 ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="cursor-help hover:text-blue-600 transition-colors">
                                          {brand.description.substring(0, 30)}...
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs bg-slate-500 text-white p-3 rounded-md shadow-lg">
                                        <p className="text-sm leading-relaxed">{brand.description}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <span>{brand.description}</span>
                            )
                        ) : (
                            "–"
                        )}
                        </TableCell>
                        <TableCell className="border-r border-l text-center">
                            {brand.images[0]? (
                                <Image
                                    src={brand.images[0].url}
                                    alt={brand.images[0].alt || ''}
                                    width={32}
                                    height={32}
                                    className="object-contain mx-auto"
                                />
                            ) : (
                                "–"
                            )}
                        </TableCell>
                        <TableCell className="border-r border-l text-center">
                            {brand.website ? (
                                <span>{brand.website}</span>
                            ) : (
                                "–"
                            )}
                        </TableCell>
                        <TableCell className="border-r border-l text-center">
                            {brand._count?.products || 0}
                        </TableCell>
                        <TableCell className="border-r border-l text-center">
                            {brand.sortOrder}
                        </TableCell>
                        <TableCell className="border-r border-l text-center">
                            {brand.isActive ? (
                                <Check className="w-4 h-4 text-green-600 mx-auto"/>
                            ) : (
                                <X className="w-4 h-4 text-red-600 mx-auto"/>
                            )}
                        </TableCell>
                        <TableCell className="border-r border-l text-center">
                            <div className="flex justify-center gap-1">
                                <Button asChild variant="ghost" size="sm">
                                    <Link
                                        href={`${ROUTES.ADMIN_PAGES.CATALOG}/update/${brand.id}?type=brand`}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                </Button>
                                {brand._count?.products > 0 ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled
                                        title={`Cannot delete: brand has ${brand._count.products} products`}
                                    >
                                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                                    </Button>
                                ) : (
                                    <DeleteDialog id={brand.id} action={deleteBrand} />
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default BrandsTable;