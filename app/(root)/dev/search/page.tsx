// app/buscar/page.tsx
import ProductGalleryCard from "@/components/shared/products/product-gallery-card";
import searchProductsForClient from "@/lib/actions/search/search.action";
import {SearchResultsTable} from "@/components/search/search-results-table";

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
    }>
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
    const resolvedParams = await searchParams;
    const query = resolvedParams.q || '';
    const searchResults = await searchProductsForClient({query});
    console.log(searchResults);

    return (
        <div className="main-wrapper mt-12 bg-white">
            <div className="mx-auto px-6 py-8">

                {/* Header con título y query */}
                <div className="mb-8">
                    <h1 className="text-xl pl-1 md:text-3xl font-bold text-gray-900 uppercase mb-4">
                        Resultados de búsqueda
                    </h1>
                    {query && (
                        <p className="text-lg text-gray-600">
                            {searchResults.message || 'No se encontraron resultados'}
                        </p>
                    )}
                </div>

                {/* Contenido de resultados */}
                <div className="prose prose-lg max-w-4xl mx-auto mb-8">
                    {query ? (
                        <div>
                            <p className="text-lg leading-relaxed text-gray-700 mb-6">
                                Mostrando resultados para: {query}
                            </p>
                            {/* Aquí irán los productos */}
                        </div>
                    ) : (
                        <p className="text-lg leading-relaxed text-gray-700 mb-6">
                            No hay término de búsqueda especificado
                        </p>
                    )}
                </div>

                <div className={'w-full h-auto'}>
                    <SearchResultsTable products={searchResults.data || []} />
                </div>

            </div>
        </div>
    );
};

export default SearchPage;