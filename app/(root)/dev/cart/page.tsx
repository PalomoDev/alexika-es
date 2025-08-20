
import {getSessionCart} from "@/lib/actions/cart/cart.action";
import { CART_ZERO } from "@/lib/constants/cart-zero";
import { auth } from "@/lib/auth";
import { getUserWithAddress } from "@/lib/actions/user/user.action";
import { headers } from "next/headers";
import {CartTable} from "@/components/shared/layouts/cart/CartTable";

export default async function HomePage() {
    const cartResponse = await getSessionCart();
    // Получаем headers и сессию
    const headersList = await headers();
    const session = await auth.api.getSession({
        headers: headersList
    });

    let userData = null;
    if (session?.user?.id) {
        const userResponse = await getUserWithAddress(session.user.id);
        userData = userResponse.data;
    }

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="wrapper mx-auto bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-gray-600 mb-8">
                    <CartTable
                        cart={cartResponse.data || CART_ZERO}
                    />

                </div>
            </div>
        </div>
    );
}