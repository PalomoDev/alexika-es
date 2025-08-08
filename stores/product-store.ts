import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ProductClient } from '@/lib/validations/product/client'

export interface ProductsState {
    // Данные
    products: ProductClient[]
    isLoading: boolean
    error: string | null
    lastUpdated: Date | null

    // Действия
    setProducts: (products: ProductClient[]) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    clearProducts: () => void
}

export const useProductsStore = create<ProductsState>()(
    devtools(
        (set) => ({
            // Начальное состояние
            products: [],
            isLoading: false,
            error: null,
            lastUpdated: null,

            // Действия
            setProducts: (products) =>
                set(
                    {
                        products,
                        isLoading: false,
                        error: null,
                        lastUpdated: new Date(),
                    },
                    false,
                    'setProducts'
                ),

            setLoading: (loading) =>
                set({ isLoading: loading }, false, 'setLoading'),

            setError: (error) =>
                set({ error, isLoading: false }, false, 'setError'),

            clearProducts: () =>
                set(
                    {
                        products: [],
                        isLoading: false,
                        error: null,
                        lastUpdated: null,
                    },
                    false,
                    'clearProducts'
                ),
        }),
        {
            name: 'products-store',
        }
    )
)

// Хуки для использования
export const useProducts = () => useProductsStore((state) => state.products)
export const useProductsLoading = () => useProductsStore((state) => state.isLoading)
export const useProductsError = () => useProductsStore((state) => state.error)

// Хуки для действий
export const useSetProducts = () => useProductsStore((state) => state.setProducts)
export const useSetLoading = () => useProductsStore((state) => state.setLoading)
export const useSetError = () => useProductsStore((state) => state.setError)
export const useClearProducts = () => useProductsStore((state) => state.clearProducts)