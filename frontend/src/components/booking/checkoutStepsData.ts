export const CHECKOUT_STEPS = ['Review', 'Guest', 'Extras', 'Payment'] as const

export type CheckoutStep = (typeof CHECKOUT_STEPS)[number]