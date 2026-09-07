import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cancelReservation, createBooking, getReservation } from '../api/bookings'
import type { CreateBookingPayload } from '../api/bookings'
import { queryKeys } from '../api/queries'

export function useCreateBooking() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (args: CreateBookingPayload | { payload: CreateBookingPayload; idempotencyKey?: string }) => {
      if ('payload' in args) {
        return createBooking(args.payload, args.idempotencyKey)
      }
      return createBooking(args)
    },
    onSuccess: (booking) => {
      client.setQueryData(queryKeys.reservation(booking.reference), booking)
    },
  })
}

export function useReservation(reference: string | null, email?: string, phone?: string) {
  return useQuery({
    queryKey: queryKeys.reservation(reference ?? ''),
    queryFn: () => getReservation(reference as string, email, phone),
    enabled: Boolean(reference),
  })
}

export function useCancelReservation() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: cancelReservation,
    onSuccess: (booking) => {
      if (booking) client.setQueryData(queryKeys.reservation(booking.reference), booking)
    },
  })
}