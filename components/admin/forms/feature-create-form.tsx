'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFeatureSchema, FeatureCreate } from '@/lib/validations/product/feature-validation';
import { createFeature } from "@/lib/actions/catalog/feature.action";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants/routes";
import ImageUploader from "@/components/admin/ImageUploader";
import {featureDefaultValues} from "@/lib/constants/form-constant";
import slugify from "slugify";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryFullResponse } from "@/lib/validations/product/category-validation";

interface CreateFeatureFormProps {
    categories: CategoryFullResponse[];
}



const CreateFeatureForm = ({ categories }: CreateFeatureFormProps) => {
    const form = useForm<FeatureCreate>({
        resolver: zodResolver(createFeatureSchema),
        defaultValues: featureDefaultValues,
        mode: 'onChange'
    });

    const router = useRouter();

    const handleSubmit = async (values: FeatureCreate) => {
        try {
            const res = await createFeature(values);

            if (res.success) {
                form.reset(featureDefaultValues);
                router.push(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=features`);
            }
        } catch (error) {
            console.error('Error creating feature:', error);
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
                <h1 className="text-2xl font-bold">Create New Feature</h1>
                <p className="text-muted-foreground">Fill in the details to create a new feature</p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className='space-y-8'
                    noValidate
                >
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
                                            onChange={(e) => {
                                                const formattedValue = e.target.value
                                                    .toLowerCase()
                                                    .replace(/^\w/, (c) => c.toUpperCase());
                                                field.onChange(formattedValue);
                                            }}
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
                                                value={field.value || ''} // Добавить эту строку
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
                            {form.formState.isSubmitting ? 'Creating Feature...' : 'Create Feature'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CreateFeatureForm;