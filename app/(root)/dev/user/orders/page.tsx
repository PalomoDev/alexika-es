
import * as React from 'react';
import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import {OrderSummary} from "@/lib/validations/cart/order-validation";
import {getUserOrders} from "@/lib/actions/orden/orden.action";
import ErrorDisplay from "@/components/ErrorDisplay";

import UserOrdenList from "@/app/(root)/dev/user/orders/UserOrdenList";



const UserOrderPage = async () => {

    // Получаем headers и сессию
    const headersList = await headers();
    const session = await auth.api.getSession({
        headers: headersList
    });

    // Проверяем авторизацию - если нет пользователя, редиректим
    if (!session?.user?.id) {
        redirect('/login');
    }

    const userId = session.user.id;
    const res = await getUserOrders(userId)
    if(!res.success || !res.data) return (<div><ErrorDisplay message={'Ordera not found'}/></div>)
    const orders: OrderSummary[] = res.data;
    console.log(orders)

    return (
        <div className="pt-15">
            <div className=" w-full    rounded-lg shadow-md text-center bg-white px-6 pt-6 pb-8 ">
                <UserOrdenList orders={orders} userId={userId}/>

            </div>
        </div>
    );
};

export default UserOrderPage;