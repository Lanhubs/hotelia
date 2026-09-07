import { useQuery } from '@tanstack/react-query'
import { getHotel, getGallery } from '../api/hotel'
import { queryKeys } from '../api/queries'
import { getExtras } from '../api/bookings'

export function useHotel() {
  return useQuery({ queryKey: queryKeys.hotel, queryFn: getHotel })
}

export function useGallery() {
  return useQuery({ queryKey: queryKeys.gallery, queryFn: getGallery })
}

export function useExtras() {
  return useQuery({ queryKey: queryKeys.extras, queryFn: getExtras })
}