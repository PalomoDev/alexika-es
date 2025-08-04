'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSpecificationSchema, SpecificationCreate } from '@/lib/validations/product/specification-validation';
import { CategoryFullResponse } from '@/lib/validations/product/category-validation';
import { createSpecification } from "@/lib/actions/catalog/specification.action";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants/routes";
import ImageUploader from "@/components/admin/ImageUploader";
import {specificationsDefaultValues} from "@/lib/constants/form-constant";

interface CreateSpecificationFormProps {
    categories: CategoryFullResponse[]
}

const CreateSpecificationForm = ({ categories }: CreateSpecificationFormProps) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const form = useForm<SpecificationCreate & { categoryIds: string[] }>({
        resolver: zodResolver(createSpecificationSchema),
        defaultValues: specificationsDefaultValues,
        mode: 'onChange'
    });

    const router = useRouter();

    const handleSubmit = async (values: SpecificationCreate & { categoryIds: string[] }) => {
        try {
            const res = await createSpecification(values);

            if (res.success) {
                form.reset({
                    name: '',
                    key: '',
                    description: null,
                    unit: null,
                    type: 'text' as const,
                    imageIds: [],
                    category: null,
                    isActive: true,
                    sortOrder: 0,
                    categoryIds: [],
                });
                setSelectedCategories([]);
                router.push(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=specifications`);
            }
        } catch (error) {
            console.error('Error creating specification:', error);
            // Здесь можно показать ошибку пользователю через toast
        }
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

    const handleCancelForm = () => {
        router.push(`${ROUTES.ADMIN_PAGES.CATALOG}?tab=specifications`);
    };

    const handleImageChange = (imageIds: string[]) => {
        form.setValue('imageIds', imageIds, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    const handleCategoryChange = (categoryId: string, checked: boolean) => {
        let newSelection;
        if (checked) {
            newSelection = [...selectedCategories, categoryId];
        } else {
            newSelection = selectedCategories.filter(id => id !== categoryId);
        }
        setSelectedCategories(newSelection);

        // Обновляем поле формы для валидации
        form.setValue('categoryIds', newSelection, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    const handleSelectAllCategories = () => {
        const activeCategoryIds = categories.filter(cat => cat.isActive).map(cat => cat.id);
        setSelectedCategories(activeCategoryIds);
        form.setValue('categoryIds', activeCategoryIds, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    const handleUnselectAllCategories = () => {
        setSelectedCategories([]);
        form.setValue('categoryIds', [], {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    return (
        <div className="mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Create New Specification</h1>
                <p className="text-muted-foreground">Fill in the details to create a new specification</p>
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
                                        Specification Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter specification name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Display name (e.g., Weight, Capacity, Temperature)
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
                                                placeholder='Enter specification key'
                                                {...field}
                                                value={field.value || ''}
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
                                        Unique identifier (e.g., weight, capacity, temperature)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Type and Unit */}
                    <div className='flex flex-col md:flex-row gap-6 items-start'>
                        <FormField
                            control={form.control}
                            name='type'
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormLabel>
                                        Type <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select specification type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="number">Number</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Data type for this specification
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='unit'
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormLabel>
                                        Unit
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter unit (e.g., kg, °C, places)'
                                            {...field}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Unit of measurement (optional)
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
                                        placeholder='Enter specification description (optional)'
                                        className='resize-none min-h-24'
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Optional description explaining this specification
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Categories Multi-select */}
                    <FormField
                        control={form.control}
                        name='categoryIds'
                        render={() => (
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
                                                Select All Active
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
                                                        checked={selectedCategories.includes(category.id)}
                                                        onCheckedChange={(checked) =>
                                                            handleCategoryChange(category.id, checked as boolean)
                                                        }
                                                        disabled={!category.isActive}
                                                    />
                                                    <label
                                                        htmlFor={`category-${category.id}`}
                                                        className={`text-sm font-medium leading-none cursor-pointer ${
                                                            !category.isActive
                                                                ? 'text-muted-foreground line-through'
                                                                : 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                                                        }`}
                                                    >
                                                        {category.name}
                                                        {!category.isActive && ' (Inactive)'}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        {selectedCategories.length > 0 && (
                                            <div className="text-sm text-muted-foreground">
                                                Selected: {selectedCategories.length} categories
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Select categories where this specification will be available
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Specification Image */}
                    <FormField
                        control={form.control}
                        name='imageIds'
                        render={() => (
                            <FormItem>
                                <FormLabel>
                                    Specification Image
                                </FormLabel>
                                <FormControl>
                                    <ImageUploader
                                        maxImages={1}
                                        prefix="specification"
                                        onChange={handleImageChange}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Upload specification icon/image (optional)
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
                                        aria-label="Active Specification"
                                    />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormLabel>
                                        Active Specification
                                    </FormLabel>
                                    <FormDescription>
                                        This specification will be available for products when active
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
                            {form.formState.isSubmitting ? 'Creating Specification...' : 'Create Specification'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CreateSpecificationForm;