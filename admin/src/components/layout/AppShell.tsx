import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { Topbar } from './Topbar';
import { QuickBookingModal } from '../modals/QuickBookingModal';
import { LockScreenModal } from '../auth/LockScreenModal';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { useRealtimeNotificationFeed } from '../../hooks/useRealtimeNotificationFeed';

export const AppShell: React.FC = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useRealtimeNotificationFeed();

  return (
    <div className="min-h-screen flex bg-[#f8f9fb] text-zinc-900 antialiased font-sans selection:bg-ink/20 selection:text-ink">
      {/* Desktop Collapsible Sidebar */}
      <Sidebar />

      {/* Mobile Off-Canvas Drawer */}
      <MobileDrawer />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#f8f9fb]">
        {/* Persistent Top Navigation Bar */}
        <Topbar onNewBookingClick={() => setIsBookingModalOpen(true)} />

        {/* Dynamic Page Content Scroll Area */}
        <main
          id="main-content-scroll"
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-7 custom-scrollbar focus:outline-none"
          tabIndex={-1}
        >
          <div className=" mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Quick Reservation Modal */}
      {isBookingModalOpen && (
        <QuickBookingModal onClose={() => setIsBookingModalOpen(false)} />
      )}

      {/* Security Lock Screen Modal */}
      <LockScreenModal />

      {/* Global Real-Time Notifications Drawer */}
      <NotificationDrawer />
    </div>
  );
};
