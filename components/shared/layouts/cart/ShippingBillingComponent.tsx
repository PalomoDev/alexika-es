'use client'
import {useState} from "react";
import {UserBase} from "@/lib/validations/product/base";
import {ShippingAddressForm} from "@/components/shared/layouts/user/ShippingAddressForm";
import PaymentMethodForm from "@/components/shared/layouts/user/PaymentMethodForm";
import {ShippingAddress} from "@/lib/validations/user/address-validation";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ROUTES} from "@/lib/constants/routes";

interface ShippingBillingComponentProps {
    user?: UserBase
}

const ShippingBillingComponent = ({user}: ShippingBillingComponentProps) => {
    const [address, setAddress] = useState<boolean>(false)
    const [payment, setPayment] = useState<boolean>(false)

    if(!user) return null

    const handleAddress = (address: ShippingAddress) => {
        if(address) setAddress(true)
    }

    const handlePaymentMethod = () => {
        setPayment(true)
    }

    return (
        <div className="text-gray-600 mb-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 text-left">Datos de Envío y Pago</h1>
            <ShippingAddressForm user={user} onAddressSaved={handleAddress}/>
            <PaymentMethodForm user={user} paymentSaved={handlePaymentMethod}/>
            <Link href={`${ROUTES.PAGES.CART}/order-confirmation`}>
                <Button
                    className="w-full bg-brand hover:bg-brand-hover text-white disabled:bg-brand-muted disabled:cursor-not-allowed"
                    disabled={!address || !payment}
                    size="lg"
                >
                    Revisar y Confirmar Pedido
                </Button>
            </Link>
        </div>
    )
}

export default ShippingBillingComponent