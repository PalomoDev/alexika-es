'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { OrderSummary } from "@/lib/validations/cart/order-validation";
import OrdenTable from "@/components/shared/layouts/orden/orden-table";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusBadge } from "@/lib/utils/order-page.utils";

interface UserOrderListProps {
    orders: OrderSummary[]
    userId: string;
}

const UserOrdenList = ({ orders, userId }: UserOrderListProps) => {
    if (!orders || orders.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No tienes pedidos aún</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">

            {/* Заголовок */}
            <div className="border-b pb-4 text-left">
                <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
                <p className="text-gray-600 mt-1">
                    Gestiona y revisa tus pedidos realizados
                </p>
            </div>

            <Accordion type="single" collapsible className="w-full" defaultValue={orders[0]?.id}>
                {orders.map((order) => {
                    const statusInfo = getStatusBadge(order.status);

                    return (
                        <AccordionItem key={order.id} value={order.id}>
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex justify-between items-center w-full pr-4">
                                    <div className="flex items-center gap-4">
                                       <span className="font-mono text-sm">
                                           #{order.id.slice(-8).toUpperCase()}
                                       </span>
                                        <span className="text-sm text-gray-600">
                                           {formatDate(order.createdAt)}
                                       </span>
                                    </div>
                                    <Badge variant={statusInfo.variant}>
                                        {statusInfo.label}
                                    </Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <OrdenTable
                                    orderData={order}
                                    userId={userId}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
};

export default UserOrdenList;