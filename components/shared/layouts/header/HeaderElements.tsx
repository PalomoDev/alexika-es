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


