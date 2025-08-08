"use client";

import { useState } from 'react';
import { RefreshCw, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateCatalogMenu } from '@/lib/actions/menu.action';

type MenuButtonStatus = 'idle' | 'loading' | 'success' | 'error';

const MenuGeneratorButton = () => {
    const [status, setStatus] = useState<MenuButtonStatus>('idle');

    const handleGenerate = async () => {
        setStatus('loading');

        try {
            const result = await generateCatalogMenu();

            if (result.success) {
                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
                console.error('Menu generation failed:', result.message);
            }
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
            console.error('Menu generation error:', error);
        }
    };

    const getButtonContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="hidden sm:inline ml-2">Генерация...</span>
                    </>
                );
            case 'success':
                return (
                    <>
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline ml-2">Готово</span>
                    </>
                );
            case 'error':
                return (
                    <>
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline ml-2">Ошибка</span>
                    </>
                );
            default:
                return (
                    <>
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline ml-2">Обновить меню</span>
                    </>
                );
        }
    };

    const getButtonStyles = () => {
        switch (status) {
            case 'success':
                return "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100";
            case 'error':
                return "bg-red-50 border border-red-200 text-red-700 hover:bg-red-100";
            case 'loading':
                return "bg-blue-50 border border-blue-200 text-blue-700";
            default:
                return "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-transparent";
        }
    };

    return (
        <button
            onClick={handleGenerate}
            disabled={status === 'loading'}
            className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                getButtonStyles()
            )}
            title="Обновить меню каталога"
        >
            {getButtonContent()}
        </button>
    );
};

export default MenuGeneratorButton;