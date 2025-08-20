// Payment Methods Configuration
import {Banknote, Bitcoin, CreditCard, Smartphone} from "lucide-react";
import {FaCcPaypal} from "react-icons/fa";

export const PAYMENT_METHODS = [
    {
        value: 'stripe',
        label: 'Tarjeta de crédito/débito',
        description: 'Pago seguro con Stripe (Visa, Mastercard, etc.)',
        icon: CreditCard,
    },
    {
        value: 'paypal',
        label: 'PayPal',
        description: 'Paga con tu cuenta de PayPal',
        icon: FaCcPaypal,
    },
    {
        value: 'bizum',
        label: 'Bizum',
        description: 'Pago instantáneo con tu móvil',
        icon: Smartphone,
    },
    {
        value: 'crypto',
        label: 'Criptomonedas',
        description: 'Bitcoin, Ethereum y otras cryptos',
        icon: Bitcoin,
    },
    {
        value: 'cash',
        label: 'Pago contra reembolso',
        description: 'Paga al recibir tu pedido',
        icon: Banknote,
    },
] as const;