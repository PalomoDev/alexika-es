import { Suspense } from 'react';
import { Mail, Clock, Package, CheckCircle } from 'lucide-react';
import PaymentActions from './PaymentActions';

interface PaymentPageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{
        orderId?: string;
    }>;
}

async function PaymentPage({ params, searchParams }: PaymentPageProps) {
    const { slug } = await params;
    const { orderId } = await searchParams;

    return (
        <div className="max-w-2xl mx-auto text-center space-y-6">
            {/* Icono principal */}
            <div className="flex justify-center">
                <div className="bg-blue-100 p-4 rounded-full">
                    <Package className="h-12 w-12 text-blue-600" />
                </div>
            </div>

            {/* Título principal */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">
                    ¡Gracias por tu pedido!
                </h1>
                <p className="text-lg text-gray-600">
                    Pedido #{orderId?.slice(-8).toUpperCase()}
                </p>
            </div>

            {/* Mensaje principal */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
                <h2 className="text-lg font-semibold text-blue-900 mb-3">
                    Estamos preparando nuestro lanzamiento
                </h2>
                <p className="text-blue-800 leading-relaxed">
                    Actualmente nuestro equipo está trabajando intensamente para llenar nuestro almacén,
                    establecer acuerdos con los mejores proveedores y perfeccionar todos los procesos
                    para ofrecerte la mejor experiencia de compra.
                </p>
            </div>

            {/* Información del proceso */}
            <div className="space-y-4">
                <div className="flex items-start gap-3 text-left">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-gray-900">Tu pedido está guardado</p>
                        <p className="text-sm text-gray-600">
                            Hemos registrado tu pedido con el método de pago <strong>{slug}</strong>
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 text-left">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-gray-900">Te contactaremos pronto</p>
                        <p className="text-sm text-gray-600">
                            En cuanto estemos operativos, te enviaremos un correo con las instrucciones
                            para completar tu pago de forma segura.
                            <a href="/verificar-email" className="text-blue-600 hover:underline font-medium ml-1">
                                Confirma tu correo aquí
                            </a>
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 text-left">
                    <Clock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-gray-900">Tiempo estimado</p>
                        <p className="text-sm text-gray-600">
                            Te notificaremos tan pronto como estemos listos
                        </p>
                    </div>
                </div>
            </div>

            {/* Confirmación de email */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                    <strong>Importante:</strong> Asegúrate de que tu dirección de correo electrónico
                    esté confirmada para recibir nuestras notificaciones sobre el estado de tu pedido.
                </p>
            </div>

            {/* Компонент с кнопками */}
            <PaymentActions orderId={orderId} />

            {/* Mensaje de agradecimiento */}
            <div className="pt-4">
                <p className="text-gray-600">
                    Gracias por tu confianza en nosotros. ¡Estamos emocionados de poder servirte pronto!
                </p>
            </div>
        </div>
    );
}

export default function PaymentPageWrapper(props: PaymentPageProps) {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="wrapper mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <PaymentPage {...props} />
                </div>
            </div>
        </Suspense>
    );
}