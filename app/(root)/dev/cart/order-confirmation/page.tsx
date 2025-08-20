import { auth } from "@/lib/auth";
import { getUserWithAddress } from "@/lib/actions/user/user.action";
import { checkStockAvailability } from "@/lib/actions/cart/cart-order.action";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserBase } from "@/lib/validations/product/base";

import StockIssues from "@/components/shared/layouts/cart/StockIssue";
import ErrorDisplay from "@/components/ErrorDisplay";
import {ROUTES} from "@/lib/constants/routes";
import {checkCartByUserId} from "@/lib/actions/cart/cart.action";
import CreateOrder from "@/components/shared/layouts/orden/CreateOrder";




export default async function OrderConfirmationPage() {
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

    if (!userResponse.success || !userResponse.data) {
        return (
            <ErrorDisplay message={'User not found'}/>
        );
    }



    const userData: UserBase = userResponse.data;

    if(!userData.address || !userData.paymentMethod) return (
        <ErrorDisplay message={'User not have address or payment method'} backUrl={`${ROUTES.PAGES.CART}/shipping-billing`}/>
    )

    const isCart = await checkCartByUserId(userData.id);
    if(!isCart) return (
        <ErrorDisplay message={'У юзера не корзины или она пуста'} backUrl={`${ROUTES.PAGES.PRODUCTS}`}/>
    )


    // Проверяем наличие товаров в корзине
    console.log('Checking stock availability for user:', userData.id);
    const stockResult = await checkStockAvailability(userData.id);
    console.log('Stock check result:', stockResult);

    // Обработка ошибки при проверке наличия
    if (!stockResult.success) {
        return (
            <ErrorDisplay message={'No puedo проверить наличие товаров'} backUrl={`${ROUTES.PAGES.CART}`}/>
        );
    }



    // Si hay problemas con el stock, mostrar componente StockIssues
    if (stockResult.data?.hasIssues) {
        return (
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="wrapper mx-auto bg-white p-6 rounded-lg shadow-md">
                    <StockIssues
                        stockResult={stockResult.data}
                        returnUrl={`${ROUTES.PAGES.CART}`}
                    />
                </div>
            </div>
        );
    }



    // Si no hay problemas, mostrar la tabla de pedido normal
    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="wrapper mx-auto bg-white p-6 rounded-lg shadow-md text-center">
                <CreateOrder userId={userData.id} />
            </div>
        </div>
    );
}

