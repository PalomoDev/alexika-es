// components/admin/forms/subcategory-create-form.tsx

'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createSubcategorySchema,
    SubcategoryCreate,
    SubcategoryFullResponse
} from '@/lib/validations/product/subcategory-validation';
import { CategoryFilter } from '@/lib/validations/product/category-validation';
import { subcategoryDefaultValues } from "@/lib/constants/form-constant";
import { createSubcategory } from "@/lib/actions/catalog/subcategory.action";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants/routes";
import ImageUploader from "@/components/admin/ImageUploader";

interface CreateSubcategoryFormProps {
    categories: Array<{
        id: string;
        name: string;
        isActive: boolean;
    }>;
}

const CreateSubcategoryForm = ({ categories }: CreateSubcategoryFormProps) => {
    const form = useForm<SubcategoryCreate>({
        resolver: zodResolver(createSubcategorySchema),
        defaultValues: {
            ...subcategoryDefaultValues,
            categoryIds: categories.map(cat => cat.id), // По умолчанию выбираем все категории
        },
        mode: 'onChange'
    });

    const router = useRouter();

    const handleSubmit = async (values: SubcategoryCreate) => {
        try {
            const res = await createSubcategory(values);

            if (res.success) {
                form.reset({
                    ...subcategoryDefaultValues,
                    categoryIds: categories.map(cat => cat.id),
                });
                router.push(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=subcategories`);
            }
        } catch (error) {
            console.error('Error creating subcategory:', error);
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
        router.push(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=subcategories`);
    };

    const handleImageChange = (imageIds: string[]) => {
        form.setValue('imageIds', imageIds, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    const handleCategoryChange = (categoryId: string, checked: boolean) => {
        const currentIds = form.getValues('categoryIds');

        if (checked) {
            form.setValue('categoryIds', [...currentIds, categoryId], {
                shouldValidate: true,
                shouldDirty: true
            });
        } else {
            form.setValue('categoryIds', currentIds.filter(id => id !== categoryId), {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    };

    const handleSelectAllCategories = () => {
        const allCategoryIds = categories.map(cat => cat.id);
        form.setValue('categoryIds', allCategoryIds, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    const handleUnselectAllCategories = () => {
        form.setValue('categoryIds', [], {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    return (
        <div className="mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Create New Subcategory</h1>
                <p className="text-muted-foreground">Fill in the details to create a new subcategory</p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className='space-y-8'
                    noValidate
                >
                    {/* Name and Slug */}
                    <div className='flex flex-col md:flex-row gap-6 items-start'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormLabel>
                                        Subcategory Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter subcategory name'
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
                                                placeholder='Enter subcategory slug'
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
                                        placeholder='Enter subcategory description (optional)'
                                        className='resize-none min-h-24'
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Optional description for the subcategory
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Categories Multi-select */}
                    <FormField
                        control={form.control}
                        name='categoryIds'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Categories <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleSelectAllCategories}
                                            >
                                                Select All
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleUnselectAllCategories}
                                            >
                                                Unselect All
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4 border rounded-lg max-h-60 overflow-y-auto">
                                            {categories.map((category) => (
                                                <div key={category.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`category-${category.id}`}
                                                        checked={field.value.includes(category.id)}
                                                        onCheckedChange={(checked) =>
                                                            handleCategoryChange(category.id, checked as boolean)
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`category-${category.id}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        {category.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Select categories this subcategory belongs to
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Subcategory Image */}
                    <FormField
                        control={form.control}
                        name='imageIds'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Subcategory Image
                                </FormLabel>
                                <FormControl>
                                    <ImageUploader
                                        maxImages={1}
                                        prefix="subcategory"
                                        onChange={handleImageChange}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Upload subcategory image (optional)
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

                    {/* Is Activity Checkbox */}
                    <FormField
                        control={form.control}
                        name='isActivity'
                        render={({ field }) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-label="Activity Subcategory"
                                    />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormLabel>
                                        Activity Subcategory
                                    </FormLabel>
                                    <FormDescription>
                                        Mark as activity to show in activities menu
                                    </FormDescription>
                                </div>
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
                                        aria-label="Active Subcategory"
                                    />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormLabel>
                                        Active Subcategory
                                    </FormLabel>
                                    <FormDescription>
                                        This subcategory will be visible to customers when active
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
                            {form.formState.isSubmitting ? 'Creating Subcategory...' : 'Create Subcategory'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CreateSubcategoryForm;