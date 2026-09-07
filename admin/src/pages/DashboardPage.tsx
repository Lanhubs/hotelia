import React from 'react';
import {
  KPICard,
  ChannelPerformanceCard,
  BookingTimelineChart,
  RoomStatusDonut,
  LatestBookingsTable,
  DashboardCalendar,
  WalkInQuickAction,
  InventoryTracking,
} from '../components/dashboard';
import {
  KPI_DATA,
  ROOM_STATUS_ITEMS,
  LATEST_BOOKINGS,
  CALENDAR_DAYS,
  INVENTORY_DATA,
} from '../data/dashboardData';
import { useDashboardApi } from '../hooks/useDashboardApi';

export const DashboardPage: React.FC = () => {
  const { overview, bookings, isLoading } = useDashboardApi();

  const liveKpis = overview?.kpis || KPI_DATA;
  const liveStatusItems = overview?.roomStatusItems || ROOM_STATUS_ITEMS;

  const activeBookings = overview?.latestBookings || (Array.isArray(bookings) && bookings.length > 0
    ? bookings.slice(0, 4).map((b: any) => ({
        id: b.id || b.reference || 'BK-9825',
        name: b.guest?.name || b.guest_name || b.guest?.fullName || 'Alexander Hayes',
        avatar: b.guest?.avatar || b.guest_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
        checkIn: b.stay?.checkInDate || b.check_in_date || b.checkIn || '18/08',
        checkOut: b.stay?.checkOutDate || b.check_out_date || b.checkOut || '22/08',
        roomDesc: b.room?.name ? `${b.room.name} #${b.room.roomNumber || ''}` : (b.room_name ? `${b.room_name} #${b.room_number || ''}` : 'Presidential Suite #301'),
        channel: b.channelLabel || b.channel_label || 'Front Desk Walk-In',
        isOffline: (b.channelCategory || b.channel_category) === 'offline',
        amountUSD: b.financials?.totalAmount || b.total_amount || 4800,
      }))
    : LATEST_BOOKINGS);

  return (
    <div className="space-y-5 pb-8 font-sans text-zinc-900">
      {isLoading && (
        <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-semibold flex items-center justify-between">
          <span>Live API Data Hydrated: Synchronizing real-time reservation metrics...</span>
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {liveKpis.map((kpi: any, idx: number) => (
              <KPICard
                key={idx}
                title={kpi.title}
                icon={kpi.icon}
                mainValue={kpi.mainValue}
                mainUnit={kpi.mainUnit}
                subtitle={kpi.subtitle}
                highlightText={kpi.highlightText}
                highlightIcon={kpi.highlightIcon}
                stats={kpi.stats}
                linkText={kpi.linkText}
                linkTo={kpi.linkTo}
              />
            ))}
          </div>

          <ChannelPerformanceCard
            onlineStats={overview?.onlineStats}
            offlineStats={overview?.offlineStats}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BookingTimelineChart />
            <RoomStatusDonut statusItems={liveStatusItems} />
          </div>

          <LatestBookingsTable bookings={activeBookings} />
        </div>

        <div className="xl:col-span-4 space-y-5">
          <DashboardCalendar calendarDays={CALENDAR_DAYS} />
          <WalkInQuickAction />
          <InventoryTracking inventoryData={INVENTORY_DATA} />
        </div>
      </div>
    </div>
  );
};