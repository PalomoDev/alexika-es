
const BASE_URL = ''


export const ROUTES = {
    BASE_URL: BASE_URL,
    API: {
        AUTH: `${BASE_URL}api/auth`,
        USERS: `${BASE_URL}/api/users`,
        UPLOAD: `${BASE_URL}/api/upload`,
    },
    PAGES: {
        HOME: `/`,
        LOGIN:`/login`,
        REGISTER:`/register`,
        PROFILE: `${BASE_URL}/dashboard`,
        CART: `${BASE_URL}/cart`,
        PRODUCTS: `/products`,
        PRODUCT: `${BASE_URL}/product/`,
        ORDERS: `${BASE_URL}/user/orders`,
        ARTICLES: `${BASE_URL}/alexika-traveler-club`,
        SEARCH: `${BASE_URL}/search`,

    },
    ADMIN_PAGES: {
        HOME: `/admin`,
        CATALOG: `/admin/catalog`,
        PRODUCTS: `/admin/products`,
        ORDER: `/admin/order`,


    }
} as const

