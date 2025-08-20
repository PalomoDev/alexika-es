'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';

interface ErrorDisplayProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    backUrl?: string;
    showBackButton?: boolean;
    retryText?: string;
    backText?: string;
    className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
                                                       title = 'Error',
                                                       message,
                                                       onRetry,
                                                       backUrl,
                                                       showBackButton = true,
                                                       retryText = 'Reintentar',
                                                       backText = 'Volver',
                                                       className = ''
                                                   }) => {
    const router = useRouter();

    const handleGoBack = () => {
        if (backUrl) {
            router.push(backUrl);
        } else {
            window.history.back();
        }
    };

    return (
        <div className={`flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${className}`}>
            <div className="wrapper mx-auto bg-white p-6 rounded-lg shadow-md text-center max-w-md">
                <div className="text-red-600 mb-6">
                    <AlertCircle className="h-16 w-16 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {onRetry && (
                        <Button
                            onClick={onRetry}
                            className="flex items-center gap-2"
                            size="lg"
                        >
                            <RotateCcw className="h-4 w-4" />
                            {retryText}
                        </Button>
                    )}

                    {showBackButton && (
                        <Button
                            onClick={handleGoBack}
                            variant="outline"
                            className="flex items-center gap-2"
                            size="lg"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {backText}
                        </Button>
                    )}
                </div>

                <div className="mt-4 text-xs text-gray-400">
                    Si el problema persiste, contacta con soporte
                </div>
            </div>
        </div>
    );
};

export default ErrorDisplay;