import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { LUXURY_ROOMS, AccommodationRoom } from '../data/accommodationData';
import { useBookingStore } from '../stores/bookingStore';
import { WalkInPageHeader } from '../components/walkin/WalkInPageHeader';
import { GuestDetailsSection, WalkInVipTier } from '../components/walkin/GuestDetailsSection';
import { StayDurationSection } from '../components/walkin/StayDurationSection';
import { AddOnsSection } from '../components/walkin/AddOnsSection';
import { PaymentSection, WalkInPaymentMethod } from '../components/walkin/PaymentSection';
import { WalkInFolioInvoice } from '../components/walkin/WalkInFolioInvoice';
import { WalkInConfirmation } from '../components/walkin/WalkInConfirmation';
import { createWalkInFolioRecord } from '../utils/bookingUtils';

import { useRoomDetailApi, useRoomsApi } from '../hooks/useRoomsApi';

export const WalkInReservationPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addBooking } = useBookingStore();

  const { data: apiRoomDetail } = useRoomDetailApi(roomId || '');
  const { rooms: apiRooms } = useRoomsApi();

  const allRooms: AccommodationRoom[] = apiRooms && apiRooms.length > 0 ? apiRooms : LUXURY_ROOMS;
  const currentRoom: AccommodationRoom = apiRoomDetail || allRooms.find((r) => r.id === roomId || r.slug === roomId) || LUXURY_ROOMS[0];

  // Ensure room has roomNumbers array
  if (currentRoom && (!currentRoom.roomNumbers || currentRoom.roomNumbers.length === 0)) {
    currentRoom.roomNumbers = [`${currentRoom.floor || '4'}01`];
  }

  const initialCheckIn = searchParams.get('checkIn') || '13/6/2026';
  const initialCheckOut = searchParams.get('checkOut') || '15/6/2026';
  const initialGuests = Number(searchParams.get('guests')) || 2;

  const [guestName, setGuestName] = useState('Chief Adeola Adeleke');
  const [guestPhone, setGuestPhone] = useState('+234 803 892 4410');
  const [guestEmail, setGuestEmail] = useState('adeleke.holdings@corporate.ng');
  const [idPassport, setIdPassport] = useState('A09884210');
  const [nationality, setNationality] = useState('Nigerian');
  const [vipTier, setVipTier] = useState<WalkInVipTier>('VIP Diamond');

  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [nightsCount, setNightsCount] = useState(2);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(() => {
    const roomNumbers = currentRoom?.roomNumbers || [];
    return roomNumbers.length > 0 ? roomNumbers[0] : '401';
  });
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
  const [paymentMethod, setPaymentMethod] = useState<WalkInPaymentMethod>('card');
  const [specialRequests, setSpecialRequests] = useState('VIP Walk-in. High floor preference.');

  const [includeBreakfast, setIncludeBreakfast] = useState(true);
  const [includeAirportTransfer, setIncludeAirportTransfer] = useState(false);
  const [includeLateCheckout, setIncludeLateCheckout] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  // Update selected room number when currentRoom changes
  useEffect(() => {
    if (currentRoom?.roomNumbers && currentRoom.roomNumbers.length > 0) {
      setSelectedRoomNumber(currentRoom.roomNumbers[0]);
    }
  }, [currentRoom]);

  const priceUSD = currentRoom?.pricePerNight || currentRoom?.pricePerNight || 250;
  const priceNGN = currentRoom?.priceNairaPerNight || currentRoom?.priceNairaPerNight || (priceUSD * 1600);

  const baseRateUSD = priceUSD * nightsCount;
  const baseRateNGN = priceNGN * nightsCount;
  const addOnsUSD = (includeAirportTransfer ? 60 : 0) + (includeLateCheckout ? 40 : 0);
  const addOnsNGN = (includeAirportTransfer ? 95000 : 0) + (includeLateCheckout ? 65000 : 0);

  const subtotalUSD = baseRateUSD + addOnsUSD;
  const subtotalNGN = baseRateNGN + addOnsNGN;
  const serviceTaxUSD = Math.round(subtotalUSD * 0.075);
  const serviceTaxNGN = Math.round(subtotalNGN * 0.075);

  const totalPayableUSD = subtotalUSD + serviceTaxUSD;
  const totalPayableNGN = subtotalNGN + serviceTaxNGN;

  const handleProcessWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const { record, confirmed } = createWalkInFolioRecord({
        guestName, guestEmail, guestPhone, vipTier, nationality, idPassport, specialRequests,
        currentRoom, selectedRoomNumber, checkInDate, checkOutDate, nightsCount, initialGuests,
        baseRateUSD, serviceTaxUSD, addOnsUSD, totalPayableUSD, includeBreakfast, includeAirportTransfer,
        includeLateCheckout, paymentMethod, currency, totalPayableNGN,
      });
      addBooking(record);
      setConfirmedBooking(confirmed);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-16">
      <WalkInPageHeader room={currentRoom} />

      {!confirmedBooking ? (
        <form onSubmit={handleProcessWalkIn} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-5">
            <GuestDetailsSection
              guestName={guestName} onGuestNameChange={setGuestName}
              guestPhone={guestPhone} onGuestPhoneChange={setGuestPhone}
              guestEmail={guestEmail} onGuestEmailChange={setGuestEmail}
              idPassport={idPassport} onIdPassportChange={setIdPassport}
              nationality={nationality} onNationalityChange={setNationality}
              vipTier={vipTier} onVipTierChange={setVipTier}
            />

            <StayDurationSection
              checkInDate={checkInDate} onCheckInDateChange={setCheckInDate}
              checkOutDate={checkOutDate} onCheckOutDateChange={setCheckOutDate}
              nightsCount={nightsCount} onNightsChange={setNightsCount}
              roomNumbers={currentRoom?.roomNumbers || []} selectedRoomNumber={selectedRoomNumber}
              onSelectedRoomNumberChange={setSelectedRoomNumber} floor={currentRoom?.floor || 4}
            />

            <AddOnsSection
              currency={currency} includeBreakfast={includeBreakfast}
              onToggleBreakfast={() => setIncludeBreakfast(!includeBreakfast)}
              includeAirportTransfer={includeAirportTransfer}
              onToggleAirportTransfer={() => setIncludeAirportTransfer(!includeAirportTransfer)}
              includeLateCheckout={includeLateCheckout}
              onToggleLateCheckout={() => setIncludeLateCheckout(!includeLateCheckout)}
              specialRequests={specialRequests} onSpecialRequestsChange={setSpecialRequests}
            />

            <PaymentSection
              currency={currency} onCurrencyChange={setCurrency}
              paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod}
            />
          </div>

          <WalkInFolioInvoice
            room={currentRoom} selectedRoomNumber={selectedRoomNumber} nightsCount={nightsCount}
            currency={currency} baseRateUSD={baseRateUSD} baseRateNGN={baseRateNGN}
            addOnsUSD={addOnsUSD} addOnsNGN={addOnsNGN} serviceTaxUSD={serviceTaxUSD}
            serviceTaxNGN={serviceTaxNGN} totalPayableUSD={totalPayableUSD} totalPayableNGN={totalPayableNGN}
            includeAirportTransfer={includeAirportTransfer} includeLateCheckout={includeLateCheckout}
            isProcessing={isProcessing}
          />
        </form>
      ) : (
        <WalkInConfirmation
          confirmedBooking={confirmedBooking} onPrint={() => window.print()}
          onTrackInBookings={() => navigate('/bookings')} onReturnToRooms={() => navigate('/accommodation')}
        />
      )}
    </div>
  );
};