import { create } from 'zustand';
import { ServiceOrder } from '../data/servicesData';
import { useNotificationStore } from './notificationStore';

interface ServiceOrderState {
  orders: ServiceOrder[];
  setOrders: (orders: ServiceOrder[]) => void;
  createOrder: (order: ServiceOrder) => void;
  advanceOrderStatus: (orderId: string, currentStatus: ServiceOrder['status']) => ServiceOrder['status'] | null;
}

export const useServiceOrderStore = create<ServiceOrderState>((set, get) => ({
  orders: [],

  setOrders: (orders) => set({ orders }),

  createOrder: (order) => {
    set((state) => ({
      orders: [order, ...state.orders],
    }));

    useNotificationStore.getState().push({
      type: 'service',
      severity: order.priority === 'Urgent' ? 'urgent' : 'info',
      title: 'New service order received',
      message: `Order #${order.id} for ${order.guestName} (Room ${order.roomNumber}) · ${order.department}`,
      meta: order.id,
      source: 'action',
      navigateTo: '/admin/services',
    });
  },

  advanceOrderStatus: (orderId, currentStatus) => {
    let nextStatus: ServiceOrder['status'] = 'In Prep';
    if (currentStatus === 'Received') nextStatus = 'In Prep';
    else if (currentStatus === 'In Prep') nextStatus = 'Dispatched';
    else if (currentStatus === 'Dispatched') nextStatus = 'Completed';
    else return null;

    const order = get().orders.find((o) => o.id === orderId);
    if (!order) return null;

    set((state) => ({
      orders: state.orders.map((ord) =>
        ord.id === orderId ? { ...ord, status: nextStatus } : ord
      ),
    }));

    useNotificationStore.getState().push({
      type: 'service',
      severity: nextStatus === 'Completed' ? 'success' : 'info',
      title: `Service order ${nextStatus === 'Completed' ? 'completed' : 'advanced'}`,
      message: `Order #${orderId} for ${order.guestName} (Room ${order.roomNumber}) is now ${nextStatus}`,
      meta: orderId,
      source: 'action',
      navigateTo: '/admin/services',
    });

    return nextStatus;
  },
}));