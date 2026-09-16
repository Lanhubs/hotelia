import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../lib/api';

export function useServicesApi() {
  const queryClient = useQueryClient();

  const menuQuery = useQuery({
    queryKey: ['service-menu'],
    queryFn: () => Api.get<any[]>('/admin/services/menu'),
  });

  const ordersQuery = useQuery({
    queryKey: ['service-orders'],
    queryFn: () => Api.get<any[]>('/admin/services/orders'),
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      Api.post(`/admin/services/orders/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service-orders'] }),
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: any) => Api.post('/admin/services/orders', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service-orders'] }),
  });

  const createMenuItemMutation = useMutation({
    mutationFn: (data: any) => Api.post('/admin/services/menu', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service-menu'] }),
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      Api.put(`/admin/services/menu/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service-menu'] }),
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: (id: string) => Api.delete(`/admin/services/menu/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service-menu'] }),
  });

  return {
    menu: menuQuery.data || [],
    orders: ordersQuery.data || [],
    isLoadingMenu: menuQuery.isLoading,
    isLoadingOrders: ordersQuery.isLoading,
    updateOrderStatus: updateOrderStatusMutation.mutateAsync,
    createOrder: createOrderMutation.mutateAsync,
    createMenuItem: createMenuItemMutation.mutateAsync,
    updateMenuItem: updateMenuItemMutation.mutateAsync,
    deleteMenuItem: deleteMenuItemMutation.mutateAsync,
  };
}
