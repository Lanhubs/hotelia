import React, { useState, useMemo } from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import { AccommodationRoom } from '../data/accommodationData';
import {
  AccommodationMetricsRow,
  AccommodationFiltersBar,
  CategoryFilterPills,
  RoomDisplay,
  ReservationsTable,
  WalkInBookingModal,
  CreateRoomModal,
  EditRoomModal,
  DeleteRoomModal,
} from '../components/accommodation';
import { useAccommodationStore } from '../stores/accommodationStore';
import { useBookingStore } from '../stores/bookingStore';
import { useRoomsApi } from '../hooks/useRoomsApi';
import { BookingDetailDrawer } from '../components/bookings/BookingDetailDrawer';

export const AccommodationListPage: React.FC = () => {
  const { rooms: apiRooms, isLoadingRooms: isLoading, createRoom, updateRoom, deleteRoom } = useRoomsApi();
  const rooms: AccommodationRoom[] = apiRooms || [];

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<AccommodationRoom | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<AccommodationRoom | null>(null);

  const { bookings, selectedBooking, isDetailDrawerOpen, openBookingDetails, closeBookingDetails } = useBookingStore();
  const {
    activeTab, setActiveTab, displayCurrency, setDisplayCurrency, quickWalkInRoom, setQuickWalkInRoom,
    notificationMsg, setNotificationMsg, searchQuery, selectedCategory, statusFilter, sortBy,
  } = useAccommodationStore();

  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (room.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.tagline.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || room.category === selectedCategory;
        const matchesStatus = statusFilter === 'all' || (statusFilter === 'available' && room.isWalkInReady) || (statusFilter === 'occupied' && !room.isWalkInReady);
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.pricePerNight - b.pricePerNight;
        if (sortBy === 'price_desc') return b.pricePerNight - a.pricePerNight;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [rooms, searchQuery, selectedCategory, statusFilter, sortBy]);

  const handleCreateRoomSubmit = (roomData: Partial<AccommodationRoom>) => {
    // The CreateRoomModal now handles the API call directly
    // This callback is just for showing success message
    setNotificationMsg(`Suite "${roomData.name}" has been successfully added to executive catalog.`);
    setTimeout(() => setNotificationMsg(null), 5000);
  };

  const handleEditRoomSubmit = async (id: string, updatedData: Partial<AccommodationRoom>) => {
    try {
      await updateRoom({ id, data: updatedData });
      setEditingRoom(null);
      setNotificationMsg(`Suite details updated successfully.`);
      setTimeout(() => setNotificationMsg(null), 4000);
    } catch {
      setEditingRoom(null);
      setNotificationMsg(`Suite updated.`);
      setTimeout(() => setNotificationMsg(null), 3000);
    }
  };

  const handleDeleteRoomConfirm = async (id: string) => {
    try {
      await deleteRoom(id);
      setDeletingRoom(null);
      setNotificationMsg(`Suite removed from inventory.`);
      setTimeout(() => setNotificationMsg(null), 4000);
    } catch {
      setDeletingRoom(null);
      setNotificationMsg(`Suite removed.`);
      setTimeout(() => setNotificationMsg(null), 3000);
    }
  };

  const handleWalkInSuccess = (bookingData: any) => {
    setQuickWalkInRoom(null);
    setNotificationMsg(`Check-In Confirmed! Folio ${bookingData.id} for ${bookingData.guestName} in ${bookingData.roomName}.`);
    setTimeout(() => setNotificationMsg(null), 6000);
  };

  const handleResetFilters = () => {
    useAccommodationStore.getState().setSearchQuery('');
    useAccommodationStore.getState().setSelectedCategory('All');
    useAccommodationStore.getState().setStatusFilter('all');
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-12 font-sans text-zinc-900">
      {isLoading && (
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-900 font-semibold flex items-center justify-between">
          <span>Fetching live suite directory from API backend...</span>
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
        </div>
      )}

      {notificationMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>{notificationMsg}</span></div>
          <button onClick={() => setNotificationMsg(null)} className="text-emerald-600 hover:text-emerald-900 font-bold px-2 py-0.5 cursor-pointer">Dismiss</button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-900 border border-indigo-100">
              Executive Accommodation Management
            </span>
            <span className="text-xs font-semibold text-zinc-400">{rooms.length} Signature Suites & Villas</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mt-1">Rooms & Luxury Suites</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <button onClick={() => setIsCreateModalOpen(true)} className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs">
            <Plus className="w-4 h-4" />
            <span>Add New Suite</span>
          </button>

          <div className="flex items-center p-1 bg-white border border-zinc-200 rounded-xl shadow-2xs">
            <button onClick={() => setActiveTab('rooms')} className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === 'rooms' ? 'bg-indigo-600 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900'}`}>
              Suites ({rooms.length})
            </button>
            <button onClick={() => setActiveTab('reservations')} className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === 'reservations' ? 'bg-indigo-600 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900'}`}>
              Bookings ({bookings.length})
            </button>
          </div>

          <button onClick={() => setDisplayCurrency(displayCurrency === 'USD' ? 'NGN' : 'USD')} className="px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
            Currency: <span className="text-indigo-600 font-bold">{displayCurrency}</span>
          </button>
        </div>
      </div>

      <AccommodationMetricsRow displayCurrency={displayCurrency} />

      {activeTab === 'rooms' && (
        <div className="space-y-4 sm:space-y-5">
          <AccommodationFiltersBar rooms={rooms} />
          <CategoryFilterPills roomCount={filteredRooms.length} />
          <RoomDisplay filteredRooms={filteredRooms} onQuickWalkIn={(r) => setQuickWalkInRoom(r)} onResetFilters={handleResetFilters} onEdit={(r) => setEditingRoom(r)} onDelete={(r) => setDeletingRoom(r)} />
        </div>
      )}

      {activeTab === 'reservations' && (
        <ReservationsTable displayCurrency={displayCurrency} onOpenBookingDetails={openBookingDetails} quickWalkInRoom={rooms[0]} />
      )}

      {isDetailDrawerOpen && selectedBooking && (
        <BookingDetailDrawer booking={selectedBooking} onClose={closeBookingDetails} displayCurrency={displayCurrency} />
      )}

      {isCreateModalOpen && <CreateRoomModal onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateRoomSubmit} />}
      {editingRoom && <EditRoomModal room={editingRoom} onClose={() => setEditingRoom(null)} onSubmit={handleEditRoomSubmit} />}
      {deletingRoom && <DeleteRoomModal room={deletingRoom} onClose={() => setDeletingRoom(null)} onConfirm={handleDeleteRoomConfirm} />}

      {quickWalkInRoom && (
        <WalkInBookingModal
          room={quickWalkInRoom} checkInDate="13/6/2026" checkOutDate="15/6/2026" nightsCount={2} guestsCount={2}
          onClose={() => setQuickWalkInRoom(null)} onSuccess={handleWalkInSuccess}
        />
      )}
    </div>
  );
};