"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { X, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import {
    CreateArticle, CreateArticleForm, CreateArticleFormSchema,
} from "@/lib/validations/articles/article-validation";
import { createArticle } from "@/lib/actions/articles/article-actions";
import {makeSlug} from "@/lib/utils/make-slug";

const toStr = (v: unknown): string => (v ?? "") as string;



export default function CreateArticlePage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [articleFile, setArticleFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const form = useForm<CreateArticleForm>({
        resolver: zodResolver(CreateArticleFormSchema),
        defaultValues: {
            title: "",
            subtitle: "",
            slug: "",
            excerpt: "",
            content: undefined,
            images: [],
            category: "",
            isFeatured: false,
            isPublished: true, // По умолчанию публикуем
        },
        mode: "onChange",
    });

    console.log("form errors:", form.formState.errors);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = toStr(e.target.value);
        form.setValue("title", value, { shouldDirty: true, shouldValidate: true });
        form.setValue("slug", makeSlug(value), {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    const handleArticleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.name.toLowerCase().endsWith(".md")) {
            setArticleFile(file);
            // Обновляем форму тоже
            form.setValue("content", file, { shouldDirty: true, shouldValidate: true });
            console.log("articleFile selected:", file.name, file.size, file.type);
            return;
        }
        setArticleFile(null);
        form.setValue("content", undefined, { shouldDirty: true, shouldValidate: true });
        toast.error("Por favor selecciona un archivo .md válido");
    };

    const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validImages = files.filter((f) => f.type.startsWith("image/"));

        if (validImages.length !== files.length) {
            toast.error("Algunos archivos no son imágenes válidas");
        }

        setImageFiles((prev) => {
            const next = [...prev, ...validImages];
            // Обновляем форму тоже
            form.setValue("images", next, { shouldDirty: true, shouldValidate: true });
            console.log("imageFiles selected:", next.map((f) => f.name));
            return next;
        });
    };

    const removeImageFile = (index: number) => {
        setImageFiles((prev) => {
            const next = prev.filter((_, i) => i !== index);
            // Обновляем форму тоже
            form.setValue("images", next, { shouldDirty: true, shouldValidate: true });
            console.log("imageFiles after remove:", next.map((f) => f.name));
            return next;
        });
    };

    const handleCancel = () => {
        router.push("/admin/articles");
    };

    const onSubmit = (data: CreateArticleForm) => {
        console.log("=== onSubmit CALLED ===");

        if (!articleFile) {
            console.warn("Нет articleFile!");
            toast.error("Por favor selecciona un archivo de artículo");
            return;
        }

        const formData = new FormData();

        // Текстовые поля из RHF
        formData.append("title", data.title);
        formData.append("subtitle", data.subtitle);
        formData.append("slug", data.slug);
        formData.append("excerpt", data.excerpt);
        if (data.category) formData.append("category", data.category);
        formData.append("isFeatured", String(data.isFeatured));
        formData.append("isPublished", String(data.isPublished));

        // Файл статьи
        formData.append("content", articleFile, articleFile.name);

        // Изображения из состояния
        imageFiles.forEach((file) => {
            formData.append("images", file, file.name);
        });

        // Диагностика
        console.log("client FormData keys:", Array.from(formData.keys()));

        startTransition(async () => {
            try {
                const result = await createArticle(formData);
                console.log("server action result:", result);

                if (result?.success) {
                    toast.success("Artículo publicado exitosamente");
                    router.push("/admin/articles");
                } else {
                    toast.error(result?.message || "Error al crear el artículo");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error inesperado");
            }
        });
    };

    return (
        <div className="main-wrapper px-10 my-10">
            <div className="w-full mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Crear nuevo artículo
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                                noValidate
                                aria-label="Crear artículo"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* IZQ: Información básica */}
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Título <span className="text-red-500">*</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={toStr(field.value)}
                                                            onChange={handleTitleChange}
                                                            placeholder="Título del artículo"
                                                            aria-label="Título del artículo"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="subtitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Subtítulo <span className="text-red-500">*</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={toStr(field.value)}
                                                            placeholder="Subtítulo del artículo"
                                                            aria-label="Subtítulo del artículo"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex items-end space-x-4 w-full justify-between">
                                            <FormField
                                                control={form.control}
                                                name="slug"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>
                                                            Slug <span className="text-red-500">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                value={toStr(field.value)}
                                                                placeholder="url-del-articulo"
                                                                aria-label="Slug del artículo"
                                                                className="w-full"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="excerpt"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Resumen <span className="text-red-500">*</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            value={toStr(field.value)}
                                                            placeholder="Breve descripción del artículo"
                                                            rows={3}
                                                            aria-label="Resumen del artículo"
                                                            className="resize-none"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* DER: Metadatos */}
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Categoría</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={toStr(field.value)}
                                                            placeholder="CONSEJOS, GUÍAS, etc."
                                                            aria-label="Categoría del artículo"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex items-center space-x-4">
                                            <FormField
                                                control={form.control}
                                                name="isFeatured"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center space-x-2">
                                                        <FormControl>
                                                            <Switch
                                                                checked={Boolean(field.value)}
                                                                onCheckedChange={field.onChange}
                                                                aria-label="Artículo destacado"
                                                            />
                                                        </FormControl>
                                                        <FormLabel>Artículo destacado</FormLabel>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="isPublished"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center space-x-2">
                                                        <FormControl>
                                                            <Switch
                                                                checked={Boolean(field.value)}
                                                                onCheckedChange={field.onChange}
                                                                aria-label="Publicar artículo"
                                                            />
                                                        </FormControl>
                                                        <FormLabel>Publicar</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Archivos */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Archivo del artículo */}
                                    <div className="space-y-2">
                                        <Label htmlFor="article-file">
                                            Archivo del artículo (.md){" "}
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="border-2 border-dashed rounded-lg p-4">
                                            <input
                                                id="article-file"
                                                type="file"
                                                accept=".md"
                                                onChange={handleArticleFileChange}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="article-file"
                                                className="flex flex-col items-center cursor-pointer"
                                                tabIndex={0}
                                            >
                                                <FileText className="w-8 h-8 text-gray-400 mb-2" aria-hidden />
                                                <span className="text-sm text-gray-600">
                                                    Clic para seleccionar archivo .md
                                                </span>
                                            </label>

                                            {articleFile && (
                                                <div className="mt-2 p-2 bg-gray-50 rounded flex items-center justify-between">
                                                    <span className="text-sm font-medium">
                                                        {articleFile.name}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setArticleFile(null);
                                                            form.setValue("content", undefined, {
                                                                shouldDirty: true,
                                                                shouldValidate: true
                                                            });
                                                        }}
                                                        aria-label="Eliminar archivo del artículo"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Imágenes */}
                                    <div className="space-y-2">
                                        <Label htmlFor="image-files">Imágenes del artículo</Label>
                                        <div className="border-2 border-dashed rounded-lg p-4">
                                            <input
                                                id="image-files"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageFilesChange}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="image-files"
                                                className="flex flex-col items-center cursor-pointer"
                                                tabIndex={0}
                                            >
                                                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" aria-hidden />
                                                <span className="text-sm text-gray-600">
                                                    Clic para seleccionar imágenes
                                                </span>
                                            </label>

                                            {imageFiles.length > 0 && (
                                                <div className="mt-2 space-y-1">
                                                    {imageFiles.map((file, index) => (
                                                        <div
                                                            key={`${file.name}-${index}`}
                                                            className="p-2 bg-gray-50 rounded flex items-center justify-between"
                                                        >
                                                            <span className="text-sm font-medium truncate">
                                                                {file.name}
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeImageFile(index)}
                                                                aria-label={`Eliminar imagen ${file.name}`}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Кнопки */}
                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        onClick={handleCancel}
                                        disabled={isPending}
                                        aria-label="Cancelar"
                                    >
                                        Cancelar
                                    </Button>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isPending}
                                        aria-label="Crear artículo"
                                    >
                                        {isPending ? "Creando..." : "Crear artículo"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}