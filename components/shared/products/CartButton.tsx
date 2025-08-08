import {ShoppingCart} from "lucide-react";
import {ProductClient} from "@/lib/validations/product/client";
import {cn} from "@/lib/utils";

interface BaseInfoDisplayProps {
    product: ProductClient;
    className?: string;
}

const CartButton = ({product, className,}: BaseInfoDisplayProps) => {
    return (
        <div className={cn("w-full ", className)}>
            <button
                disabled={!product.inStock}
                className="w-full flex items-center justify-center space-x-2 bg-brand text-white py-3 px-6 rounded-lg font-medium hover:bg-brand-hover disabled:bg-brand-muted disabled:cursor-not-allowed transition-colors"
            >
                <ShoppingCart className="w-5 h-5"/>
                <span>
                                {product.inStock ? 'Añadir al carrito' : 'Agotado'}
                            </span>
            </button>


        </div>
    );
};

export default CartButton;