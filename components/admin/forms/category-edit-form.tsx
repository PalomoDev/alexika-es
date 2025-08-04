'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCategorySchema, CategoryUpdate, CategoryFullResponse } from '@/lib/validations/product/category-validation';
import { updateCategory } from "@/lib/actions/catalog/category.action";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants/routes";
import ImageUploader from "@/components/admin/ImageUploader";
import { CreatedImageResponse } from '@/lib/validations/product/image-validation';

interface EditCategoryFormProps {
    data: Omit<CategoryFullResponse, '_count'>; // Просто исключаем _count
}

const EditCategoryForm = ({ data }: EditCategoryFormProps) => {
    const form = useForm<CategoryUpdate>({
        resolver: zodResolver(updateCategorySchema),
        defaultValues: {
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            imageIds: data.images?.map(img => img.id) || [],
            sortOrder: data.sortOrder,
            isActive: data.isActive,
        },
        mode: 'onChange'
    });

    const router = useRouter();

    // DTO: Преобразуем CategoryImage в CreatedImageResponse для ImageUploader
    const convertToCreatedImageResponse = (): CreatedImageResponse[] => {
        if (!data.images || data.images.length === 0) return [];

        return data.images.map(img => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
            sortOrder: img.sortOrder,
            filename: '', // Не используется в компоненте
            isDeleted: false // Активные изображения
        }));
    };

    const handleSubmit = async (values: CategoryUpdate) => {
        try {
            const res = await updateCategory(values);

            if (res.success) {
                router.push(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=categories`);
            }
        } catch (error) {
            console.error('Error updating category:', error);
            // Здесь можно показать ошибку пользователю через toast
        }
    };

    const handleGenerateSlug = () => {
        const name = form.getValues('name');
        if (name) {
            const generatedSlug = slugify(name, { lower: true, strict: true });
            form.setValue('slug', generatedSlug, {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    };

    const handleCancelForm = () => {
        router.push(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=categories`);
    };

    const handleImageChange = (imageIds: string[]) => {
        form.setValue('imageIds', imageIds, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    return (
        <div className="mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Edit Category</h1>
                <p className="text-muted-foreground">Update the category details</p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className='space-y-8'
                    noValidate
                >
                    {/* Hidden ID field */}
                    <input type="hidden" {...form.register('id')} />

                    {/* Name and Slug */}
                    <div className='flex flex-col md:flex-row gap-6 items-start'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormLabel>
                                        Category Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter category name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='slug'
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormLabel>
                                        Slug <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className='space-y-2'>
                                            <Input
                                                placeholder='Enter category slug'
                                                {...field}
                                            />
                                            <Button
                                                type='button'
                                                variant='secondary'
                                                size='sm'
                                                onClick={handleGenerateSlug}
                                            >
                                                Generate from Name
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Description
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='Enter category description (optional)'
                                        className='resize-none min-h-24'
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Optional description for the category
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category Image */}
                    <FormField
                        control={form.control}
                        name='imageIds'
                        render={() => (
                            <FormItem>
                                <FormLabel>
                                    Category Image
                                </FormLabel>
                                <FormControl>
                                    <ImageUploader
                                        maxImages={1}
                                        prefix="category"
                                        onChange={handleImageChange}
                                        initialImages={convertToCreatedImageResponse()}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Upload category image (optional)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Sort Order */}
                    <FormField
                        control={form.control}
                        name='sortOrder'
                        render={({ field }) => (
                            <FormItem className='max-w-xs'>
                                <FormLabel>
                                    Sort Order <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type='number'
                                        placeholder='0'
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Lower numbers appear first. Use 0 for highest priority.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Is Active Checkbox */}
                    <FormField
                        control={form.control}
                        name='isActive'
                        render={({ field }) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-label="Active Category"
                                    />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormLabel>
                                        Active Category
                                    </FormLabel>
                                    <FormDescription>
                                        This category will be visible to customers when active
                                    </FormDescription>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <div className='flex gap-4'>
                        <Button
                            type='button'
                            variant='outline'
                            size='lg'
                            className='flex-1'
                            onClick={handleCancelForm}
                            disabled={form.formState.isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            size='lg'
                            disabled={form.formState.isSubmitting}
                            className='flex-1'
                        >
                            {form.formState.isSubmitting ? 'Updating Category...' : 'Update Category'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default EditCategoryForm;