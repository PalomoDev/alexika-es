import {getSessionCart} from "@/lib/actions/cart/cart.action";

import { auth } from "@/lib/auth";
import { getUserWithAddress } from "@/lib/actions/user/user.action";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {ShippingAddressForm} from "@/components/shared/layouts/user/ShippingAddressForm";
import {UserBase} from "@/lib/validations/product/base";
import PaymentMethodForm from "@/components/shared/layouts/user/PaymentMethodForm";
import {ShippingAddress} from "@/lib/validations/user/address-validation";
import ShippingBillingComponent from "@/components/shared/layouts/cart/ShippingBillingComponent";



export default async function ShippingBillingPage() {
    const cartResponse = await getSessionCart();


    // Получаем headers и сессию
    const headersList = await headers();
    const session = await auth.api.getSession({
        headers: headersList
    });

    // Проверяем авторизацию - если нет пользователя, редиректим
    if (!session?.user?.id) {
        redirect('/login');
    }

    // Если пользователь есть, получаем его данные
    const userResponse = await getUserWithAddress(session.user.id);
    console.log(userResponse)
    if (!userResponse.success || !userResponse.data) return (<div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="wrapper mx-auto bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-gray-600 mb-8">
                User not found
            </div>
        </div>
    </div>);
    const userData: UserBase = userResponse.data;




    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="wrapper mx-auto bg-white p-6 rounded-lg shadow-md text-center">
                <ShippingBillingComponent user={userData} />
            </div>
        </div>
    );
}