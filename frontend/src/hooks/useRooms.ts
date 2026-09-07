import { useQuery } from '@tanstack/react-query'
import { getRooms, getRoom } from '../api/rooms'
import { queryKeys } from '../api/queries'

export function useRooms() {
  return useQuery({
    queryKey: queryKeys.rooms,
    queryFn: getRooms,
  })
}

export function useRoom(slug: string) {
  return useQuery({
    queryKey: queryKeys.room(slug),
    queryFn: () => getRoom(slug),
    enabled: Boolean(slug),
  })
}