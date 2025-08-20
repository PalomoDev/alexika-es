'use client'

import * as React from 'react';
import { useTransition } from 'react';
import {CartItem} from "@/lib/validations/cart/cart-validation";

import { addItemToCart } from "@/lib/actions/cart/cart.action";
import {Button} from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {ShoppingCart, Loader2} from "lucide-react";

type AddToCartProps = {
    inStock: boolean;
    item: CartItem
    className?: string;
};

export const AddToCart = ({inStock, item}: AddToCartProps) => {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (item: CartItem) => {
        startTransition(async () => {
            const res = await addItemToCart(item);

            if (!res.success) {
                toast.error('¡Error!', {
                    description: res.message,
                });
            } else {
                toast.success('¡Éxito!', {
                    description: res.message,

                });
            }
        });
    };

    return (
        <div >
            <Button
                disabled={!inStock || isPending}
                onClick={() => handleSubmit(item)}
                variant='ghost'
                className={'w-full flex items-center justify-center space-x-2 bg-brand text-white py-8 px-6 rounded-lg font-medium hover:text-white hover:bg-brand-hover disabled:bg-brand-muted disabled:cursor-not-allowed transition-colors'}
            >
                {isPending ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                    <ShoppingCart className="w-8 h-8" />
                )}
                <span>
                    {isPending
                        ? 'Agregando...'
                        : !inStock
                            ? 'Agotado'
                            : 'Agregar al carrito'
                    }
                </span>
            </Button>
        </div>
    );
};