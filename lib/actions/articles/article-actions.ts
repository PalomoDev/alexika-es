'use server'
import {
    ArticleFromDB,
    ArticleListItem,
    ArticleListItemSchema,
    CreateArticleFormSchema
} from "@/lib/validations/articles/article-validation";
import {
    createArticleFolder, createArticleInDb,
    getWebPathFromFullPath,
    processMarkdownFile, removeFolderByImageFolder,
    saveFiles
} from "@/lib/actions/articles/article-utils";

import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";


type ActionResponse<T = undefined> = {
    success: boolean;
    data?: T | null;
    message?: string;
};



export async function createArticle(formData: FormData): Promise<ActionResponse<string>> {
    try {
        const articleFile = formData.get("content");
        if (!(articleFile instanceof File)) {
            return { success: false, data: "", message: "articleFile (.md) es obligatorio" };
        }
        const markdownContent = await processMarkdownFile(articleFile);

        // Собираем изображения (все под ключом "images")
        const imageFiles = formData.getAll("images").filter((v) => v instanceof File) as File[];

        // Валидация текстовых полей через Zod
        const parsed = CreateArticleFormSchema.safeParse({
            title: formData.get("title") as string,
            subtitle: formData.get("subtitle") as string,
            slug: formData.get("slug") as string,
            excerpt: formData.get("excerpt")  as string,
            category: formData.get("category") ?? "",
            // Boolean поля - приводим к boolean
            isPublished: formData.get("isPublished") === "true",
            isFeatured: formData.get("isFeatured") === "true",
            // Передаем сами File объекты
            images: imageFiles, // не map, а сами файлы
            content: articleFile
        });

        if (!parsed.success) {
            console.error("SERVER: zod errors:", parsed.error.issues);
            return { success: false, data: "", message: "Datos inválidos" + parsed.error.issues};
        }

        const data = parsed.data;
        const folderPath = await createArticleFolder(data.slug);
        const shortArticlePath = await getWebPathFromFullPath(folderPath);
        const articleFiles = [articleFile, ...imageFiles];
        const result = await saveFiles(articleFiles, folderPath);

        if(!result.success) {
            return { success: false, data: "", message:  "Error saving files" + result.errors };
        }

        const article = await createArticleInDb({
            title: data.title,
            subtitle: data.subtitle,
            slug: data.slug,
            content: markdownContent,
            excerpt: data.excerpt,
            category: data.category,
            imageFolder: shortArticlePath || "",
            seoTitle: "",
            seoDescription: "",
            isPublished: data.isPublished || false,
            isFeatured: data.isFeatured || false,
        })

        if(!article) throw new Error("Error creating article in DB");

        return { success: true, message: "OK", data: article };
    } catch (err) {
        console.error("SERVER: unexpected error:", err);
        return { success: false, data: "", message: "Unexpected server error" };
    }
}

type ArticleList = ArticleListItem[]

export const getAllArticles = async (): Promise<ActionResponse<ArticleList>> => {
    try {

        const articles = await prisma.article.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                title: true,
                subtitle: true,
                slug: true,
                excerpt: true,
                category: true,
                isFeatured: true,
                publishedAt: true,
                imageFolder: true,
                coverImage: true

            }
        });



        return {
            success: true,
            data: articles,
            message: "OK"
        }
    } catch (err) {
        return {
            success: false,
            data: [],
            message: "Unexpected server error" + err
        }
    }
}

export const getArticleBySlug = async (slug: string):
    Promise<ActionResponse<ArticleFromDB>> => {

    try {

        const article = await prisma.article.findUnique({
            where: { slug }
        })

        console.log('Input slug:', JSON.stringify(slug))
        console.log('Article result:', JSON.stringify(article))
        console.log('Article is null?', article === null)

        if (!article) {
            return {
                success: false,
                data: null,
                message: 'Artículo no encontrado'
            }
        }

        return {
            success: true,
            data: article,
            message: 'Ok'
        }

    } catch (err) {
        return {
            success: false,
            data: null,
            message: "Unexpected server error" + err
        }
    }
}





/**
 * Удаляет папку по сохранённому в БД пути imageFolder.
 * Возвращает true, если попытка прошла (папка удалена или её не было).
 */


/**
 * Удаляет статью по slug: сначала из БД, затем — её папку медиа.
 */
export const deleteArticleBySlug = async (slug: string): Promise<ActionResponse<string | undefined>> => {
    try {
        if (!slug || typeof slug !== 'string') {
            return { success: false, message: 'Slug inválido' };
        }

        // 1) Ищем статью
        const article = await prisma.article.findUnique({
            where: { slug },
            select: { id: true, imageFolder: true },
        });

        if (!article) {
            return { success: false, message: 'Artículo no encontrado' };
        }

        // 2) Удаляем запись из БД
        await prisma.article.delete({ where: { id: article.id } });

        // 3) Пытаемся удалить папку с файлами (по сохранённому пути)
        if (article.imageFolder) {
            const folderRemoved = await removeFolderByImageFolder(article.imageFolder);
            if (!folderRemoved) {
                // Запись уже удалена — возвращаем успех, но сигнализируем про папку
                return {
                    success: true,

                    message: 'Artículo eliminado, pero hubo un problema al eliminar la carpeta',
                };
            }
        }
        revalidatePath('/admin/articles');
        return { success: true,  message: 'OK' };
    } catch (err) {
        console.error('deleteArticleBySlug error:', err);
        return { success: false,  message: 'Error al eliminar el artículo' };
    }
};

