import { useQuery } from '@tanstack/react-query'
import { getEvents, getEvent } from '../api/events'
import { queryKeys } from '../api/queries'

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