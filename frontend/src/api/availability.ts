import { apiGet } from './client'
import type { AvailabilityItem, SearchParams } from './types'

export function getAvailability(params: SearchParams): Promise<AvailabilityItem[]> {
  return apiGet<AvailabilityItem[]>('/availability', {
    ...params,
  } as unknown as Record<string, string | number | boolean | undefined>)
}