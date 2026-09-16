import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../lib/api';

export function useRoomsApi() {
  const queryClient = useQueryClient();

  const roomsQuery = useQuery({
    queryKey: ['rooms'],
    queryFn: () => Api.get<any[]>('/rooms'),
  });

  const availabilityQuery = useQuery({
    queryKey: ['availability'],
    queryFn: () => Api.get<any>('/availability'),
  });

  const createRoomMutation = useMutation({
    mutationFn: (data: any) => Api.post('/rooms', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });

  const updateRoomMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => Api.put(`/rooms/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });

  const deleteRoomMutation = useMutation({
    mutationFn: (id: string) => Api.delete(`/rooms/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });

  return {
    rooms: roomsQuery.data || [],
    availability: availabilityQuery.data || null,
    isLoadingRooms: roomsQuery.isLoading,
    isLoadingAvailability: availabilityQuery.isLoading,
    createRoom: createRoomMutation.mutateAsync,
    updateRoom: updateRoomMutation.mutateAsync,
    deleteRoom: deleteRoomMutation.mutateAsync,
  };
}

export function useRoomDetailApi(slug: string) {
  return useQuery({
    queryKey: ['room', slug],
    queryFn: () => Api.get<any>(`/rooms/${slug}`),
    enabled: !!slug,
  });
}

/** Polls room availability every 20 s while the walk-in form is open. */
export function useRoomAvailabilityApi(
  slugOrId: string,
  checkIn: string,
  checkOut: string
) {
  const enabled = Boolean(slugOrId && checkIn && checkOut);
  return useQuery<{ available: boolean; availableUnits: number; roomId: string; roomName: string }>({
    queryKey: ['room-availability', slugOrId, checkIn, checkOut],
    queryFn: () =>
      Api.get(`/rooms/${encodeURIComponent(slugOrId)}/availability?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`),
    enabled,
    refetchInterval: 20_000,
    refetchIntervalInBackground: false,
    staleTime: 0,
    retry: 1,
  });
}
