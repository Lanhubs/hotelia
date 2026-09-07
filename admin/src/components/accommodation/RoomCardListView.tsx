import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star, MapPin, BedDouble, Bath, Users, Maximize2, Sparkles, Eye, ChevronLeft, ChevronRight,
  Heart, KeyRound, Wifi, Utensils, Car, Tv, Waves, Zap, ArrowUpDown,
} from 'lucide-react';
import { AccommodationRoom } from '../../data/accommodationData';

interface RoomCardListViewProps {
  room: AccommodationRoom;
  displayCurrency: 'USD' | 'NGN';
  onQuickWalkIn?: (room: AccommodationRoom) => void;
}

export const RoomCardListView: React.FC<RoomCardListViewProps> = ({
  room,
  displayCurrency,
  onQuickWalkIn,
}) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const images = room.gallery && room.gallery.length > 0 ? room.gallery : [room.heroImage];
  const handlePrevImage = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); };
  const handleNextImage = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); };

  const discountPercent = room.originalPricePerNight > room.pricePerNight ? Math.round(((room.originalPricePerNight - room.pricePerNight) / room.originalPricePerNight) * 100) : 0;

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'wifi': return <Wifi className="w-3 h-3 text-ink" />;
      case 'utensils': return <Utensils className="w-3 h-3 text-ink" />;
      case 'tv': return <Tv className="w-3 h-3 text-ink" />;
      case 'waves': return <Waves className="w-3 h-3 text-ink" />;
      case 'zap': return <Zap className="w-3 h-3 text-ink" />;
      case 'arrow-up-down': return <ArrowUpDown className="w-3 h-3 text-ink" />;
      default: return <Car className="w-3 h-3 text-ink" />;
    }
  };

  return (
    <div id={`room-card-list-${room.id}`} className="bg-white rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 p-2 flex flex-col lg:flex-row gap-3 group">
      <div className="lg:w-80 xl:w-96 relative bg-zinc-950 shrink-0 aspect-16/10 lg:aspect-auto rounded-2xl overflow-hidden">
        <img src={images[currentImageIndex]} alt={room.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/95 text-zinc-900 shadow-xs">{room.category}</span>
          {room.isWalkInReady && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Walk-In Ready
            </span>
          )}
        </div>

        <button type="button" onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }} className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white z-10 cursor-pointer">
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
        </button>

        {images.length > 1 && (
          <>
            <button type="button" onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 z-10 cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button type="button" onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 z-10 cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1 z-10">
              {images.map((_, idx) => (
                <span key={idx} className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-4 bg-zinc-50/50 rounded-2xl border border-zinc-100">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 onClick={() => navigate(`/admin/accommodation/${room.id}`)} className="text-base font-bold text-zinc-900 group-hover:text-ink cursor-pointer">{room.name}</h3>
                <span className="px-2 py-0.5 rounded-md bg-[#EEF2FF] text-ink text-[10px] font-bold">Floor {room.floor}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-ink shrink-0" />
                <span>{room.location || 'Victoria Island Promenade, Lagos'}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/60 self-start sm:self-auto">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-zinc-900">{room.rating}</span>
              <span className="text-[11px] text-zinc-400">({room.reviewsCount} reviews)</span>
            </div>
          </div>

          <p className="text-xs text-zinc-600 line-clamp-2 mt-2 leading-relaxed">{room.tagline}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3.5 p-2.5 rounded-xl bg-white border border-zinc-200/60 text-xs">
            <div className="flex items-center gap-2 text-zinc-700"><BedDouble className="w-4 h-4 text-ink" /><span className="font-semibold text-zinc-900">{room.bedrooms} Bedrooms</span></div>
            <div className="flex items-center gap-2 text-zinc-700"><Bath className="w-4 h-4 text-ink" /><span className="font-semibold text-zinc-900">{room.bathrooms} Bathrooms</span></div>
            <div className="flex items-center gap-2 text-zinc-700"><Users className="w-4 h-4 text-ink" /><span className="font-semibold text-zinc-900">Up to {room.maxGuests} Guests</span></div>
            <div className="flex items-center gap-2 text-zinc-700"><Maximize2 className="w-4 h-4 text-ink" /><span className="font-semibold text-zinc-900">{room.squareMeters} m² Area</span></div>
          </div>

          <div className="flex items-center gap-2 flex-wrap mt-3">
            {room.amenities.slice(0, 4).map((amenity) => (
              <span key={amenity.id} className="px-2.5 py-1 rounded-md bg-white border border-zinc-200/80 text-[11px] font-medium text-zinc-700 flex items-center gap-1.5 shadow-2xs">
                {getAmenityIcon(amenity.icon)}
                {amenity.name}
              </span>
            ))}
            {room.amenities.length > 4 && <span className="text-[11px] font-semibold text-ink">+{room.amenities.length - 4} more</span>}
          </div>
        </div>

        <div className="pt-3.5 border-t border-zinc-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 font-medium flex items-center gap-1"><KeyRound className="w-3.5 h-3.5 text-zinc-400" /> Physical Suites:</span>
            <div className="flex items-center gap-1.5">
              {room.roomNumbers.map((num) => (
                <span key={num} className="px-2 py-0.5 rounded-md bg-white text-zinc-800 text-[11px] font-mono font-bold border border-zinc-200/80">#{num}</span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1.5">
                {discountPercent > 0 && <span className="text-xs text-zinc-400 line-through">{displayCurrency === 'USD' ? `$${room.originalPricePerNight}` : `₦${Math.round(room.priceNairaPerNight * 1.15).toLocaleString()}`}</span>}
                <span className="text-lg font-extrabold text-zinc-900">{displayCurrency === 'USD' ? `$${room.pricePerNight}` : `₦${room.priceNairaPerNight.toLocaleString()}`}</span>
                <span className="text-xs text-zinc-400 font-normal">/ night</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={() => navigate(`/admin/accommodation/${room.id}`)} className="px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center gap-1 cursor-pointer">
                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                <span>Inspect</span>
              </button>
              {onQuickWalkIn && (
                <button type="button" onClick={() => onQuickWalkIn(room)} className="px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100 text-xs font-bold text-emerald-700 flex items-center gap-1.5 cursor-pointer">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Quick Walk-In</span>
                </button>
              )}
              <button type="button" onClick={() => navigate(`/admin/accommodation/${room.id}/book`)} className="px-4 py-2 rounded-lg bg-ink hover:bg-[#4338CA] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Book Suite</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
