import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { FrontDeskPage } from './pages/FrontDeskPage';
import { AccommodationListPage } from './pages/AccommodationListPage';
import { BookingsHubPage } from './pages/BookingsHubPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { WalkInReservationPage } from './pages/WalkInReservationPage';
import { RoomsPage } from './pages/RoomsPage';
import { CalendarPage } from './pages/CalendarPage';
import { GuestsPage } from './pages/GuestsPage';
import { RevenuePage } from './pages/RevenuePage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ServicesPage } from './pages/ServicesPage';
import { StaffPage } from './pages/StaffPage';
import { ActivityPage } from './pages/ActivityPage';
import { HelpSupportPage } from './pages/HelpSupportPage';
import { SettingsPage } from './pages/SettingsPage';
import { ConfigPage } from './pages/ConfigPage';

import GlobalToastContainer from './components/common/GlobalToastContainer';
import { AdminPageLoader } from './components/common/AdminPageLoader';
import ToastContainer from './components/notifications/ToastContainer';
import { useNotificationStore } from './stores/notificationStore';

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const loadFromApi = useNotificationStore((state) => state.loadFromApi);

  useEffect(() => {
    // Simulate PMS system boot — typically 1.6s is enough to feel polished
    const timer = setTimeout(() => setIsBooting(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Load notifications from API on mount
    loadFromApi();
  }, [loadFromApi]);

  if (isBooting) {
    return (
      <AdminPageLoader
        fullscreen
        message="KEO Experience Hotel & Suites"
        subtext={undefined}
      />
    );
  }

  return (
    <BrowserRouter>
      <ToastContainer />
      <GlobalToastContainer />
      <Routes>
        {/* Authentication Portal */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/auth/login" element={<LoginPage />} />

        {/* Master Admin / Front Desk Workspace */}
        <Route path="/admin" element={<AppShell />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Accommodation & Walk-In Reservation Workflow */}
          <Route path="accommodation" element={<AccommodationListPage />} />
          <Route path="accommodation/:roomId" element={<RoomDetailPage />} />
          <Route path="accommodation/:roomId/book" element={<WalkInReservationPage />} />

          {/* Master Bookings & Omnichannel Tracking Hub */}
          <Route path="bookings" element={<BookingsHubPage />} />
          <Route path="reservations" element={<BookingsHubPage />} />
          <Route path="reservations/:roomId" element={<RoomDetailPage />} />
          <Route path="reservations/:roomId/book" element={<WalkInReservationPage />} />

          <Route path="rooms" element={<AccommodationListPage />} />
          <Route path="rooms/:roomId" element={<RoomDetailPage />} />
          <Route path="rooms/:roomId/book" element={<WalkInReservationPage />} />

          <Route path="travel" element={<FrontDeskPage />} />
          <Route path="front-desk" element={<FrontDeskPage />} />
          <Route path="catering" element={<ServicesPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="reports" element={<RevenuePage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="accounting" element={<TransactionsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="cashbooks" element={<TransactionsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="help" element={<HelpSupportPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="guests" element={<GuestsPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="config" element={<ConfigPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
