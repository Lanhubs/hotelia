import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../lib/api';
import type { Event, EventBooking, EventFilters, BookingFilters, EventStats } from '../stores/eventsStore';

export function useEventsApi() {
  const queryClient = useQueryClient();

  const eventsQuery = useQuery({
    queryKey: ['admin-events'],
    queryFn: () => Api.get<Event[]>('/admin/events'),
  });

  const statsQuery = useQuery({
    queryKey: ['admin-events-stats'],
    queryFn: () => Api.get<EventStats>('/admin/events/stats'),
  });

  const createEventMutation = useMutation({
    mutationFn: (data: Partial<Event>) => Api.post('/admin/events', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['admin-events-stats'] });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Event>) => Api.put(`/admin/events/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['admin-events-stats'] });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => Api.delete(`/admin/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['admin-events-stats'] });
    },
  });

  const eventOccurrencesQuery = ({ eventId, rangeStart, rangeEnd }: { eventId: string; rangeStart: string; rangeEnd: string }) => 
    useQuery({
      queryKey: ['admin-event-occurrences', eventId, rangeStart, rangeEnd],
      queryFn: () => Api.get<Event[]>(`/admin/events/${eventId}/occurrences?rangeStart=${rangeStart}&rangeEnd=${rangeEnd}`),
      enabled: !!eventId && !!rangeStart && !!rangeEnd,
    });

  const eventBookingsQuery = ({ eventId, filters }: { eventId: string; filters?: BookingFilters }) => 
    useQuery({
      queryKey: ['admin-event-bookings', eventId, filters],
      queryFn: () => Api.get<EventBooking[]>(`/admin/events/${eventId}/bookings`),
      enabled: !!eventId,
    });

  const updateBookingMutation = useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: string }) => 
      Api.put(`/admin/events/bookings/${bookingId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-event-bookings'] });
    },
  });

  const checkInBookingMutation = useMutation({
    mutationFn: (bookingId: string) => Api.post(`/admin/events/bookings/${bookingId}/checkin`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-event-bookings'] });
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => Api.post(`/admin/events/bookings/${bookingId}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-event-bookings'] });
    },
  });

  return {
    events: eventsQuery.data || [],
    stats: statsQuery.data,
    isLoadingEvents: eventsQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,
    createEvent: createEventMutation.mutateAsync,
    updateEvent: updateEventMutation.mutateAsync,
    deleteEvent: deleteEventMutation.mutateAsync,
    eventOccurrencesQuery,
    eventBookingsQuery,
    updateBooking: updateBookingMutation.mutateAsync,
    checkInBooking: checkInBookingMutation.mutateAsync,
    cancelBooking: cancelBookingMutation.mutateAsync,
  };
}