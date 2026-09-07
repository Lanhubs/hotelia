import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { initializePayment, verifyPayment } from '../api/payments'
import { setBookingPaymentMethod, confirmTransfer } from '../api/bookings'
import type { PaymentMethod } from '../api/types'
import { queryKeys } from '../api/queries'

export function useInitializePayment() {
  return useMutation({
    mutationFn: ({
      bookingReference,
      amount,
      method,
      idempotencyKey,
    }: {
      bookingReference: string
      amount: number
      method: PaymentMethod
      idempotencyKey?: string
    }) => initializePayment(bookingReference, amount, method, idempotencyKey),
  })
}

export function useVerifyPaymentMutation() {
  return useMutation({
    mutationFn: (reference: string) => verifyPayment(reference),
  })
}

export function useSetPaymentMethod() {
  return useMutation({
    mutationFn: ({ reference, method, depositAmount }: { reference: string; method: PaymentMethod; depositAmount?: number }) =>
      setBookingPaymentMethod(reference, method, depositAmount),
  })
}

export function useConfirmTransfer() {
  return useMutation({
    mutationFn: (reference: string) => confirmTransfer(reference),
  })
}

export function useVerifyPayment(reference: string | null) {
  return useQuery({
    queryKey: queryKeys.payment(reference ?? ''),
    queryFn: () => verifyPayment(reference as string),
    enabled: Boolean(reference),
  })
}

export function useInvalidateReservation() {
  const client = useQueryClient()
  return (reference: string) => {
    client.invalidateQueries({ queryKey: queryKeys.reservation(reference) })
    client.invalidateQueries({ queryKey: ['availability'] })
  }
}