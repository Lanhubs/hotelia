import { apiGet, apiPost } from './client'
import type { PaymentInit, PaymentVerify, PaymentMethod } from './types'

/** Initialize a Paystack payment transaction */
export function initializePayment(
  bookingReference: string,
  amount: number,
  method: PaymentMethod,
  idempotencyKey?: string,
): Promise<PaymentInit> {
  return apiPost<PaymentInit>(
    '/payments/initialize',
    { bookingReference, amount, method },
    idempotencyKey,
  )
}

/** Verify a Paystack transaction by its reference (safe to call repeatedly) */
export function verifyPayment(reference: string): Promise<PaymentVerify> {
  return apiGet<PaymentVerify>(`/payments/${encodeURIComponent(reference)}/verify`)
}

export function chargeCard(data: {
  bookingReference: string
  card: { number: string; cvv: string; expiry_month: string; expiry_year: string }
  pin?: string
}) {
  return apiPost<{ status: string; reference: string; displayText?: string; url?: string }>('/payments/charge', data)
}

export function submitPin(reference: string, pin: string) {
  return apiPost<{ status: string; reference: string; displayText?: string }>('/payments/submit-pin', { reference, pin })
}

export function submitOtp(reference: string, otp: string) {
  return apiPost<{ status: string; reference: string; displayText?: string }>('/payments/submit-otp', { reference, otp })
}

export function submitPhone(reference: string, phone: string) {
  return apiPost<{ status: string; reference: string; displayText?: string }>('/payments/submit-phone', { reference, phone })
}

export function submitBirthday(reference: string, birthday: string) {
  return apiPost<{ status: string; reference: string; displayText?: string }>('/payments/submit-birthday', { reference, birthday })
}