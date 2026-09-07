import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../lib/api';

export interface BookingFilters {
  searchQuery?: string;
  channelCategory?: string;
  status?: string;
  timeframe?: string;
  sortBy?: string;
}

export function useBookingsApi(filters?: BookingFilters) {
  const queryClient = useQueryClient();

  const queryParams = new URLSearchParams();
  if (filters?.searchQuery) queryParams.set('searchQuery', filters.searchQuery);
  if (filters?.channelCategory) queryParams.set('channelCategory', filters.channelCategory);
  if (filters?.status) queryParams.set('status', filters.status);
  if (filters?.timeframe) queryParams.set('timeframe', filters.timeframe);
  if (filters?.sortBy) queryParams.set('sortBy', filters.sortBy);

  const bookingsQuery = useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => Api.get<any[]>(`/admin/bookings?${queryParams.toString()}`).catch(() => []),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      Api.post(`/admin/bookings/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  const recordPaymentMutation = useMutation({
    mutationFn: ({ id, amount, paymentStatus }: { id: string; amount: number; paymentStatus: string }) =>
      Api.post(`/admin/bookings/${id}/payment`, { amount, paymentStatus }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  const issueKeycardMutation = useMutation({
    mutationFn: ({ id, cardUid, issuedBy }: { id: string; cardUid: string; issuedBy: string }) =>
      Api.post(`/admin/bookings/${id}/keycard`, { cardUid, issuedBy }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  return {
    bookings: bookingsQuery.data || [],
    isLoading: bookingsQuery.isLoading,
    refetchBookings: bookingsQuery.refetch,
    updateStatus: updateStatusMutation.mutateAsync,
    recordPayment: recordPaymentMutation.mutateAsync,
    issueKeycard: issueKeycardMutation.mutateAsync,
  };
}

export function useBookingDetailApi(id: string) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => Api.get<any>(`/admin/bookings/${id}`),
    enabled: !!id,
  });
}
