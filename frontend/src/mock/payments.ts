import type { PaymentInit, PaymentVerify, PaymentState, PaymentMethod, TransferInstructions } from '../api/types'
import { db } from './db'
import { PAYMENT_PROVIDER, MOCK_TRANSFER_BANK } from './seed/hotel'

export function initPayment(
  bookingReference: string,
  amount: number,
  method: PaymentMethod = 'card',
): PaymentInit {
  const reference = `PAY-${Math.floor(100000 + Math.random() * 900000)}`
  const transferInstructions: TransferInstructions | undefined =
    method === 'transfer'
      ? {
          provider: PAYMENT_PROVIDER,
          bankName: MOCK_TRANSFER_BANK.bankName,
          accountName: MOCK_TRANSFER_BANK.accountName,
          accountNumber: MOCK_TRANSFER_BANK.accountNumber,
          reference,
          amount,
          expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        }
      : undefined

  db.mutate((d) => {
    d.payments.unshift({
      reference,
      amount,
      gateway: method === 'transfer' ? PAYMENT_PROVIDER : 'mock-gateway',
      method,
      outcome: 'pending',
      bookingReference,
      createdAt: new Date().toISOString(),
    })
    const booking = d.bookings.find((b) => b.reference === bookingReference)
    if (booking && method === 'transfer') {
      booking.paymentMethod = 'transfer'
      booking.transferInstructions = transferInstructions
    }
  })

  return {
    reference,
    gateway: method === 'transfer' ? PAYMENT_PROVIDER : 'mock-gateway',
    redirectUrl: '',
    amount,
    method,
    transferInstructions,
  }
}

export function simulatePayment(reference: string, outcome: PaymentState): void {
  db.mutate((d) => {
    const payment = d.payments.find((p) => p.reference === reference)
    if (!payment) return
    payment.outcome = outcome

    if (outcome === 'success' && payment.bookingReference) {
      const booking = d.bookings.find((b) => b.reference === payment.bookingReference)
      if (!booking) return

      const paid = Math.min(payment.amount, booking.financials.totalAmount)
      booking.financials.amountPaid = paid
      booking.financials.balanceDue = booking.financials.totalAmount - paid
      booking.paidAt = new Date().toISOString()

      if (payment.method === 'transfer') {
        booking.status = 'Confirmed'
        booking.paymentMethod = 'transfer'
        booking.paymentState = 'success'
      } else if (booking.paymentMethod === 'pay_at_hotel') {
        booking.status = 'Confirmed'
        booking.paymentState = 'pay_at_hotel'
        booking.depositPaid = paid > 0
        booking.financials.depositAmount = paid
      } else {
        booking.status = 'Confirmed'
        booking.paymentState = 'success'
        booking.paymentMethod = 'card'
      }
    }
  })
}

export function confirmTransfer(reference: string): void {
  const data = db.load()
  const booking = data.bookings.find((b) => b.reference.toLowerCase() === reference.toLowerCase())
  if (!booking || !booking.transferInstructions) return
  simulatePayment(booking.transferInstructions.reference, 'success')
}

export function verifyPayment(reference: string): PaymentVerify {
  const data = db.load()
  const payment = data.payments.find((p) => p.reference === reference)
  if (!payment) {
    return { state: 'pending', reference, amount: 0 }
  }
  return {
    state: payment.outcome,
    reference,
    amount: payment.amount,
    paidAt: payment.outcome === 'success' ? payment.createdAt : undefined,
  }
}