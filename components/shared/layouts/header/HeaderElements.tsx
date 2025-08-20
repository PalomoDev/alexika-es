'use client'

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Menu, Search, ShoppingCart} from "lucide-react";
import { useState, useRef } from "react";

import { ROUTES } from "@/lib/constants/routes";
import { MainMenuProps } from "@/types/menu.type";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";






export const HamburgerMenu = ({ menu: _  }: MainMenuProps) => {
    const [open, setOpen] = useState(false);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current < 50) {
            // Свайп справа налево на 50px или больше
            setOpen(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative size-7">
                    <Menu className="w-6 h-6" />
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-full max-w-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <SheetHeader>
                    <SheetTitle>Menú</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                    меню
                </div>
            </SheetContent>
        </Sheet>
    );
};

export const Oferta = ({oferta} : {oferta: string}) => {
    return (
        <div className="w-full flex items-center justify-center">
            <span>{oferta}</span>
        </div>
    )
}

export const SearchBlock = ({ size }: { size: "full" | "icon" }) => {
    return (
        <>
            {size === "full" ? (
                <div className="flex-1 max-w-md min-w-80">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar un producto, etc..."
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button variant="ghost" size="icon" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <Search className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            ) : (
                <Button variant="ghost" size="icon" className="relative flex items-end pb-1 justify-center">
                    <Search className="w-6 h-6" />
                </Button>
            )}
        </>
    );
};
