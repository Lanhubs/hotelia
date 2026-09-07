import { useQuery } from '@tanstack/react-query'
import { getAvailability } from '../api/availability'
import { queryKeys } from '../api/queries'
import type { SearchParams } from '../api/types'

export function useAvailability(search: SearchParams | null) {
  const enabled = Boolean(search && search.checkIn && search.checkOut)
  return useQuery({
    queryKey: queryKeys.availability(JSON.stringify(search ?? {})),
    queryFn: () => getAvailability(search as SearchParams),
    enabled,
  })
}