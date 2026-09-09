import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Utensils,
  Wifi,
  Laptop,
  Tv,
  Waves,
  Zap,
  ArrowUpDown,
  Car,
  ArrowLeft,
} from "lucide-react";
import { LUXURY_ROOMS, AccommodationRoom } from "../data/accommodationData";
import { RoomDiscoverySidebar } from "../components/roomDetail/RoomDiscoverySidebar";
import { RoomAmenitiesModal } from "../components/roomDetail/RoomAmenitiesModal";
import { RoomBookingWidget } from "../components/roomDetail/RoomBookingWidget";
import { useRoomDetailApi, useRoomsApi } from "../hooks/useRoomsApi";

export const RoomDetailPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const { data: apiRoomDetail, isLoading: isLoadingDetail } = useRoomDetailApi(
    roomId || "",
  );
  const { rooms: apiRooms } = useRoomsApi();

  const allRooms: AccommodationRoom[] =
    apiRooms && apiRooms.length > 0 ? apiRooms : LUXURY_ROOMS;
  const currentRoom: AccommodationRoom =
    apiRoomDetail ||
    allRooms.find((r) => r.id === roomId || r.slug === roomId) ||
    LUXURY_ROOMS[0] ||
    ({} as AccommodationRoom);
  const nextRoom =
    allRooms[
      (allRooms.findIndex((r) => r.id === currentRoom?.id) + 1) %
        (allRooms.length || 1)
    ] || LUXURY_ROOMS[0];

  const [searchQuery, setSearchQuery] = useState("");
  const [budgetMin] = useState("20000");
  const [budgetMax] = useState("100000+");
  const [selectedBedrooms, setSelectedBedrooms] = useState("4");
  const [selectedBathrooms, setSelectedBathrooms] = useState("4");
  const [selectedMeals, setSelectedMeals] = useState<string[]>([
    "Breakfast included",
  ]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([
    "Parking",
    "Room Service",
    "Game Space",
  ]);
  const [showMoreFacilities, setShowMoreFacilities] = useState(false);
  const [showMoreOverview, setShowMoreOverview] = useState(false);
  const [showAllAmenitiesModal, setShowAllAmenitiesModal] = useState(false);

  const [checkInDate, setCheckInDate] = useState("13/6/2026");
  const [checkOutDate, setCheckOutDate] = useState("13/6/2026");
  const [guestsCount, setGuestsCount] = useState("2 Guest");

  const toggleMeal = (meal: string) => {
    setSelectedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal],
    );
  };

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility],
    );
  };

  const handleBookNow = () => {
    navigate(
      `/accommodation/${currentRoom.id}/book?checkIn=${encodeURIComponent(checkInDate)}&checkOut=${encodeURIComponent(checkOutDate)}&guests=${encodeURIComponent(guestsCount)}`,
    );
  };

  if (isLoadingDetail && !apiRoomDetail) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-14">
      <div className="flex items-center justify-between px-1">
        <Link
          to="/accommodation"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-ink transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Hotel Directory</span>
        </Link>
        <span className="text-xs text-zinc-400 font-medium">
          Viewing:{" "}
          <strong className="text-zinc-700">
            {currentRoom?.name || "Suite"}
          </strong>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <RoomDiscoverySidebar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          budgetMin={budgetMin}
          budgetMax={budgetMax}
          selectedBedrooms={selectedBedrooms}
          onBedroomsChange={setSelectedBedrooms}
          selectedBathrooms={selectedBathrooms}
          onBathroomsChange={setSelectedBathrooms}
          selectedMeals={selectedMeals}
          onToggleMeal={toggleMeal}
          selectedFacilities={selectedFacilities}
          onToggleFacility={toggleFacility}
          showMoreFacilities={showMoreFacilities}
          onToggleShowMoreFacilities={() =>
            setShowMoreFacilities(!showMoreFacilities)
          }
        />

        <div className="lg:col-span-9 bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-zinc-950 shadow-xs">
            <img
              src={currentRoom.heroImage}
              alt={currentRoom.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
              <div className="space-y-1 max-w-2xl">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {currentRoom.name}
                </h1>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-200 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                  <span>Entire rental unit in Kuala Lumpur, Malaysia</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white pt-1">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold">
                      {currentRoom.rating} Rating
                    </span>
                  </div>
                  <span className="text-zinc-300 font-medium">
                    {currentRoom.reviewsCount} Reviews
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            <div className="xl:col-span-7 space-y-6">
              <div className="flex items-center gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"
                  alt="Host Yeap"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-100"
                />
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 leading-snug">
                    Hosted by Yeap
                  </h3>
                  <p className="text-xs text-zinc-500 font-normal">
                    Selling more than 2 years
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-100">
                <h3 className="text-base font-bold text-zinc-900">Overview</h3>
                <div className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed space-y-2.5">
                  <p>
                    Our HomeStay is located at Quill Residences (WAZE / MAP :
                    Quill Residences)
                  </p>
                  <p>
                    Quill Residences in Kuala Lumpur offer luxurious living in
                    the city's vibrant heart.
                  </p>
                  {showMoreOverview && (
                    <p className="pt-2 text-zinc-500 border-t border-zinc-100">
                      Features soundproof Italian acoustic windows, personalized
                      temperature zones, high-thread-count Egyptian linens.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowMoreOverview(!showMoreOverview)}
                  className="text-xs font-semibold text-zinc-900 underline hover:text-ink pt-1 block cursor-pointer"
                >
                  {showMoreOverview ? "Show less" : "Show more"}
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-100">
                <h3 className="text-base font-bold text-zinc-900">
                  What this place offer
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs sm:text-sm">
                  <div className="flex items-center gap-3 text-zinc-800 font-medium">
                    <Utensils className="w-5 h-5 text-ink stroke-[1.75]" />
                    <span>Kitchen</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-800 font-medium">
                    <Wifi className="w-5 h-5 text-ink stroke-[1.75]" />
                    <span>Wifi</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-800 font-medium">
                    <Laptop className="w-5 h-5 text-ink stroke-[1.75]" />
                    <span>Dedicated workspace</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-800 font-medium">
                    <Tv className="w-5 h-5 text-ink stroke-[1.75]" />
                    <span>TV</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-800 font-medium">
                    <Waves className="w-5 h-5 text-ink stroke-[1.75]" />
                    <span>Pool</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-800 font-medium">
                    <Zap className="w-5 h-5 text-ink stroke-[1.75]" />
                    <span>EV charger</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-800 font-medium">
                    <ArrowUpDown className="w-5 h-5 text-ink stroke-[1.75]" />
                    <span>Elevator</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-800 font-medium">
                    <Car className="w-5 h-5 text-ink stroke-[1.75]" />
                    <span>Free parking on premises</span>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAllAmenitiesModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-ink text-white text-xs sm:text-sm font-semibold"
                  >
                    Show all 24 amenities
                  </button>
                </div>
              </div>
            </div>

            <RoomBookingWidget
              currentRoom={currentRoom}
              checkInDate={checkInDate}
              onCheckInDateChange={setCheckInDate}
              checkOutDate={checkOutDate}
              onCheckOutDateChange={setCheckOutDate}
              guestsCount={guestsCount}
              onGuestsCountChange={setGuestsCount}
              onBookNow={handleBookNow}
              onExploreMore={() =>
                navigate(`/accommodation/${nextRoom?.id || currentRoom.id}`)
              }
            />
          </div>
        </div>
      </div>

      <RoomAmenitiesModal
        isOpen={showAllAmenitiesModal}
        onClose={() => setShowAllAmenitiesModal(false)}
      />
    </div>
  );
};
