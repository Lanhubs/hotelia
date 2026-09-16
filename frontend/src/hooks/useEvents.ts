import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEvents, getEvent, createEventBooking, getEventBooking, cancelEventBooking } from '../api/events'
import { queryKeys } from '../api/queries'
import type { EventBooking } from '../api/types'

export function useEvents() {
  return useQuery({ queryKey: queryKeys.events, queryFn: getEvents })
}

export function useEvent(slug: string) {
  return useQuery({
    queryKey: queryKeys.event(slug),
    queryFn: () => getEvent(slug),
    enabled: Boolean(slug),
  })
}

export function useCreateEventBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: Partial<EventBooking> }) => 
      createEventBooking(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events })
    },
  })
}

export function useEventBooking(reference: string) {
  return useQuery({
    queryKey: ['eventBooking', reference],
    queryFn: () => getEventBooking(reference),
    enabled: Boolean(reference),
  })
}

export function useCancelEventBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reference: string) => cancelEventBooking(reference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events })
    },
  })
}