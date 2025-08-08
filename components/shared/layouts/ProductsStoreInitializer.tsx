'use client'

import { useEffect, useRef } from 'react'
import { useSetProducts, useSetError } from '@/stores/product-store'
import type { ProductClient } from '@/lib/validations/product/client'

interface ProductsStoreInitializerProps {
    initialProducts: ProductClient[] | null
}

export default function ProductsStoreInitializer({
                                                     initialProducts
                                                 }: ProductsStoreInitializerProps) {
    const setProducts = useSetProducts()
    const setError = useSetError()
    const initialized = useRef(false)

    useEffect(() => {
        // Предотвращаем повторную инициализацию
        if (initialized.current) return

        if (initialProducts && initialProducts.length > 0) {
            console.log('🏪 Инициализируем products store с', initialProducts.length, 'товарами')
            setProducts(initialProducts)
            initialized.current = true
        } else {
            console.warn('⚠️ Не удалось загрузить товары для store')
            setError('Не удалось загрузить товары')
        }
    }, [initialProducts, setProducts, setError])

    // Компонент невидимый - не рендерит ничего
    return null
}