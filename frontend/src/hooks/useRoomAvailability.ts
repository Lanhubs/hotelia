import { useQuery } from '@tanstack/react-query'
import { getRoomAvailability, type RoomAvailabilityResult } from '../api/rooms'
import { queryKeys } from '../api/queries'
import { isValidRange } from '../lib/dates'

const POLL_INTERVAL_MS = 30_000 // 30 seconds

interface UseRoomAvailabilityOptions {
  slug: string
  checkIn: string
  checkOut: string
  /** Override poll interval (ms). Default 30 000. */
  refetchInterval?: number
}

export interface RoomAvailabilityState extends RoomAvailabilityResult {
  isChecking: boolean
  isError: boolean
}

const UNAVAILABLE_FALLBACK: RoomAvailabilityState = {
  available: false,
  availableUnits: 0,
  roomId: '',
  roomName: '',
  isChecking: false,
  isError: true,
}

/**
 * Polls the backend every 30 s to check if a specific room is still available
 * for the given date range. Only runs when slug + valid dates are provided.
 */
export function useRoomAvailability({
  slug,
  checkIn,
  checkOut,
  refetchInterval = POLL_INTERVAL_MS,
}: UseRoomAvailabilityOptions): RoomAvailabilityState {
  const enabled = Boolean(slug) && isValidRange(checkIn, checkOut)

  const { data, isLoading, isError } = useQuery<RoomAvailabilityResult>({
    queryKey: queryKeys.roomAvailability(slug, checkIn, checkOut),
    queryFn: () => getRoomAvailability(slug, checkIn, checkOut),
    enabled,
    refetchInterval,
    refetchIntervalInBackground: false,
    staleTime: 0, // always consider stale so refetch fires on focus too
    retry: 1,
  })

  if (!enabled) {
    // Dates not chosen yet — don't block the UI
    return { available: true, availableUnits: 99, roomId: slug, roomName: '', isChecking: false, isError: false }
  }

  if (isLoading) {
    return { available: true, availableUnits: 0, roomId: slug, roomName: '', isChecking: true, isError: false }
  }

  if (isError || !data) {
    // Network error — don't block booking, let server-side validate
    return UNAVAILABLE_FALLBACK
  }

  return { ...data, isChecking: false, isError: false }
}
