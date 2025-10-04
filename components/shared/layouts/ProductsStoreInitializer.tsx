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

        if (initialized.current) return

        if (initialProducts && initialProducts.length > 0) {

            setProducts(initialProducts)
            initialized.current = true
        } else {

            setError('No se pudieron cargar los productos')
        }
    }, [initialProducts, setProducts, setError])


    return null
}