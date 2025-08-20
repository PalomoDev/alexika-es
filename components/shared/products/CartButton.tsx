import {ShoppingCart} from "lucide-react";
import {ProductClient} from "@/lib/validations/product/client";
import {cn, formatNumberWithDecimal} from "@/lib/utils";
import {AddToCart} from "@/components/shared/products/cart/add-to-cart";
import {CartItem} from "@/lib/validations/cart/cart-validation";

interface BaseInfoDisplayProps {
    product: ProductClient;
    className?: string;
}

const CartButton = ({product, className,}: BaseInfoDisplayProps) => {


    const item: CartItem = {
        id: product.id.toString(),
        name: product.name,
        sku: product.sku,
        price: formatNumberWithDecimal(Number(product.price)).toString(),
        qty: 1,
        image: product.images[0]?.url,
        slug: product.slug,
        weight: Number(product.specificationValues?.find(sv => sv.specification?.key === 'weight')?.value) || 0,
    }

    return (

            <div className={cn("w-full ", className)}>

                <AddToCart
                           inStock={product.inStock}
                           item={item}/>

            </div>
    )



};

export default CartButton;