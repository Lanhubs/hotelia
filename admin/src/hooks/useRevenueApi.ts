import { useQuery } from '@tanstack/react-query';
import Api from '../lib/api';

export function useRevenueDashboardApi() {
  return useQuery({
    queryKey: ['revenue-dashboard'],
    queryFn: () => Api.get<any>('/admin/revenue/dashboard'),
  });
}

export function useRevenueTransactionsApi(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['revenue-transactions', page, limit],
    queryFn: () => Api.get<any>(`/admin/revenue/transactions?page=${page}&limit=${limit}`),
  });
}

export function useRevenueReportsApi(timeframe = 'week') {
  return useQuery({
    queryKey: ['revenue-reports', timeframe],
    queryFn: () => Api.get<any>(`/admin/revenue/reports?timeframe=${timeframe}`),
  });
}
