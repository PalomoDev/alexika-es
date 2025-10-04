'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productCreateSchema, ProductCreate } from '@/lib/validations/product/product-validation';
import { productDefaultValues } from "@/lib/constants/form-constant";
import { productCreate } from '@/lib/actions/product/product.action';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import ImageUploader from "@/components/admin/ImageUploader";
import {useState} from "react";
import { useToast } from "@/hooks/use-toast";
import SpecificationsTable from "@/components/admin/tables/SpecificationsTable";



interface ProductCreateFormProps {

    categories: Array<{ id: string; name: string; isActive: boolean; slug: string; }>;
    brands: Array<{ id: string; name: string; isActive: boolean }>;
    subcategories: Array<{ id: string; name: string; isActive: boolean }>;
    features: Array<{ id: string; name: string; isActive: boolean }>;
    specifications: Array<{ id: string; name: string;  type: "number" | "text"; unit: string | null; isRequired: boolean | null; sortOrder: number; key: string }>;
}

const ProductCreateForm = ({categories, brands, subcategories, features, specifications}: ProductCreateFormProps) => {
    const [priceDisplay, setPriceDisplay] = useState('');
    const { toast } = useToast();
    const form = useForm<ProductCreate>({
        resolver: zodResolver(productCreateSchema),
        defaultValues: {
            ...productDefaultValues,
            categoryId: categories[0]?.id || "",
            brandId: brands[0]?.id || "",
        },
        mode: 'onChange'
    });

    const prefixNameFilestoUpload = categories[0]?.slug || 'product_out_category';

    const router = useRouter();

    const handleSubmit = async (values: ProductCreate) => {
        try {
            const res = await productCreate({ data: values });

            if (res.success) {
                toast.success('Успешно!', {
                    description: res.message,
                });
                form.reset(productDefaultValues);
                router.push(`${ROUTES.ADMIN_PAGES.PRODUCTS}?tab=${categories[0]?.slug}`);
            } else {
                toast.error('Ошибка!', {
                    description: res.message,
                });
            }
        } catch (error) {
            console.error('Error creating product:', error);

            let errorMessage = 'Something went wrong';

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            toast.error('Ошибка!', {
                description: errorMessage,
            });
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

    const handleImageChange = (imageIds: string[]) => {
        form.setValue('imageIds', imageIds, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    const handleCancelForm = () => {
        router.push(`${ROUTES.ADMIN_PAGES.PRODUCTS}?tab=${categories[0]?.slug}`);
    };

    return (
        <div className="mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Create New Product in Category {categories[0]?.name} </h1>
                <p className="text-muted-foreground">Fill in the details to create a new product</p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className='space-y-8'
                    noValidate
                >
                    {/* Name and Slug and  SKU*/}
                    <div className='flex flex-col md:flex-row gap-6 items-start bg-white p-4'>
                        <FormField
                            control={form.control}
                            name='brandId'
                            render={({ field }) => (
                                <FormItem className='max-w-xs'>
                                    <FormLabel>
                                        Brand <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl className={'w-full'}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a brand" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {brands.map((brand) => (
                                                <SelectItem key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormLabel>
                                        Product Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter product name'
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
                                                placeholder='Enter product slug'
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
                        <FormField
                            control={form.control}
                            name='sku'
                            render={({ field }) => (
                                <FormItem className='max-w-xs'>
                                    <FormLabel>
                                        SKU (Article) <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter product SKU'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Unique product identifier/article number
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Скрытое поле для categoryId */}
                    <input type="hidden" {...form.register('categoryId')} />


                    {/* Description */}
                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem className={'bg-white p-4'}>
                                <FormLabel>
                                    Description <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='Enter product description'
                                        className='resize-none min-h-32'
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Detailed product description
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
                            <FormItem className={'bg-white p-4'}>
                                <FormLabel>
                                    Product Image
                                </FormLabel>
                                <FormDescription>
                                    Upload feature image/icon (optional)
                                </FormDescription>
                                <FormControl>
                                    <ImageUploader
                                        maxImages={5}
                                        prefix={prefixNameFilestoUpload}
                                        onChange={handleImageChange}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className={'flex items-start gap-6 bg-white p-4'}>
                        <FormField
                            control={form.control}
                            name='specificationValues'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Product Specifications
                                    </FormLabel>
                                    <FormControl>
                                        <SpecificationsTable
                                            specifications={specifications}
                                            values={field.value || []}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Fill in the product specifications
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex flex-col gap-8 border-l-1 pl-6'>
                            <FormField
                                control={form.control}
                                name='subcategoryIds'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Subcategories <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="space-y-4">
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => form.setValue('subcategoryIds', subcategories.map(sub => sub.id))}
                                                    >
                                                        Select All
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => form.setValue('subcategoryIds', [])}
                                                    >
                                                        Unselect All
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4 border rounded-lg max-h-60 overflow-y-auto">
                                                    {subcategories.map((subcategory) => (
                                                        <div key={subcategory.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`subcategory-${subcategory.id}`}
                                                                checked={Array.isArray(field.value) && field.value.includes(subcategory.id)}
                                                                onCheckedChange={(checked) => {
                                                                    const currentIds = field.value || [];
                                                                    if (checked) {
                                                                        form.setValue('subcategoryIds', [...currentIds, subcategory.id]);
                                                                    } else {
                                                                        form.setValue('subcategoryIds', currentIds.filter(id => id !== subcategory.id));
                                                                    }
                                                                }}
                                                            />
                                                            <label
                                                                htmlFor={`subcategory-${subcategory.id}`}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                            >
                                                                {subcategory.name}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Select subcategories for this product (minimum 1 required)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Features Multi-select */}
                            <FormField
                                control={form.control}
                                name='featureIds'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Features <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="space-y-4">
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => form.setValue('featureIds', features.map(feature => feature.id))}
                                                    >
                                                        Select All
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => form.setValue('featureIds', [])}
                                                    >
                                                        Unselect All
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4 border rounded-lg max-h-60 overflow-y-auto">
                                                    {features.map((feature) => (
                                                        <div key={feature.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`feature-${feature.id}`}
                                                                checked={Array.isArray(field.value) && field.value.includes(feature.id)}
                                                                onCheckedChange={(checked) => {
                                                                    const currentIds = field.value || [];
                                                                    if (checked) {
                                                                        form.setValue('featureIds', [...currentIds, feature.id]);
                                                                    } else {
                                                                        form.setValue('featureIds', currentIds.filter(id => id !== feature.id));
                                                                    }
                                                                }}
                                                            />
                                                            <label
                                                                htmlFor={`feature-${feature.id}`}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                            >
                                                                {feature.name}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Select subcategories for this product (minimum 1 required)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                        </div>


                    </div>


                    {/* Stock and Price */}
                    <div className='flex flex-col md:flex-row gap-6 items-start bg-white p-4'>
                        <FormField
                            control={form.control}
                            name='stock'
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormLabel>
                                        Stock Quantity <span className="text-red-500">*</span>
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
                                        Available quantity in stock
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='price'
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormLabel>
                                        Price <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type='text'
                                            placeholder='0,00'
                                            value={priceDisplay}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                setPriceDisplay(inputValue);

                                                // Преобразуем для формы
                                                const cleanValue = inputValue.replace(',', '.');
                                                const numValue = parseFloat(cleanValue);

                                                if (!isNaN(numValue)) {
                                                    field.onChange(Number(numValue.toFixed(2)));
                                                } else if (inputValue === '') {
                                                    field.onChange(0);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Product price in euros
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>


                    <div className={'flex  justify-between gap-8  p-4 bg-white '}>
                        {/* Is Featured Checkbox */}
                        <FormField
                            control={form.control}
                            name='isFeatured'
                            render={({ field }) => (
                                <FormItem className='flex-1 flex flex-row items-start space-x-3 space-y-0'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            aria-label="Featured Product"
                                        />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>
                                            Featured Product
                                        </FormLabel>
                                        <FormDescription>
                                            This product will be highlighted as recommended
                                        </FormDescription>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className={'flex-1 justify-start gap-4 '}>
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
                                                aria-label="Active Product"
                                            />
                                        </FormControl>
                                        <div className='space-y-1 leading-none'>
                                            <FormLabel>
                                                Active Product
                                            </FormLabel>
                                            <FormDescription>
                                                This product will be visible to customers when active
                                            </FormDescription>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>




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
                            onClick={() => {
                                console.log('🔘 Submit button clicked', form.formState)}
                        }
                        >
                            {form.formState.isSubmitting ? 'Creating Product...' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ProductCreateForm;