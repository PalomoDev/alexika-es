import Link from "next/link";
import {ROUTES} from "@/lib/constants/routes";
import {Button} from "@/components/ui/button";
import {ShoppingCart} from "lucide-react";

export const Cart = ({ items }: { items: number }) => {
    return (
        <Link href={ROUTES.PAGES.CART}>
            <Button variant="sin_hover" size="sm" className="relative hover:bg-transparent focus:bg-transparent active:bg-transparent" >
                <ShoppingCart className="w-6 h-6" />
                {items > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {items}
                    </span>
                )}
            </Button>
        </Link>
    )
}
export default Cart;