import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  BedDouble,
  Bath,
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
  Heart,
  KeyRound,
  WandSparkles,
  Wifi,
  Utensils,
  Car,
  Tv,
  Waves,
  Zap,
  ArrowUpDown,
  Edit3,
  Trash2,
  Video,
} from "lucide-react";
import { AccommodationRoom } from "../../data/accommodationData";

interface RoomCardGridViewProps {
  room: AccommodationRoom;
  displayCurrency: "USD" | "NGN";
  onQuickWalkIn?: (room: AccommodationRoom) => void;
  onEdit?: (room: AccommodationRoom) => void;
  onDelete?: (room: AccommodationRoom) => void;
}

export const RoomCardGridView: React.FC<RoomCardGridViewProps> = ({
  room,
  displayCurrency,
  onQuickWalkIn,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images =
    room.gallery && room.gallery.length > 0 ? room.gallery : [room.heroImage];
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      id={`room-card-grid-${room.id}`}
      className="bg-white rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group p-2 gap-2"
    >
      <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-zinc-950 shadow-xs">
        <img
          src={images[currentImageIndex]}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/95 text-zinc-900 shadow-xs">
            {room.category}
          </span>
          {room.videoUrl && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white shadow-xs flex items-center gap-1">
              <Video className="w-3 h-3" />
              VR Tour
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {onEdit && (
            <button
              type="button"
              title="Edit Suite"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(room);
              }}
              className="p-1.5 rounded-md bg-black/60 hover:bg-indigo-600 text-white cursor-pointer transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              title="Remove Suite"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(room);
              }}
              className="p-1.5 rounded-md bg-black/60 hover:bg-rose-600 text-white cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white z-10 pointer-events-none">
          <div className="flex items-center gap-1 text-[11px] text-zinc-200 font-medium">
            <MapPin className="w-3 h-3 text-indigo-400" />
            <span className="truncate max-w-42.5">
              {(room.location || "Victoria Island, Lagos").split(",")[0]}
            </span>
          </div>
          <div className="text-[10px] text-zinc-300 font-semibold px-1.5 py-0.5 rounded bg-black/40">
            Floor {room.floor} • {room.squareMeters} m²
          </div>
        </div>
      </div>

      <div className="p-3.5 space-y-3.5 flex-1 flex flex-col justify-between bg-zinc-50/60 rounded-2xl border border-zinc-100">
        <div className="space-y-3">
          <div>
            <h3
              onClick={() => navigate(`/accommodation/${room.id}`)}
              className="text-sm font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
            >
              {room.name}
            </h3>
            <p className="text-xs text-zinc-500 font-normal line-clamp-2 mt-1">
              {room.tagline}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1.5 py-2 border border-zinc-200/60 text-center text-xs bg-white rounded-xl px-2 shadow-2xs">
            <div>
              <div className="text-zinc-400 text-[10px] font-medium flex items-center justify-center gap-1">
                <BedDouble className="w-3 h-3 text-indigo-600" /> Beds
              </div>
              <div className="font-bold text-zinc-900 mt-0.5 text-xs">
                {room.bedrooms} Beds
              </div>
            </div>
            <div>
              <div className="text-zinc-400 text-[10px] font-medium flex items-center justify-center gap-1">
                <Bath className="w-3 h-3 text-indigo-600" /> Baths
              </div>
              <div className="font-bold text-zinc-900 mt-0.5 text-xs">
                {room.bathrooms} Baths
              </div>
            </div>
            <div>
              <div className="text-zinc-400 text-[10px] font-medium flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-indigo-600" /> Capacity
              </div>
              <div className="font-bold text-zinc-900 mt-0.5 text-xs">
                Max {room.maxGuests}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-200/60 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="text-[11px] text-zinc-400 font-medium">
              Nightly Rate
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold text-zinc-900">
                {displayCurrency === "USD"
                  ? `$${room.pricePerNight}`
                  : `₦${room.priceNairaPerNight.toLocaleString()}`}
              </span>
              <span className="text-[11px] text-zinc-400 font-normal">
                / night
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(`/accommodation/${room.id}`)}
              className="flex-1 py-2 px-2.5 rounded-xl border bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-zinc-400" />
              <span>Details</span>
            </button>
            {onQuickWalkIn && (
              <button
                type="button"
                onClick={() => onQuickWalkIn(room)}
                className="py-2 px-2.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Walk-In</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate(`/accommodation/${room.id}/book`)}
              className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-xs"
            >
              <WandSparkles className="w-3.5 h-3.5" />
              <span>Book</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
