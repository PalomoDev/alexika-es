
import {getSessionCart} from "@/lib/actions/cart/cart.action";
import { CART_ZERO } from "@/lib/constants/cart-zero";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {CartTable} from "@/components/shared/layouts/cart/CartTable";

export default async function HomePage() {
    const cartResponse = await getSessionCart();
    // Получаем headers и сессию
    const headersList = await headers();
    const session = await auth.api.getSession({
        headers: headersList
    });



    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="wrapper mx-auto bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-gray-600 mb-8">
                    <CartTable
                        cart={cartResponse.data || CART_ZERO}
                    />
                    {!session?.user?.id && (
                        <p className="mt-6 text-sm text-red-600 font-medium">
                            Para continuar con tu carrito y finalizar la compra, debes iniciar sesión.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}