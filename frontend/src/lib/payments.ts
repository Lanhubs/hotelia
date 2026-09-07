import type { Booking } from '../api/types'

export function paymentMethodLabel(booking: Booking): string {
  switch (booking.paymentMethod) {
    case 'card':
      return 'Card payment'
    case 'transfer':
      return booking.paymentState === 'success' ? 'Bank transfer' : 'Bank transfer (awaiting verification)'
    case 'pay_at_hotel':
      return booking.financials.amountPaid > 0 ? 'Deposit by card · balance at check-in' : 'Pay at hotel (check-in)'
    default:
      return 'Payment method not chosen'
  }
}