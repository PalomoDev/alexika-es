import { Loader2 } from 'lucide-react';

const CatalogLoading = () => {
    return (
        <div className="wrapper">
            <div className="py-6">
                {/* Заголовок страницы */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Gestión de catálogo</h1>
                    <p className="text-muted-foreground">
                        Gestión de marcas, categorías y características de productos
                    </p>
                </div>

                {/* Простой спиннер по центру */}
                <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-muted-foreground text-lg">Loading catalog data...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatalogLoading;