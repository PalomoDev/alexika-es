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
import {Check, X, Pencil, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {SpecificationFullResponse} from "@/lib/validations/product/specification-validation";
import Image from "next/image";
import Link from "next/link";
import {ROUTES} from "@/lib/constants/routes";
import DeleteDialog from "@/components/admin/DeleteDialog";
import {deleteSpecification} from "@/lib/actions/catalog/specification.action";

interface SpecificationsTableProps {
    data: SpecificationFullResponse[]
}

const SpecificationsTable = ({data}: SpecificationsTableProps) => {
    return (
        <Table className="mt-4 border">
            <TableHeader>
                <TableRow>
                    <TableHead className="border-r border-l text-center w-[150px]">
                        SPECIFICATION
                    </TableHead>
                    <TableHead className="border-r text-center w-[100px]">
                        KEY
                    </TableHead>
                    <TableHead className="border-r text-center">
                        DESCRIPTION
                    </TableHead>
                    <TableHead className="border-r text-center w-[80px]">
                        TYPE
                    </TableHead>
                    <TableHead className="border-r text-center w-[80px]">
                        UNIT
                    </TableHead>
                    <TableHead className="border-r text-center w-[100px]">
                        CATEGORY
                    </TableHead>
                    <TableHead className="border-r text-center w-[80px]">
                        IMAGE
                    </TableHead>
                    <TableHead className="border-r text-center w-[150px]">
                        USED IN CATEGORIES
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
                {data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                            No specifications found
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((specification) => (
                        <TableRow key={specification.id}>
                            <TableCell className="w-32 text-xs border-r border-l text-center font-medium break-words hyphens-auto">
                                {specification.name}
                            </TableCell>
                            <TableCell className="border-r max-w-10 overflow-hidden text-ellipsis whitespace-nowrap border-l text-center text-xs font-mono">
                                {specification.key}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {specification.description ? (
                                    specification.description.length > 30 ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="cursor-help hover:text-blue-600 transition-colors">
                                                    {specification.description.substring(0, 30)}...
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs bg-slate-500 text-white p-3 rounded-md shadow-lg">
                                                <p className="text-sm leading-relaxed">{specification.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <span>{specification.description}</span>
                                    )
                                ) : (
                                    "–"
                                )}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                <Badge variant={specification.type === 'number' ? 'default' : 'secondary'}>
                                    {specification.type}
                                </Badge>
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {specification.unit || "–"}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {specification.category ? (
                                    <Badge variant="outline" className="text-xs">
                                        {specification.category}
                                    </Badge>
                                ) : (
                                    "–"
                                )}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {specification.images[0] ? (
                                    <Image
                                        src={specification.images[0].url}
                                        alt={specification.images[0].alt || ''}
                                        width={24}
                                        height={24}
                                        className="object-contain mx-auto"
                                    />
                                ) : (
                                    "–"
                                )}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {specification.categorySpecs && specification.categorySpecs.length > 0 ? (
                                    <div className="flex flex-wrap gap-1 justify-center">
                                        {specification.categorySpecs.map((item) => (
                                            <Badge
                                                key={item.category.id}
                                                variant={item.isRequired ? "default" : "secondary"}
                                                className="text-xs"
                                                title={item.isRequired ? "Required" : "Optional"}
                                            >
                                                {item.category.name}
                                                {item.isRequired && "*"}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    "–"
                                )}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {specification._count?.productSpecifications || 0}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {specification.sortOrder}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {specification.isActive ? (
                                    <Check className="w-4 h-4 text-green-600 mx-auto"/>
                                ) : (
                                    <X className="w-4 h-4 text-red-600 mx-auto"/>
                                )}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                <div className="flex justify-center gap-1">
                                    <Button asChild variant="ghost" size="sm">
                                        <Link
                                            href={`${ROUTES.ADMIN_PAGES.CATALOG}/update/${specification.id}?type=specification`}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                    {specification._count?.productSpecifications > 0 ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled
                                            title={`Cannot delete: specification is used by ${specification._count.productSpecifications} products. Remove from products first.`}
                                        >
                                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                                        </Button>
                                    ) : (
                                        <DeleteDialog
                                            id={specification.id}
                                            action={deleteSpecification}
                                            title={specification._count?.categorySpecs > 0
                                                ? `This will also remove links to ${specification._count.categorySpecs} categories. Continue?`
                                                : undefined
                                            }
                                        />
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

export default SpecificationsTable;