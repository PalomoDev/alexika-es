'use client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {Check, X, Eye, Package} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {ROUTES} from "@/lib/constants/routes";
import {OrderSummary} from "@/lib/validations/cart/order-validation";

import DeleteDialog from "@/components/admin/DeleteDialog";
import {orderDelete} from "@/lib/actions/orden/orden.action";

interface OrdersTableProps {
    data?: OrderSummary[];
}

const getStatusBadge = (status: string) => {
    const statusConfig = {
        pending: { label: "Pendiente", variant: "secondary" as const },
        processing: { label: "Procesando", variant: "default" as const },
        shipped: { label: "Enviado", variant: "outline" as const },
        delivered: { label: "Entregado", variant: "default" as const },
        cancelled: { label: "Cancelado", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
};

const OrdersTable = ({data = []}: OrdersTableProps) => {
    return (
        <Table className="mt-4 border bg-white">
            <TableHeader>
                <TableRow>
                    <TableHead className="border-r border-l text-center w-[120px]">
                        ID PEDIDO
                    </TableHead>
                    <TableHead className="border-r text-center w-[180px]">
                        CLIENTE
                    </TableHead>
                    <TableHead className="border-r text-center w-[100px]">
                        PRODUCTOS
                    </TableHead>
                    <TableHead className="border-r text-center w-[100px]">
                        TOTAL
                    </TableHead>
                    <TableHead className="border-r text-center w-[100px]">
                        ESTADO
                    </TableHead>
                    <TableHead className="border-r text-center w-[80px]">
                        PAGADO
                    </TableHead>
                    <TableHead className="border-r text-center w-[100px]">
                        ENTREGADO
                    </TableHead>
                    <TableHead className="border-r text-center w-[120px]">
                        FECHA
                    </TableHead>
                    <TableHead className="border-r text-center w-[100px]">
                        ACCIONES
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            No se encontraron pedidos
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((order) => (
                        <TableRow key={order.id}>
                            {/* Order ID */}
                            <TableCell className="border-r text-center font-mono text-sm">
                                {order.id.slice(-8)}
                            </TableCell>

                            {/* Customer */}
                            <TableCell className="border-r text-left px-2">
                                <div>
                                    <div className="font-medium">{order.user.name}</div>
                                    <div className="text-sm text-muted-foreground">{order.user.email}</div>
                                </div>
                            </TableCell>

                            {/* Products Count */}
                            <TableCell className="border-r text-center">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="cursor-help">
                                            {order.items?.reduce((total, item) => total + item.qty, 0) || 0} items
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <div className="text-sm">
                                            {order.items?.length > 0 ? (
                                                order.items.map((item, index) => (
                                                    <div key={index}>
                                                        {item.qty}x {item.name}
                                                    </div>
                                                ))
                                            ) : (
                                                <div>Sin productos</div>
                                            )}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TableCell>

                            {/* Total Price */}
                            <TableCell className="border-r text-center font-medium">
                                €{Number(order.totalPrice).toFixed(2)}
                            </TableCell>

                            {/* Status */}
                            <TableCell className="border-r text-center">
                                {getStatusBadge(order.status)}
                            </TableCell>

                            {/* Payment Status */}
                            <TableCell className="border-r text-center">
                                <Tooltip>
                                    <TooltipTrigger>
                                        {order.isPaid ? (
                                            <Check className="h-4 w-4 text-green-600 mx-auto" />
                                        ) : (
                                            <X className="h-4 w-4 text-red-500 mx-auto" />
                                        )}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {order.isPaid
                                            ? `Pagado: ${order.paidAt?.toLocaleDateString('es-ES')}`
                                            : 'No pagado'
                                        }
                                    </TooltipContent>
                                </Tooltip>
                            </TableCell>

                            {/* Delivery Status */}
                            <TableCell className="border-r text-center">
                                <Tooltip>
                                    <TooltipTrigger>
                                        {order.isDelivered ? (
                                            <Package className="h-4 w-4 text-green-600 mx-auto" />
                                        ) : (
                                            <Package className="h-4 w-4 text-gray-400 mx-auto" />
                                        )}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {order.isDelivered
                                            ? `Entregado: ${order.deliveredAt?.toLocaleDateString('es-ES')}`
                                            : 'No entregado'
                                        }
                                    </TooltipContent>
                                </Tooltip>
                            </TableCell>

                            {/* Created Date */}
                            <TableCell className="border-r text-center text-sm">
                                {order.createdAt.toLocaleDateString('es-ES')}
                                <div className="text-xs text-muted-foreground">
                                    {order.createdAt.toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="border-r text-center flex items-center justify-center gap-1">
                                <div className="flex items-center justify-center gap-1">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                asChild
                                            >
                                                <Link href={`${ROUTES.ADMIN_PAGES.ORDER}/${order.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Ver detalles del pedido</TooltipContent>
                                    </Tooltip>
                                </div>
                                <DeleteDialog
                                    id={order.id}
                                    action={async (id) => {
                                        const result = await orderDelete(id);
                                        return {
                                            success: result.success,
                                            data: undefined, // Приводим к нужному типу
                                            message: result.message
                                        };
                                    }}
                                    title="This will permanently delete the orden"
                                />
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}

export default OrdersTable;