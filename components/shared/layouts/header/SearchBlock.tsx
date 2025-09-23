// components/SearchBlock.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { searchSchema, type SearchInput } from "@/lib/validations/search.validation";
import { ROUTES } from "@/lib/constants/routes";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";



export const SearchBlock = ({ size }: { size: "full" | "icon" }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);



    const handleSearch = async (query: string): Promise<void> => {

        try {
            const validatedData: SearchInput = searchSchema.parse({ query });

            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(validatedData),
            });

            if (!response.ok) {
                throw new Error('Error en la búsqueda');
            }

            // Редирект на страницу результатов

            router.push(`${ROUTES.PAGES.SEARCH}?q=${encodeURIComponent(validatedData.query)}`);

        } catch (error) {
            console.error('Error de búsqueda:', error);
            // Здесь можно добавить toast уведомление об ошибке
        }
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setIsLoading(true);

            try {
                const validatedData = searchSchema.parse({ query: searchQuery });
                router.push(`${ROUTES.PAGES.SEARCH}?q=${encodeURIComponent(validatedData.query)}`);
            } catch (error) {
                console.error('Error de validación:', error);
                // Toast с ошибкой валидации
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const validatedData = searchSchema.parse({ query: searchQuery });
            router.push(`${ROUTES.PAGES.SEARCH}?q=${encodeURIComponent(validatedData.query)}`);
        } catch (error) {
            console.error('Error de validación:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {size === "full" ? (
                <div className="flex-1 max-w-md min-w-80">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            className="pr-10"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSubmit}
                            disabled={isLoading || searchQuery.trim().length < 2}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <Search className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            ) : (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative flex items-end pb-1 justify-center">
                            <Search className="w-6 h-6" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Buscar productos</DialogTitle>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                            <div className="flex-1 relative">
                                <Input
                                    type="text"
                                    placeholder="Escribe tu búsqueda..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading || searchQuery.trim().length < 2}
                                size="icon"
                            >
                                <Search className="w-4 h-4" />
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};