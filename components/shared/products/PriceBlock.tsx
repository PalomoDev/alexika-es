// @flow
import * as React from 'react';
import {ProductClient} from "@/lib/validations/product/client";
import {cn} from "@/lib/utils";

interface BaseInfoDisplayProps {
    product: ProductClient;
    className?: string;
}
const PriceBlock = ({product, className,}: BaseInfoDisplayProps) => {
    return (
        <div className={cn("w-full ", className)}>
            <div className="text-3xl font-bold text-gray-900">
                {product.formattedPrice}
            </div>
            <div className={`text-sm ${product.inStock ? 'text-brand-hover' : 'text-brand-muted'}`}>
                {product.inStock ? `En stock (${product.stock} disponibles)` : 'Agotado'}
            </div>
        </div>
    );
};
export default PriceBlock;