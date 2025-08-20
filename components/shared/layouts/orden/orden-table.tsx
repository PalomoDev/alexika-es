'use client'
import {AlertCircle, Calendar, CheckCircle2, CreditCard, Hash, MapPin, User} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {calculateTax} from "@/lib/utils/cart-calculations";
import {formatDate, formatPrice, getPaymentMethodLabel, getStatusBadge} from "@/lib/utils/order-page.utils";
import {Separator} from "@/components/ui/separator";
import {Card, CardContent} from "@/components/ui/card";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import React, {useState, useTransition} from "react";
import {OrderSummary} from "@/lib/validations/cart/order-validation";
import {returnOrderToCart} from "@/lib/actions/cart/cart-order.action";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {ROUTES} from "@/lib/constants/routes";


interface OrderTableProps {
    orderData: OrderSummary;
    handlePayment?: () => void;
    userId: string;
    onReturnToCart?: () => void;
}

const OrdenTable = ({orderData, userId, onReturnToCart}: OrderTableProps) => {
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const statusInfo = getStatusBadge(orderData.status);
    const router = useRouter();

    const canProceedToPayment = agreedToTerms && agreedToPrivacy;

    const handlePayment = () => {
        if (!orderData) return;

        if (!canProceedToPayment) {
            toast.error('Error', {
                description: 'Debes aceptar todos los términos para continuar'
            });
            return;
        }
        router.push(`${ROUTES.PAGES.CART}/payment/${orderData.paymentMethod}?orderId=${orderData.id}`);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white pt-6">
            {/* Encabezado estilo factura */}
            <div className="border-b-2 border-gray-900 pb-4 mb-6">
                <div className="flex justify-between items-start">
                    <div className="pl-2">
                        <h1 className="text-2xl text-left font-bold text-gray-900">
                            {orderData.status === 'pending' ? 'RESUMEN DEL PEDIDO' : `PEDIDO #${orderData.id.slice(-8).toUpperCase()}`}
                        </h1>
                        {orderData.status === 'pending' && (
                            <p className="text-gray-600 mt-1">Revisa los detalles antes de confirmar</p>
                        )}
                    </div>
                    <div className="text-right">
                        {orderData.status === 'pending' && (
                            <div className="flex items-center gap-2 mb-2">
                                <Hash className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">Pedido #</span>
                                <span className="font-mono text-sm">{orderData.id.slice(-8).toUpperCase()}</span>
                            </div>
                        )}
                        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    </div>
                </div>
            </div>

            {/* Tabla de productos */}
            <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-left pl-2">Productos</h3>
                <div className="border border-gray-300 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="font-semibold text-gray-900 text-center">Artículo</TableHead>
                                <TableHead className="font-semibold text-gray-900 text-center">Nombre</TableHead>
                                <TableHead className="font-semibold text-gray-900 text-center">Cantidad</TableHead>
                                <TableHead className="font-semibold text-gray-900 text-center">Precio sin IVA</TableHead>
                                <TableHead className="font-semibold text-gray-900 text-center">Precio con IVA</TableHead>
                                <TableHead className="font-semibold text-gray-900 text-center">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderData.items.map((item, index) => {
                                const priceWithoutVat = item.price;
                                const vat = Number(calculateTax(item.price)) + item.price;
                                const totalPrice = vat * item.qty;

                                return (
                                    <TableRow key={`${item.orderId}-${item.productId}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <TableCell>
                                            <div className="text-xs text-gray-500 font-mono text-center">{item.slug}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-gray-900">{item.name}</div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                           <span className="inline-block bg-gray-100 px-2 py-1 rounded text-sm font-medium">
                                               {item.qty}
                                           </span>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {formatPrice(priceWithoutVat)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {formatPrice(vat)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-medium">
                                            {formatPrice(totalPrice)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Datos del Cliente */}
            <div className="flex flex-col flex-1 bg-gray-50 p-2 mb-6 border border-gray-300">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 pl-2">
                    <User className="h-4 w-4" />
                    Datos del Cliente
                </h3>
                <div className="text-sm text-gray-700 space-y-2 p-3 flex-1 text-left">
                    <div>
                        <span className="text-gray-600">Nombre:</span>
                        <span className="ml-2 font-medium">{orderData.user?.name}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">{orderData.user?.email}</span>
                    </div>
                </div>
            </div>

            {/* Información del pedido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 border border-gray-300 p-2 bg-gray-50">
                <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 pl-2">
                        <MapPin className="h-4 w-4" />
                        Dirección de Envío
                    </h3>
                    <div className="text-sm text-gray-700 space-y-1 bg-gray-50 p-3 flex-1 text-left">
                        {orderData.shippingAddress?.street ? (
                            <>
                                <div className="font-medium">{orderData.shippingAddress.street}</div>
                                {orderData.shippingAddress.apartment && (
                                    <div>{orderData.shippingAddress.apartment}</div>
                                )}
                                <div>{orderData.shippingAddress.city}, {orderData.shippingAddress.province}</div>
                                <div>{orderData.shippingAddress.postalCode}, {orderData.shippingAddress.country}</div>
                                {orderData.shippingAddress.phone && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                        Tel: {orderData.shippingAddress.phone}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-amber-600">
                                <AlertCircle className="h-4 w-4 inline mr-1" />
                                Dirección de envío no configurada
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 pl-2">
                        <CreditCard className="h-4 w-4" />
                        Información del Pago
                    </h3>
                    <div className="text-sm text-gray-700 space-y-2 bg-gray-50 p-3 rounded flex-1 text-left">
                        <div>
                            <span className="text-gray-600">Método:</span>
                            <span className="ml-2 font-medium">{getPaymentMethodLabel(orderData.paymentMethod)}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Estado:</span>
                            <span className="ml-2">
                               {orderData.isPaid ? (
                                   <span className="text-green-600 font-medium">✓ Pagado</span>
                               ) : (
                                   <span className="text-amber-600 font-medium">⚬ Pendiente</span>
                               )}
                           </span>
                        </div>
                        {orderData.paidAt && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 pt-1 border-t border-gray-200">
                                <Calendar className="h-3 w-3" />
                                Pagado: {formatDate(orderData.paidAt)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabla de estado de entrega - solo si está pagado */}
            {orderData.isPaid && (
                <div className="mb-6 bg-gray-50 border border-gray-300 pt-2">
                    <h3 className="font-semibold text-gray-900 mb-3 text-left pl-4 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Estado de Entrega
                    </h3>
                    <div className="p-4 rounded">
                        <div className="flex justify-between gap-4 text-sm">
                            <div>
                                <span className="text-gray-600 block">Estado:</span>
                                <span className="font-medium">
                                   {orderData.isDelivered ? (
                                       <span className="text-green-600">✓ Entregado</span>
                                   ) : (
                                       <span className="text-amber-600">📦 En tránsito</span>
                                   )}
                               </span>
                            </div>
                            <div>
                                <span className="text-gray-600 block">Fecha de envío:</span>
                                <span className="font-medium text-gray-900">
                                   {orderData.paidAt ? formatDate(orderData.paidAt) : '-'}
                               </span>
                            </div>
                            <div>
                                <span className="text-gray-600 block">Entrega estimada:</span>
                                <span className="font-medium text-gray-900">2-3 días hábiles</span>
                            </div>
                            {orderData.deliveredAt && (
                                <div>
                                    <span className="text-gray-600 block">Fecha de entrega:</span>
                                    <span className="font-medium text-green-600">
                                       {formatDate(orderData.deliveredAt)}
                                   </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Resumen de precios */}
            <div className="mb-6">
                <div className="bg-gray-50 border border-gray-300 p-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal productos:</span>
                            <span className="font-mono">{formatPrice(orderData.itemsPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Gastos de envío:</span>
                            <span className="font-mono">
                               {orderData.shippingPrice === 0 ? 'GRATIS' : formatPrice(orderData.shippingPrice)}
                           </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">IVA (21%):</span>
                            <span className="font-mono">{formatPrice(orderData.taxPrice)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between text-lg font-bold">
                            <span className="text-gray-900">TOTAL:</span>
                            <span className="font-mono text-xl">{formatPrice(orderData.totalPrice)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Términos y condiciones - solo para pedidos activos */}
            {!orderData.isPaid && orderData.status === 'pending' && (
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="terms"
                                    checked={agreedToTerms}
                                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                                />
                                <div className="text-sm">
                                    <label htmlFor="terms" className="cursor-pointer">
                                        He leído y acepto los{' '}
                                        <a href="/terminos" className="text-primary hover:underline font-medium">
                                            términos y condiciones
                                        </a>{' '}
                                        de la tienda
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="privacy"
                                    checked={agreedToPrivacy}
                                    onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
                                />
                                <div className="text-sm">
                                    <label htmlFor="privacy" className="cursor-pointer">
                                        Acepto la{' '}
                                        <a href="/privacidad" className="text-primary hover:underline font-medium">
                                            política de privacidad
                                        </a>{' '}
                                        y el procesamiento de mis datos personales
                                    </label>
                                </div>
                            </div>

                            {!canProceedToPayment && (
                                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="text-sm">
                                       Debes aceptar todos los términos para continuar
                                   </span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Кнопки оплаты - только для pending заказов */}
            {!orderData.isPaid && orderData.status === 'pending' && (
                <div className="border-t-2 border-gray-900 pt-6">
                    <div className="flex gap-4">
                        <Button
                            onClick={async () => {
                                startTransition(async () => {
                                    try {
                                        await returnOrderToCart(orderData.id, userId);
                                        toast.success('Productos devueltos', {
                                            description: 'Los productos han sido devueltos al carrito'
                                        });
                                        if (onReturnToCart) onReturnToCart();
                                    } catch (error) {
                                        toast.error('Error', {
                                            description: 'No se pudieron devolver los productos al carrito'
                                        });
                                    }
                                });
                            }}
                            disabled={isPending}
                            variant="outline"
                            size="lg"
                            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Volver al carrito
                        </Button>

                        <Button
                            onClick={handlePayment}
                            disabled={!canProceedToPayment || isPending}
                            size="lg"
                            className="flex-[2] bg-green-600 hover:bg-green-700 text-white font-semibold py-4"
                        >
                            {isPending ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-5 w-5 mr-2" />
                                    CONFIRMAR PAGO {formatPrice(orderData.totalPrice)}
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="text-center text-sm text-gray-500 mt-3">
                        🔒 Pago 100% seguro y encriptado SSL
                    </div>
                </div>
            )}

            {/* Mensaje si está cancelado */}
            {orderData.status === 'cancelled' && (
                <div className="border-t-2 border-red-600 pt-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-red-800">Pedido Cancelado</h3>
                        <p className="text-sm text-red-700 mt-1">
                            Este pedido ha sido cancelado
                        </p>
                        <p className="text-xs text-red-600 mt-2">
                            Los productos han sido devueltos al inventario
                        </p>
                    </div>
                </div>
            )}

            {/* Mensaje si ya está pagado */}
            {orderData.isPaid && (
                <div className="border-t-2 border-green-600 pt-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-green-800">Pedido Confirmado</h3>
                        <p className="text-sm text-green-700 mt-1">
                            El pago ha sido procesado exitosamente
                        </p>
                        {orderData.paidAt && (
                            <p className="text-xs text-green-600 mt-2">
                                Fecha de pago: {formatDate(orderData.paidAt)}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default OrdenTable;