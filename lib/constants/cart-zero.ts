import {ClientCart} from "@/lib/validations/cart/cart-validation";

export const CART_ZERO: ClientCart = {
    id: crypto.randomUUID(),
    userId: null,
    sessionCartId: crypto.randomUUID(),
    items: [],
    itemsPrice: '0.00',
    totalPrice: '0.00',
    shippingPrice: '0.00',
    taxPrice: '0.00',
    createdAt: new Date(),
    updatedAt: new Date()
};

export const SHIPPING_COEFFICIENT = 12
export const TAX_PRICE = 0.19