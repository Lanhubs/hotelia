import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../lib/api';

export interface BookingFilters {
  searchQuery?: string;
  channelCategory?: string;
  status?: string;
  timeframe?: string;
  sortBy?: string;
}

function mapBookingRecord(row: any): any {
  if (!row) return row;
  const num = (v: any, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };
  return {
    id: row.id,
    reference: row.reference,
    folioNumber: row.folio_number || row.folioNumber,
    channel: row.channel,
    channelCategory: row.channel_category || row.channelCategory,
    channelLabel: row.channel_label || row.channelLabel,
    bookedAt: row.booked_at || row.bookedAt || row.created_at,
    handledBy: row.handled_by || row.handledBy || 'System',
    status: row.status,
    guest: {
      name: row.guest_name || row.guestName,
      email: row.guest_email || row.guestEmail,
      phone: row.guest_phone || row.guestPhone,
      avatar: row.guest_avatar || row.guestAvatar,
      vipTier: row.vip_tier || row.vipTier || 'Standard',
      nationality: row.nationality,
      idType: row.id_type || row.idType,
      idNumber: row.id_number || row.idNumber,
      specialRequests: row.special_requests || row.specialRequests,
    },
    room: {
      id: row.room_id || row.roomId,
      name: row.room_name || row.roomName,
      category: row.room_category || row.roomCategory,
      roomNumber: row.room_number || row.roomNumber,
      floor: row.floor,
      heroImage: row.hero_image || row.heroImage,
      tagline: row.tagline,
    },
    stay: {
      checkInDate: row.check_in_date || row.checkInDate,
      checkInTime: row.check_in_time || row.checkInTime || '14:00',
      checkOutDate: row.check_out_date || row.checkOutDate,
      checkOutTime: row.check_out_time || row.checkOutTime || '11:00',
      nights: num(row.nights, 1),
      adults: num(row.adults, 2),
      children: num(row.children, 0),
    },
    financials: {
      ratePerNight: num(row.rate_per_night),
      roomTotal: num(row.room_total),
      taxAmount: num(row.tax_amount),
      serviceFee: num(row.service_fee, 15),
      addonsTotal: num(row.addons_total),
      discountAmount: num(row.discount_amount),
      totalAmount: num(row.total_amount),
      amountPaid: num(row.amount_paid),
      balanceDue: num(row.balance_due),
      currency: row.currency || 'USD',
      paymentStatus: row.payment_status || row.paymentStatus || 'Pending',
      paymentMethod: row.payment_method || row.paymentMethod,
      transactionRef: row.transaction_ref || row.transactionRef,
    },
    keycard: {
      status: row.keycard_status || 'Not Issued',
      cardUid: row.card_uid || row.cardUid,
      issuedAt: row.issued_at || row.issuedAt,
      issuedBy: row.issued_by || row.issuedBy,
    },
    addons: row.addons || [],
    notes: row.notes || [],
  };
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
    queryFn: () => Api.get<any[]>(`/admin/bookings?${queryParams.toString()}`)
      .then((rows) => (rows || []).map(mapBookingRecord))
      .catch(() => []),
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
