'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ShoppingCart, RotateCcw } from 'lucide-react';

interface StockIssue {
    productId: string;
    productName: string;
    requestedQty: number;
    availableQty: number;
    sku: string;
}

interface StockCheckResult {
    hasIssues: boolean;
    issues: StockIssue[];
    totalItems: number;
}

interface StockIssuesProps {
    stockResult: StockCheckResult;
    returnUrl?: string;
    onRetry?: () => void;
}

const StockIssues: React.FC<StockIssuesProps> = ({
                                                     stockResult,
                                                     returnUrl = '/cart',
                                                     onRetry
                                                 }) => {
    const router = useRouter();

    const handleReturnToCart = () => {
        router.push(returnUrl);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-6">
            <div className="border-b-2 border-red-500 pb-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">PROBLEMAS CON DISPONIBILIDAD</h1>
                <p className="text-gray-600 mt-1">
                    {stockResult.issues.length} de {stockResult.totalItems} productos no están disponibles
                </p>
            </div>

            <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                    <strong>No se puede procesar el pedido</strong> - Los siguientes productos tienen problemas de disponibilidad:
                </AlertDescription>
            </Alert>

            <div className="space-y-4 mb-6">
                {stockResult.issues.map((issue) => (
                    <Card key={issue.productId} className="border-red-200">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{issue.productName}</h3>
                                    <p className="text-sm text-gray-600">SKU: {issue.sku}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-red-600">
                                        <span className="font-medium">Solicitado: {issue.requestedQty}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Disponible: {issue.availableQty}
                                    </div>
                                </div>
                            </div>

                            {issue.availableQty === 0 ? (
                                <div className="mt-2 text-sm text-red-600 font-medium">
                                    ❌ Producto no disponible
                                </div>
                            ) : (
                                <div className="mt-2 text-sm text-amber-600">
                                    ⚠️ Stock insuficiente (disponible: {issue.availableQty})
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    onClick={handleReturnToCart}
                    className="flex-1"
                    size="lg"
                >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Volver al carrito
                </Button>

                {onRetry && (
                    <Button
                        onClick={onRetry}
                        variant="outline"
                        className="flex-1"
                        size="lg"
                    >
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Verificar de nuevo
                    </Button>
                )}
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
                💡 Puedes ajustar las cantidades o eliminar productos no disponibles en el carrito
            </div>
        </div>
    );
};

export default StockIssues;