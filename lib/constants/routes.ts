
const BASE_URL = 'dev/'


export const ROUTES = {
    API: {
        AUTH: `${BASE_URL}api/auth`,
        USERS: `${BASE_URL}/api/users`,
        UPLOAD: `${BASE_URL}/api/upload`,
    },
    PAGES: {
        HOME: `${BASE_URL}`,
        LOGIN:`${BASE_URL}login`,
        DASHBOARD: `${BASE_URL}dashboard`,
        ADMIN: `${BASE_URL}admin`,
    },
} as const

