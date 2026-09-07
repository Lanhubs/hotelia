import { useQuery } from '@tanstack/react-query'
import { getServices, getService } from '../api/services'
import { queryKeys } from '../api/queries'

export function useServices() {
  return useQuery({ queryKey: queryKeys.services, queryFn: getServices })
}

export function useService(slug: string) {
  return useQuery({
    queryKey: queryKeys.service(slug),
    queryFn: () => getService(slug),
    enabled: Boolean(slug),
  })
}