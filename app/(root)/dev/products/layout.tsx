import ProductsStoreInitializer from '@/components/shared/layouts/ProductsStoreInitializer'
import getAllProductsForClient from '@/lib/actions/product/product.client.action'

export default async function CatalogLayout({
                                                children,
                                            }: Readonly<{
    children: React.ReactNode;
}>) {
    // Получаем данные на сервере
    const productsResult = await getAllProductsForClient()

    return (
        <>
            <ProductsStoreInitializer
                initialProducts={productsResult.success ? productsResult.data : null}
            />
            {children}
        </>
    )
}