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
import {Check, X, Pencil, Trash2, Eye} from "lucide-react";
import {Button} from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";
import {ROUTES} from "@/lib/constants/routes";
import DeleteDialog from "@/components/admin/DeleteDialog";
import {deleteBrand} from "@/lib/actions/catalog/brand.action";
import {ArticleListItem} from "@/lib/validations/articles/article-validation";
import {deleteArticleBySlug} from "@/lib/actions/articles/article-actions";

interface ArticlesTableProps {
    data: ArticleListItem[]
}

const ArticlesTable = ({data}: ArticlesTableProps) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-4">
                No Articles found
            </div>
        );
    }

    return (
        <Table className="mt-4 border">
            <TableHeader>
                <TableRow>
                    <TableHead className="border-r border-l text-center w-[150px]">
                        TITLE
                    </TableHead>
                    <TableHead className="border-r text-center">
                        SUBTITLE
                    </TableHead>
                    <TableHead className="border-r text-center">
                        SLUG
                    </TableHead>
                    <TableHead className="border-r text-center">
                        DESCRIPTION
                    </TableHead>
                    <TableHead className="border-r text-center w-[80px]">
                        PUBLISHED
                    </TableHead>
                    <TableHead className="border-r text-center w-[120px]">
                        ACTION
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((article) => (
                    <TableRow key={article.id}>
                        <TableCell className="border-r border-l text-center font-medium">
                            {article.title ? (
                                article.title.length > 30 ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                        <span className="cursor-help hover:text-blue-600 transition-colors">
                                          {article.title.substring(0, 30)}...
                                        </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs bg-slate-500 text-white p-3 rounded-md shadow-lg">
                                            <p className="text-sm leading-relaxed">{article.title}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <span>{article.title}</span>
                                )
                            ) : (
                                "–"
                            )}
                        </TableCell>
                        <TableCell className="border-r border-l text-center">
                            {article.subtitle ? (
                                article.subtitle.length > 30 ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                        <span className="cursor-help hover:text-blue-600 transition-colors">
                                          {article.subtitle.substring(0, 30)}...
                                        </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs bg-slate-500 text-white p-3 rounded-md shadow-lg">
                                            <p className="text-sm leading-relaxed">{article.subtitle}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <span>{article.subtitle}</span>
                                )
                            ) : (
                                "–"
                            )}
                        </TableCell>
                        <TableCell className="border-r border-l text-center">
                            {article.slug ? (
                                article.slug .length > 15 ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                        <span className="cursor-help hover:text-blue-600 transition-colors">
                                          {article.slug .substring(0, 15)}...
                                        </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs bg-slate-500 text-white p-3 rounded-md shadow-lg">
                                            <p className="text-sm leading-relaxed">{article.slug }</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <span>{article.slug }</span>
                                )
                            ) : (
                                "–"
                            )}
                        </TableCell>
                        <TableCell className="border-r border-l text-center">
                            {article.excerpt ? (
                                article.excerpt.length > 30 ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                        <span className="cursor-help hover:text-blue-600 transition-colors">
                                          {article.excerpt.substring(0, 30)}...
                                        </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs bg-slate-500 text-white p-3 rounded-md shadow-lg">
                                            <p className="text-sm leading-relaxed">{article.excerpt}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <span>{article.excerpt}</span>
                                )
                            ) : (
                                "–"
                            )}
                        </TableCell>

                        <TableCell className="border-r border-l text-center">
                            {article.publishedAt ? (
                                new Date(article.publishedAt).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                })
                            ) : (
                                <span className="text-red-600">No publicado</span>
                            )}
                        </TableCell>
                        <TableCell className="border-r border-l text-center">
                            <div className="flex justify-center gap-1">
                                <Button asChild variant="ghost" size="sm">
                                    <Link
                                        href={`${ROUTES.ADMIN_PAGES.CATALOG}/update/${article.id}?type=brand`}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                </Button>

                                <Button asChild variant="ghost" size="sm">
                                    <Link
                                        href={`${ROUTES.PAGES.ARTICLES}/${article.slug}`}
                                        target="_blank"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                </Button>

                                <DeleteDialog slug={article.slug} action={deleteArticleBySlug} />

                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default ArticlesTable;