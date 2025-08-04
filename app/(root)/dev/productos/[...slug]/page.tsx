interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductosPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gray-100 p-6 rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Página de Productos</h1>

                <div className="space-y-2">
                    <p><strong>URL Path:</strong> /productos/{slug.join('/')}</p>
                    <p><strong>Slug Array:</strong> [{slug.map(s => `"${s}"`).join(', ')}]</p>
                    <p><strong>Search Params:</strong> {JSON.stringify(resolvedSearchParams, null, 2)}</p>
                </div>
            </div>
        </div>
    );
}