import React, { useState, useEffect } from 'react';
import { SERVICE_MENU_CATALOG, ServiceMenuItem, ServiceOrder } from '../data/servicesData';
import { useBookingStore } from '../stores/bookingStore';
import { useServiceOrderStore } from '../stores/serviceOrderStore';
import { useServicesApi } from '../hooks/useServicesApi';
import { ServiceToast } from '../components/services/ServiceToast';
import { ServicesPageHeader } from '../components/services/ServicesPageHeader';
import { ServiceMetricsStrip } from '../components/services/ServiceMetricsStrip';
import { ServiceControlBar, ServiceTab } from '../components/services/ServiceControlBar';
import { ServiceOperationsBoard } from '../components/services/ServiceOperationsBoard';
import { ServiceMenuCatalog } from '../components/services/ServiceMenuCatalog';
import { ServiceLedger } from '../components/services/ServiceLedger';
import { CreateServiceOrderModal } from '../components/services/CreateServiceOrderModal';
import { ServiceOrderDrawer } from '../components/services/ServiceOrderDrawer';
import { formatMoney } from '../components/bookings/bookingUtils';

export const ServicesPage: React.FC = () => {
  const { displayCurrency, setDisplayCurrency } = useBookingStore();
  const { orders: apiOrders, isLoadingOrders } = useServicesApi();
  const { orders, setOrders, createOrder, advanceOrderStatus } = useServiceOrderStore();

  useEffect(() => {
    if (apiOrders && apiOrders.length > 0) {
      setOrders(apiOrders);
    }
  }, [apiOrders, setOrders]);

  const [activeTab, setActiveTab] = useState<ServiceTab>('board');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<ServiceOrder | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [orderGuestRoom, setOrderGuestRoom] = useState('301');
  const [orderGuestName, setOrderGuestName] = useState('Alexander Hayes');
  const [orderVipTier, setOrderVipTier] = useState<'Diamond' | 'Gold' | 'Silver' | 'Standard'>('Diamond');
  const [orderItemsList, setOrderItemsList] = useState<{ item: ServiceMenuItem; qty: number }[]>([]);
  const [orderDeliveryTime, setOrderDeliveryTime] = useState('08:00 PM Tonight');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderAllergens, setOrderAllergens] = useState('');

  const handleAdvanceStatus = (orderId: string, currentStatus: ServiceOrder['status']) => {
    const nextStatus = advanceOrderStatus(orderId, currentStatus);
    if (nextStatus) {
      setToastMsg(`Order #${orderId} moved to "${nextStatus}" status.`);
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  const handleOpenNewOrderModal = (presetItem?: ServiceMenuItem) => {
    setOrderItemsList(presetItem ? [{ item: presetItem, qty: 1 }] : [{ item: SERVICE_MENU_CATALOG[0], qty: 1 }]);
    setIsOrderModalOpen(true);
  };

  const handleAddItemToOrder = (item: ServiceMenuItem) => {
    const existing = orderItemsList.find((i) => i.item.id === item.id);
    if (existing) {
      setOrderItemsList((prev) => prev.map((i) => (i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i)));
    } else {
      setOrderItemsList((prev) => [...prev, { item, qty: 1 }]);
    }
  };

  const handleRoomChange = (value: string) => {
    setOrderGuestRoom(value);
    if (value === '301') setOrderGuestName('Alexander Hayes');
    if (value === '104') setOrderGuestName('Sophia Loren');
    if (value === '201') setOrderGuestName('David Zhang');
    if (value === '303') setOrderGuestName('Sir Arthur Stirling');
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItemsList.length === 0) return;
    const totalUSD = orderItemsList.reduce((sum, i) => sum + i.item.priceUSD * i.qty, 0);
    const newOrder: ServiceOrder = {
      id: `ORD-${Math.floor(5825 + Math.random() * 100)}`,
      orderNumber: `SRV-2026-${Math.floor(5825 + Math.random() * 100)}`,
      guestName: orderGuestName,
      guestAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
      vipTier: orderVipTier,
      roomNumber: orderGuestRoom,
      department: orderItemsList[0].item.category === 'spa' ? 'Spa & Wellness' : orderItemsList[0].item.category === 'concierge' ? 'Concierge' : orderItemsList[0].item.category === 'catering' ? 'Catering' : 'Culinary',
      status: 'Received',
      priority: orderVipTier === 'Diamond' ? 'Urgent' : 'High',
      scheduledTime: orderDeliveryTime,
      assignedStaff: 'Station Butler & Kitchen Team',
      items: orderItemsList.map((i) => ({ itemId: i.item.id, name: i.item.name, quantity: i.qty, unitPrice: i.item.priceUSD })),
      totalAmountUSD: totalUSD,
      isBilledToFolio: true,
      folioId: `BK-ROOM-${orderGuestRoom}`,
      dietaryAllergens: orderAllergens || undefined,
      orderNotes: orderNotes || undefined,
      createdAt: 'Just now',
    };
    createOrder(newOrder);
    setIsOrderModalOpen(false);
    setToastMsg(`Order #${newOrder.id} (${formatMoney(totalUSD, displayCurrency)}) created & dispatched!`);
    setTimeout(() => setToastMsg(null), 4500);
  };

  const filteredOrders = orders.filter((ord) => {
    if (selectedDepartment !== 'all') {
      if (selectedDepartment === 'culinary' && ord.department !== 'Culinary') return false;
      if (selectedDepartment === 'catering' && ord.department !== 'Catering') return false;
      if (selectedDepartment === 'spa' && ord.department !== 'Spa & Wellness') return false;
      if (selectedDepartment === 'concierge' && ord.department !== 'Concierge') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return ord.guestName.toLowerCase().includes(q) || ord.roomNumber.toLowerCase().includes(q) || ord.id.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredMenuItems = SERVICE_MENU_CATALOG.filter((item) => {
    if (selectedDepartment !== 'all') {
      if (selectedDepartment === 'culinary' && item.category !== 'fnb') return false;
      if (selectedDepartment === 'catering' && item.category !== 'catering') return false;
      if (selectedDepartment === 'spa' && item.category !== 'spa') return false;
      if (selectedDepartment === 'concierge' && item.category !== 'concierge') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  const totalRevenueUSD = orders.reduce((sum, o) => sum + o.totalAmountUSD, 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'Completed').length;
  const inKitchenCount = orders.filter((o) => o.status === 'In Prep').length;

  return (
    <div className="space-y-6 pb-14 font-sans text-zinc-900">
      {isLoadingOrders && (
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-semibold flex items-center justify-between">
          <span>Fetching live service orders from API backend...</span>
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
        </div>
      )}

      <ServiceToast message={toastMsg} onDismiss={() => setToastMsg(null)} />
      <ServicesPageHeader displayCurrency={displayCurrency} onToggleCurrency={() => setDisplayCurrency(displayCurrency === 'USD' ? 'NGN' : 'USD')} onCreateOrder={() => handleOpenNewOrderModal()} />
      <ServiceMetricsStrip displayCurrency={displayCurrency} activeOrdersCount={activeOrdersCount} inKitchenCount={inKitchenCount} revenue={totalRevenueUSD} />
      <ServiceControlBar searchQuery={searchQuery} onSearchChange={setSearchQuery} activeTab={activeTab} onTabChange={setActiveTab} menuCount={SERVICE_MENU_CATALOG.length} ordersCount={orders.length} selectedDepartment={selectedDepartment} onDepartmentChange={setSelectedDepartment} filteredCount={filteredOrders.length} />

      {activeTab === 'board' && <ServiceOperationsBoard orders={filteredOrders} displayCurrency={displayCurrency} onOpenOrder={setSelectedOrderDetails} onAdvanceStatus={handleAdvanceStatus} />}
      {activeTab === 'menu' && <ServiceMenuCatalog items={filteredMenuItems} displayCurrency={displayCurrency} onOrderItem={handleOpenNewOrderModal} />}
      {activeTab === 'ledger' && <ServiceLedger orders={filteredOrders} displayCurrency={displayCurrency} totalRevenue={totalRevenueUSD} onOpenOrder={setSelectedOrderDetails} />}

      {isOrderModalOpen && (
        <CreateServiceOrderModal
          items={orderItemsList} onAddItem={handleAddItemToOrder} room={orderGuestRoom} onRoomChange={handleRoomChange} vipTier={orderVipTier} onVipTierChange={setOrderVipTier} scheduledTime={orderDeliveryTime} onScheduledTimeChange={setOrderDeliveryTime} allergens={orderAllergens} onAllergensChange={setOrderAllergens} displayCurrency={displayCurrency} onSubmit={handleCreateOrderSubmit} onClose={() => setIsOrderModalOpen(false)}
        />
      )}
      {selectedOrderDetails && <ServiceOrderDrawer order={selectedOrderDetails} displayCurrency={displayCurrency} onAdvance={handleAdvanceStatus} onClose={() => setSelectedOrderDetails(null)} />}
    </div>
  );
};