'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateFeatureSchema, FeatureUpdate, FeatureFullResponse } from '@/lib/validations/product/feature-validation';
import { updateFeature } from "@/lib/actions/catalog/feature.action";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants/routes";
import ImageUploader from "@/components/admin/ImageUploader";
import { CreatedImageResponse } from '@/lib/validations/product/image-validation';
import slugify from "slugify";
import {CategoryFullResponse} from "@/lib/validations/product/category-validation";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface EditFeatureFormProps {
    data: FeatureFullResponse;
    categories: CategoryFullResponse[];
}

const EditFeatureForm = ({ data, categories  }: EditFeatureFormProps) => {
    const form = useForm<FeatureUpdate>({
        resolver: zodResolver(updateFeatureSchema),
        defaultValues: {
            id: data.id,
            name: data.name,
            key: data.key,
            description: data.description,
            categoryId: data.categoryId || undefined,
            imageIds: data.images?.map(img => img.id) || [],
            sortOrder: data.sortOrder,
            isActive: data.isActive,
        },
        mode: 'onChange'
    });

    const router = useRouter();

    // DTO: Преобразуем FeatureImage в CreatedImageResponse для ImageUploader
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

    const handleSubmit = async (values: FeatureUpdate) => {
        try {
            const res = await updateFeature(values);

            if (res.success) {
                router.push(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=features`);
            }
        } catch (error) {
            console.error('Error updating feature:', error);
            // Здесь можно показать ошибку пользователю через toast
        }
    };

    const handleCancelForm = () => {
        router.push(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=features`);
    };

    const handleImageChange = (imageIds: string[]) => {
        form.setValue('imageIds', imageIds, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    // Добавить функцию генерации key после handleImageChange
    const handleGenerateKey = () => {
        const name = form.getValues('name');
        if (name) {
            const generatedKey = slugify(name, { lower: true, strict: true });
            form.setValue('key', generatedKey, {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    };

    return (
        <div className="mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Edit Feature</h1>
                <p className="text-muted-foreground">Update the feature details</p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className='space-y-8'
                    noValidate
                >
                    {/* Hidden ID field */}
                    <input type="hidden" {...form.register('id')} />

                    {/* Name and Key */}
                    <div className='flex flex-col md:flex-row gap-6 items-start'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormLabel>
                                        Feature Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter feature name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Name of the feature (e.g., Waterproof, Lightweight)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='key'
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormLabel>
                                        Key <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className='space-y-2'>
                                            <Input
                                                placeholder='Enter feature key'
                                                {...field}
                                                value={field.value || ''} // Защита от undefined
                                            />
                                            <Button
                                                type='button'
                                                variant='secondary'
                                                size='sm'
                                                onClick={handleGenerateKey}
                                            >
                                                Generate from Name
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Unique identifier for the feature (e.g., waterproof, lightweight)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Category Selection */}
                        <FormField
                            control={form.control}
                            name='categoryId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Category
                                    </FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                                        value={field.value || "none"}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category (optional)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">No category</SelectItem>
                                            {(categories || []).filter(cat => cat.isActive).map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Optional: Link this feature to a specific category
                                    </FormDescription>
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
                                        placeholder='Enter feature description (optional)'
                                        className='resize-none min-h-24'
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Optional description for the feature
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Feature Image */}
                    <FormField
                        control={form.control}
                        name='imageIds'
                        render={() => (
                            <FormItem>
                                <FormLabel>
                                    Feature Image
                                </FormLabel>
                                <FormControl>
                                    <ImageUploader
                                        maxImages={1}
                                        prefix="feature"
                                        onChange={handleImageChange}
                                        initialImages={convertToCreatedImageResponse()}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Upload feature image/icon (optional)
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
                                        aria-label="Active Feature"
                                    />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormLabel>
                                        Active Feature
                                    </FormLabel>
                                    <FormDescription>
                                        This feature will be available for products when active
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
                            {form.formState.isSubmitting ? 'Updating Feature...' : 'Update Feature'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default EditFeatureForm;