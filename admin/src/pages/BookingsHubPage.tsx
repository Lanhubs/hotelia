import React, { useState, useEffect } from 'react';
import { useBookingStore } from '../stores/bookingStore';
import { BookingStatsRow } from '../components/bookings/BookingStatsRow';
import { BookingFilterBar } from '../components/bookings/BookingFilterBar';
import { BookingDetailDrawer } from '../components/bookings/BookingDetailDrawer';
import { BookingToast } from '../components/bookings/BookingToast';
import { BookingsHubHeader } from '../components/bookings/BookingsHubHeader';
import { BookingTableView } from '../components/bookings/BookingTableView';
import { BookingCardView } from '../components/bookings/BookingCardView';
import { InHouseRosterView } from '../components/bookings/InHouseRosterView';
import { WalkInBookingModal } from '../components/accommodation/WalkInBookingModal';
import { LUXURY_ROOMS } from '../data/accommodationData';
import { createWalkInRecord } from '../utils/bookingUtils';
import { useBookingsApi } from '../hooks/useBookingsApi';

export const BookingsHubPage: React.FC = () => {
  const { bookings: apiBookings, isLoading } = useBookingsApi();
  const {
    bookings,
    setBookings,
    selectedBooking,
    isDetailDrawerOpen,
    displayCurrency,
    filters,
    setDisplayCurrency,
    openBookingDetails,
    closeBookingDetails,
    setFilters,
    resetFilters,
    updateBookingStatus,
    addBooking,
  } = useBookingStore();

  useEffect(() => {
    if (apiBookings && apiBookings.length > 0) {
      setBookings(apiBookings);
    }
  }, [apiBookings, setBookings]);

  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'inhouse'>('table');
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredBookings = bookings
    .filter((b) => {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = b.guest.name.toLowerCase().includes(query);
        const matchesEmail = b.guest.email.toLowerCase().includes(query);
        const matchesId = b.id.toLowerCase().includes(query);
        const matchesFolio = b.folioNumber.toLowerCase().includes(query);
        const matchesRoomNum = b.room.roomNumber.toLowerCase().includes(query);
        const matchesRoomName = b.room.name.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesId && !matchesFolio && !matchesRoomNum && !matchesRoomName) return false;
      }
      if (viewMode === 'inhouse' && b.status !== 'Checked In') return false;
      if (filters.channelCategory !== 'all' && b.channelCategory !== filters.channelCategory) return false;
      if (filters.channelSpecific !== 'all' && b.channel !== filters.channelSpecific) return false;
      if (filters.status !== 'all' && b.status !== filters.status) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'latest_booked') return b.id.localeCompare(a.id);
      if (filters.sortBy === 'check_in_asc') return a.stay.checkInDate.localeCompare(b.stay.checkInDate);
      if (filters.sortBy === 'amount_desc') return b.financials.totalAmount - a.financials.totalAmount;
      return 0;
    });

  const handleQuickStatusToggle = (e: React.MouseEvent, bookingId: string, currentStatus: string) => {
    e.stopPropagation();
    if (currentStatus === 'Confirmed') {
      updateBookingStatus(bookingId, 'Checked In');
      setToastMsg(`Folio ${bookingId} marked as Checked In. RFID Keycard active.`);
    } else if (currentStatus === 'Checked In') {
      updateBookingStatus(bookingId, 'Checked Out');
      setToastMsg(`Folio ${bookingId} checked out. Room dispatched to housekeeping.`);
    }
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleWalkInSuccess = (bookingData: any) => {
    setIsWalkInModalOpen(false);
    const newRecord = createWalkInRecord(bookingData);
    addBooking(newRecord);
    setToastMsg(`Folio #${newRecord.id} created for ${newRecord.guest.name}! RFID Keycard encoded.`);
    setTimeout(() => setToastMsg(null), 5000);
  };

  return (
    <div className="space-y-6 pb-14 font-sans text-zinc-900">
      {isLoading && (
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-semibold flex items-center justify-between">
          <span>Fetching live reservation records from API backend...</span>
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
        </div>
      )}

      <BookingToast message={toastMsg} onDismiss={() => setToastMsg(null)} />
      <BookingsHubHeader
        displayCurrency={displayCurrency}
        onToggleCurrency={() => setDisplayCurrency(displayCurrency === 'USD' ? 'NGN' : 'USD')}
        onCreateWalkIn={() => setIsWalkInModalOpen(true)}
      />

      <BookingStatsRow bookings={bookings} displayCurrency={displayCurrency} activeFilters={filters} onQuickFilter={setFilters} />

      <BookingFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={resetFilters}
        totalFilteredCount={filteredBookings.length}
        totalCount={bookings.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === 'table' && (
        <BookingTableView
          bookings={filteredBookings}
          displayCurrency={displayCurrency}
          onOpenDetails={openBookingDetails}
          onQuickStatusToggle={handleQuickStatusToggle}
          onResetFilters={resetFilters}
        />
      )}

      {viewMode === 'cards' && <BookingCardView bookings={filteredBookings} displayCurrency={displayCurrency} onOpenDetails={openBookingDetails} />}
      {viewMode === 'inhouse' && <InHouseRosterView bookings={filteredBookings} displayCurrency={displayCurrency} onOpenDetails={openBookingDetails} />}

      {isDetailDrawerOpen && selectedBooking && (
        <BookingDetailDrawer booking={selectedBooking} onClose={closeBookingDetails} displayCurrency={displayCurrency} />
      )}

      {isWalkInModalOpen && /* LUXURY_ROOMS[0] && */ (
        <WalkInBookingModal
          room={LUXURY_ROOMS[0]}
          checkInDate="18/08/2026"
          checkOutDate="20/08/2026"
          nightsCount={2}
          guestsCount={2}
          onClose={() => setIsWalkInModalOpen(false)}
          onSuccess={handleWalkInSuccess}
        />
      )}
    </div>
  );
};