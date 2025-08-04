
const BASE_URL = '/dev'


export const ROUTES = {
    BASE_URL: BASE_URL,
    API: {
        AUTH: `${BASE_URL}api/auth`,
        USERS: `${BASE_URL}/api/users`,
        UPLOAD: `${BASE_URL}/api/upload`,
    },
    PAGES: {
        HOME: `${BASE_URL}`,
        LOGIN:`/login`,
        REGISTER:`/register`,
        PROFILE: `${BASE_URL}/dashboard`,
        CART: `${BASE_URL}/cart`,
        PRODUCTS: `${BASE_URL}/`,
        PRODUCT: `${BASE_URL}/product/`,

    },
    ADMIN_PAGES: {
        HOME: `/admin`,
        CATALOG: `/admin/catalog`,
        PRODUCTS: `/admin/products`,

    }
} as const

