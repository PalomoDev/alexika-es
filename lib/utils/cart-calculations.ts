// lib/utils/cart-calculations.ts
import {CartItem} from "@/lib/validations/cart/cart-validation";
import {SHIPPING_COEFFICIENT, TAX_PRICE} from "@/lib/constants/cart-zero";

export const calculateItemTotal = (price: string, qty: number): string => {
    return (parseFloat(price) * qty).toFixed(2);
};

export const formatPrice = (price: string | number): string => {
    return `$${Number(price).toFixed(2)}`;
};

export const calculateTax = (price: string | number): string => {
    return (Number(price) * TAX_PRICE).toFixed(2);
};

export const calculateTotalWeight = (items: CartItem[], quantities?: Record<string, number>): number => {
    const totalWeight = items.reduce((total, item) => {
        const qty = quantities ? quantities[item.id] : item.qty;
        return total + (item.weight * qty);
    }, 0);
    return Number(totalWeight.toFixed(1));
};

export const calculateItemsPrice = (items: CartItem[], quantities?: Record<string, number>): string => {
    return items.reduce((total, item) => {
        const qty = quantities ? quantities[item.id] : item.qty;
        return total + (parseFloat(item.price) * qty);
    }, 0).toFixed(2);
};

export const calculateShippingCost = (itemsPrice: string | number, totalWeight: number): string => {
    return Number(itemsPrice) >= 50
        ? "0.00"
        : (totalWeight * SHIPPING_COEFFICIENT).toFixed(2);
};

export const calculateTotalPrice = (itemsPrice: string | number, tax: string | number, shipping: string | number): string => {
    return (Number(itemsPrice) + Number(tax) + Number(shipping)).toFixed(2);
};

export const calculateCartSummary = (items: CartItem[], quantities?: Record<string, number>) => {
    const itemsPrice = calculateItemsPrice(items, quantities);
    const tax = calculateTax(itemsPrice);
    const totalWeight = calculateTotalWeight(items, quantities);
    const shipping = calculateShippingCost(itemsPrice, totalWeight);
    const totalPrice = calculateTotalPrice(itemsPrice, tax, shipping);
    const itemsCount = items.reduce((total, item) => {
        const qty = quantities ? quantities[item.id] : item.qty;
        return total + qty;
    }, 0);

    return {
        itemsPrice,
        tax,
        shipping,
        totalWeight,
        totalPrice,
        itemsCount
    };
};

export const getCartUpdates = (items: CartItem[], localQuantities: Record<string, number>) => {
    return items
        .map(item => {
            const currentQty = item.qty;
            const newQty = localQuantities[item.id];

            if (currentQty !== newQty) {
                return {
                    itemId: item.id,
                    currentQty,
                    newQty,
                    name: item.name,
                    sku: item.sku
                };
            }
            return null;
        })
        .filter(Boolean);
};