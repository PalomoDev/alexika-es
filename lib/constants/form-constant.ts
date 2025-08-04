import {ProductCreate} from "@/lib/validations/product/product-validation";


export const brandDefaultValues = {
    name: "",
    slug: "",
    description: null,
    website: null,
    isActive: true,
    sortOrder: 0,
    imageIds: []
};

export const categoryDefaultValues = {
    name: "",
    slug: "",
    description: null,
    isActive: true,
    sortOrder: 0,
    imageIds: []
}

export const subcategoryDefaultValues = {

    name: '',
    slug: '',
    description: '',
    imageIds: [],
    isActivity: false,
    isActive: true,
    sortOrder: 0,
    categoryIds: []
}

// Значения по умолчанию для формы
export const featureDefaultValues = {
    name: '',
    description: null,
    key: '',
    imageIds: [],
    isActive: true,
    sortOrder: 0,
    categoryId: '',

};

export const specificationsDefaultValues = {
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
}

export const productDefaultValues: ProductCreate = {
    categoryId: '',
    brandId: '',
    name: '',
    slug: '',
    sku: '',
    imageIds: [],
    description: '',
    stock: 0,
    price: 0,
    isFeatured: false,
    isActive: true,
    subcategoryIds: [],
    featureIds: [],
    specificationValues: []
}