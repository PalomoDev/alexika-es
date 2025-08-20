export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
};

export const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

export const getPaymentMethodLabel = (method: string) => {
    const methods: { [key: string]: string } = {
        stripe: 'Tarjeta de crédito/débito',
        paypal: 'PayPal',
        bizum: 'Bizum',
        crypto: 'Criptomonedas',
        cash: 'Contra reembolso'
    };
    return methods[method] || method;
};

export const getStatusBadge = (status: string) => {
    const statusConfig = {
        pending: { label: 'Pendiente', variant: 'secondary' as const },
        processing: { label: 'Procesando', variant: 'default' as const },
        shipped: { label: 'Enviado', variant: 'default' as const },
        delivered: { label: 'Entregado', variant: 'default' as const },
        cancelled: { label: 'Cancelado', variant: 'destructive' as const }
    };
    return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
};