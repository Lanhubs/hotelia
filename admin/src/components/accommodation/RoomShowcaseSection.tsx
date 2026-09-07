import React from 'react';
import {
  MapPin,
  Star,
  Utensils,
  Wifi,
  Briefcase,
  Tv,
  Waves,
  Zap,
  ArrowUpDown,
  Car,
} from 'lucide-react';
import { AccommodationRoom } from '../../data/accommodationData';

interface RoomShowcaseSectionProps {
  room: AccommodationRoom;
  showMoreOverview: boolean;
  onToggleShowMoreOverview: () => void;
  onShowAllAmenities: () => void;
}

export const RoomShowcaseSection: React.FC<RoomShowcaseSectionProps> = ({
  room,
  showMoreOverview,
  onToggleShowMoreOverview,
  onShowAllAmenities,
}) => {
  return (
    <div className="xl:col-span-8 space-y-6">
      {/* Hero Room Photography Container */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm aspect-video bg-zinc-900 group">
        <img
          src={room.heroImage}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E86E15] text-white shadow-sm">
                {room.category}
              </span>
              {room.isWalkInReady && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/90 text-white backdrop-blur-xs">
                  ⚡ Walk-In Ready
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              {room.name}
            </h2>

            <div className="flex items-center gap-1.5 text-xs text-zinc-200">
              <MapPin className="w-3.5 h-3.5 text-[#f97316]" />
              <span>{room.location}</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-white pt-1">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{room.rating} Rating</span>
              </div>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-300">{room.reviewsCount} Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Host & Reception Badge */}
      <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <img
          src={room.host.avatar}
          alt={room.host.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E86E15]/30"
        />
        <div>
          <h3 className="text-sm font-bold text-zinc-900">{room.host.name}</h3>
          <p className="text-xs text-zinc-400 font-medium">
            {room.host.experience} • {room.host.role}
          </p>
        </div>
      </div>

      {/* Overview Section */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
        <h3 className="text-base font-bold text-zinc-900">Overview</h3>
        <div className="text-xs text-zinc-600 leading-relaxed font-normal space-y-2">
          <p>{room.overview}</p>
          {showMoreOverview && (
            <p className="pt-2 text-zinc-500 border-t border-zinc-100">
              Features soundproof Italian acoustic windows, personalized temperature zones, high-thread-count Egyptian linens, and smart keyless RFID door locks. Ideal for luxury walk-ins and corporate VIPs.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onToggleShowMoreOverview}
          className="text-xs font-bold text-[#E86E15] hover:underline"
        >
          {showMoreOverview ? 'Show less' : 'Show more'}
        </button>
      </div>

      {/* What this place offers (Amenities Grid) */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
        <h3 className="text-base font-bold text-zinc-900">What this place offers</h3>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
          <div className="flex items-center gap-3 text-zinc-800 font-medium">
            <div className="p-2 rounded-xl bg-orange-50 text-[#E86E15]">
              <Utensils className="w-4 h-4" />
            </div>
            <span>Kitchen facilities</span>
          </div>

          <div className="flex items-center gap-3 text-zinc-800 font-medium">
            <div className="p-2 rounded-xl bg-orange-50 text-[#E86E15]">
              <Wifi className="w-4 h-4" />
            </div>
            <span>Wifi</span>
          </div>

          <div className="flex items-center gap-3 text-zinc-800 font-medium">
            <div className="p-2 rounded-xl bg-orange-50 text-[#E86E15]">
              <Briefcase className="w-4 h-4" />
            </div>
            <span>Dedicated workspace</span>
          </div>

          <div className="flex items-center gap-3 text-zinc-800 font-medium">
            <div className="p-2 rounded-xl bg-orange-50 text-[#E86E15]">
              <Tv className="w-4 h-4" />
            </div>
            <span>TV</span>
          </div>

          <div className="flex items-center gap-3 text-zinc-800 font-medium">
            <div className="p-2 rounded-xl bg-orange-50 text-[#E86E15]">
              <Waves className="w-4 h-4" />
            </div>
            <span>Pool</span>
          </div>

          <div className="flex items-center gap-3 text-zinc-800 font-medium">
            <div className="p-2 rounded-xl bg-orange-50 text-[#E86E15]">
              <Zap className="w-4 h-4" />
            </div>
            <span>EV charger</span>
          </div>

          <div className="flex items-center gap-3 text-zinc-800 font-medium">
            <div className="p-2 rounded-xl bg-orange-50 text-[#E86E15]">
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <span>Elevator</span>
          </div>

          <div className="flex items-center gap-3 text-zinc-800 font-medium">
            <div className="p-2 rounded-xl bg-orange-50 text-[#E86E15]">
              <Car className="w-4 h-4" />
            </div>
            <span>Free parking on premises</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onShowAllAmenities}
            className="px-5 py-2.5 rounded-xl bg-[#E86E15] hover:bg-[#d05f0d] text-white text-xs font-bold shadow-xs transition-colors"
          >
            Show all {room.amenities.length + 12} amenities
          </button>
        </div>
      </div>
    </div>
  );
};