import React, { useState } from 'react';
import { LUXURY_ROOMS, AccommodationRoom } from '../data/accommodationData';
import { INITIAL_RESERVATIONS } from '../data/mockHotelData';
import { WalkInBookingModal } from '../components/accommodation/WalkInBookingModal';
import { ReservationsPageHeader, ReservationsViewMode } from '../components/accommodation/ReservationsPageHeader';
import { ReservationToast } from '../components/accommodation/ReservationToast';
import { HotelDiscoverySidebar } from '../components/accommodation/HotelDiscoverySidebar';
import { RoomVariantSwitcher } from '../components/accommodation/RoomVariantSwitcher';
import { RoomShowcaseSection } from '../components/accommodation/RoomShowcaseSection';
import { WalkInBookingEngine } from '../components/accommodation/WalkInBookingEngine';
import { ReservationsLedger } from '../components/accommodation/ReservationsLedger';

export const ReservationsPage: React.FC = () => {
  const [rooms] = useState<AccommodationRoom[]>(LUXURY_ROOMS);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ReservationsViewMode>('discovery');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetMax, setBudgetMax] = useState(1500);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('4');
  const [selectedBathrooms, setSelectedBathrooms] = useState<string>('4');
  const [selectedMeals, setSelectedMeals] = useState<string[]>(['Breakfast included']);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([
    'Parking',
    'Room Service',
    'Game Space',
  ]);
  const [showMoreFacilities, setShowMoreFacilities] = useState(false);
  const [showMoreOverview, setShowMoreOverview] = useState(false);
  const [showAllAmenitiesModal, setShowAllAmenitiesModal] = useState(false);

  // Walk-In Booking Form States
  const [checkInDate, setCheckInDate] = useState('13/06/2026');
  const [checkOutDate, setCheckOutDate] = useState('15/06/2026');
  const [guestsCount, setGuestsCount] = useState(2);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<'USD' | 'NGN'>('USD');
  const [activeReservationList, setActiveReservationList] = useState(INITIAL_RESERVATIONS);
  const [recentBookingToast, setRecentBookingToast] = useState<string | null>(null);

  const activeRoom = rooms[selectedRoomIndex] || rooms[0];
  const nightsCount = 2;

  // Filter matching rooms
  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBudget = r.pricePerNight <= budgetMax;
    const matchesBed =
      selectedBedrooms === 'all' || r.bedrooms >= parseInt(selectedBedrooms, 10);
    return matchesSearch && matchesBudget && matchesBed;
  });

  const toggleMeal = (meal: string) => {
    setSelectedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
  };

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const handleNextRoom = () => {
    setSelectedRoomIndex((prev) => (prev + 1) % rooms.length);
  };

  const handleBookingSuccess = (booking: any) => {
    setIsWalkInModalOpen(false);
    setRecentBookingToast(`Folio #${booking.id} created for ${booking.guestName}! Room #${booking.roomNumber} key encoded.`);
    setActiveReservationList((prev) => [
      {
        id: booking.id,
        confirmationCode: booking.id,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        roomNumber: booking.roomNumber,
        roomType: booking.roomName,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        status: 'Checked In',
        totalAmount: activeRoom.pricePerNight * nightsCount,
        paymentStatus: 'Paid',
        adults: guestsCount,
        children: 0,
        vipTier: booking.vipTier,
      },
      ...prev,
    ]);

    setTimeout(() => {
      setRecentBookingToast(null);
    }, 6000);
  };

  return (
    <div className="space-y-6 pb-12">
      <ReservationsPageHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        roomCount={rooms.length}
        reservationCount={activeReservationList.length}
        displayCurrency={displayCurrency}
        onToggleCurrency={() => setDisplayCurrency(displayCurrency === 'USD' ? 'NGN' : 'USD')}
      />

      <ReservationToast message={recentBookingToast} onDismiss={() => setRecentBookingToast(null)} />

      {viewMode === 'discovery' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <HotelDiscoverySidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            budgetMax={budgetMax}
            onBudgetChange={setBudgetMax}
            selectedBedrooms={selectedBedrooms}
            onBedroomsChange={setSelectedBedrooms}
            selectedBathrooms={selectedBathrooms}
            onBathroomsChange={setSelectedBathrooms}
            selectedMeals={selectedMeals}
            onToggleMeal={toggleMeal}
            selectedFacilities={selectedFacilities}
            onToggleFacility={toggleFacility}
            showMoreFacilities={showMoreFacilities}
            onToggleShowMoreFacilities={() => setShowMoreFacilities(!showMoreFacilities)}
            displayCurrency={displayCurrency}
          />

          <div className="lg:col-span-9 space-y-6">
            <RoomVariantSwitcher
              rooms={filteredRooms}
              selectedRoomIndex={selectedRoomIndex}
              onSelect={setSelectedRoomIndex}
              displayCurrency={displayCurrency}
            />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              <RoomShowcaseSection
                room={activeRoom}
                showMoreOverview={showMoreOverview}
                onToggleShowMoreOverview={() => setShowMoreOverview(!showMoreOverview)}
                onShowAllAmenities={() => setIsWalkInModalOpen(true)}
              />

              <WalkInBookingEngine
                room={activeRoom}
                nextRoom={rooms[(selectedRoomIndex + 1) % rooms.length]}
                nightsCount={nightsCount}
                displayCurrency={displayCurrency}
                checkInDate={checkInDate}
                onCheckInDateChange={setCheckInDate}
                checkOutDate={checkOutDate}
                onCheckOutDateChange={setCheckOutDate}
                guestsCount={guestsCount}
                onGuestsCountChange={setGuestsCount}
                onBook={() => setIsWalkInModalOpen(true)}
                onNextRoom={handleNextRoom}
              />
            </div>
          </div>
        </div>
      )}

      {viewMode === 'ledger' && (
        <ReservationsLedger reservations={activeReservationList} onNewWalkIn={() => setIsWalkInModalOpen(true)} />
      )}

      {isWalkInModalOpen && (
        <WalkInBookingModal
          room={activeRoom}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          nightsCount={nightsCount}
          guestsCount={guestsCount}
          onClose={() => setIsWalkInModalOpen(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};