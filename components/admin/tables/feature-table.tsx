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
import {Check, X, Pencil } from "lucide-react";
import {Button} from "@/components/ui/button";
import {FeatureFullResponse} from "@/lib/validations/product/feature-validation";
import Image from "next/image";
import Link from "next/link";
import {ROUTES} from "@/lib/constants/routes";
import DeleteDialog from "@/components/admin/DeleteDialog";
import {deleteFeature} from "@/lib/actions/catalog/feature.action";

interface FeaturesTableProps {
    data: FeatureFullResponse[]
}

const FeaturesTable = ({data}: FeaturesTableProps) => {
    return (
        <Table className="mt-4 border">
            <TableHeader>
                <TableRow>
                    <TableHead className="border-r border-l text-center w-[200px]">
                        FEATURE
                    </TableHead>
                    <TableHead className="border-r text-center">
                        DESCRIPTION
                    </TableHead>
                    <TableHead className="border-r text-center">
                        CATEGORY
                    </TableHead>
                    <TableHead className="border-r text-center w-[80px]">
                        IMAGE
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
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No features found
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((feature) => (
                        <TableRow key={feature.id}>
                            <TableCell className="border-r border-l text-center font-medium">
                                {feature.name}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {feature.description ? (
                                    feature.description.length > 50 ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="cursor-help hover:text-blue-600 transition-colors">
                                                    {feature.description.substring(0, 50)}...
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs bg-slate-500 text-white p-3 rounded-md shadow-lg">
                                                <p className="text-sm leading-relaxed">{feature.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <span>{feature.description}</span>
                                    )
                                ) : (
                                    "–"
                                )}
                            </TableCell>
                            <TableCell className="border-r border-l text-center font-medium">
                                {feature.category?.name}
                            </TableCell>

                            <TableCell className="border-r border-l text-center">
                                {feature.images[0] ? (
                                    <Image
                                        src={feature.images[0].url}
                                        alt={feature.images[0].alt || ''}
                                        width={32}
                                        height={32}
                                        className="object-contain mx-auto"
                                    />
                                ) : (
                                    "–"
                                )}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {feature.sortOrder}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                {feature.isActive ? (
                                    <Check className="w-4 h-4 text-green-600 mx-auto"/>
                                ) : (
                                    <X className="w-4 h-4 text-red-600 mx-auto"/>
                                )}
                            </TableCell>
                            <TableCell className="border-r border-l text-center">
                                <div className="flex justify-center gap-1">
                                    <Button asChild variant="ghost" size="sm">
                                        <Link
                                            href={`${ROUTES.ADMIN_PAGES.CATALOG}/update/${feature.id}?type=feature`}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                    <DeleteDialog id={feature.id} action={deleteFeature} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
};

export default FeaturesTable;