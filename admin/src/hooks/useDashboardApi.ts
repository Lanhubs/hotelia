import { useQuery } from '@tanstack/react-query';
import Api from '../lib/api';

export interface DashboardOverviewResponse {
  kpis: any[];
  onlineStats: any;
  offlineStats: any;
  roomStatusItems: any[];
  latestBookings?: any[];
  totalRevenueUSD: number;
}

export function useDashboardApi() {
  const overviewQuery = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: () => Api.get<DashboardOverviewResponse>('/admin/dashboard/overview'),
  });

  const bookingsQuery = useQuery({
    queryKey: ['dashboardBookings'],
    queryFn: () => Api.get<any>('/admin/bookings'),
  });

  const rawBookings = bookingsQuery.data;
  const bookingsArray: any[] = Array.isArray(rawBookings)
    ? rawBookings
    : Array.isArray((rawBookings as any)?.bookings)
    ? (rawBookings as any).bookings
    : [];

  return {
    overview: overviewQuery.data,
    bookings: bookingsArray,
    isLoading: overviewQuery.isLoading || bookingsQuery.isLoading,
    refetchAll: () => {
      overviewQuery.refetch();
      bookingsQuery.refetch();
    },
  };
}
