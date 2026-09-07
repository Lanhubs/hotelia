import React from 'react';
import { Star, MapPin, BedDouble, Bath, Users, Video, Sparkles } from 'lucide-react';

interface CreateRoomLivePreviewProps {
  name: string;
  category: string;
  pricePerNight: number;
  priceNairaPerNight: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  squareMeters: number;
  floor: number;
  heroImage: string;
  tagline: string;
  videoUrl: string;
  galleryCount: number;
}

export const CreateRoomLivePreview: React.FC<CreateRoomLivePreviewProps> = ({
  name, category, pricePerNight, priceNairaPerNight, bedrooms, bathrooms, maxGuests,
  squareMeters, floor, heroImage, tagline, videoUrl, galleryCount
}) => {
  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 text-zinc-900 space-y-3.5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
          Live Guest Portal Preview
        </span>
        <span className="text-[11px] text-zinc-500 font-semibold">VR & Booking Engine</span>
      </div>

      <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
        <img src={heroImage || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1600&h=900'} alt="Preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20" />

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-zinc-900 shadow-xs">{category || 'Suite'}</span>
          {videoUrl && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white flex items-center gap-1 shadow-xs">
              <Video className="w-3 h-3" />
              <span>VR Tour</span>
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 text-[10px] font-bold text-amber-400 z-10">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>5.0 (New)</span>
        </div>

        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between z-10">
          <div className="flex items-center gap-1 text-[10px] text-zinc-200">
            <MapPin className="w-3 h-3 text-indigo-400" />
            <span className="truncate">Victoria Island Promenade</span>
          </div>
          <div className="text-[10px] text-zinc-200 bg-black/50 px-1.5 py-0.5 rounded font-mono">
            Floor {floor} • {squareMeters} m² • {galleryCount} Photos
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-zinc-900 line-clamp-1">{name || 'Executive Ocean Villa'}</h4>
        <p className="text-xs text-zinc-500 font-medium line-clamp-2">{tagline || 'Private Infinity Plunge Pool & Personal Butler'}</p>
      </div>

      <div className="grid grid-cols-3 gap-1.5 p-2 bg-white rounded-xl text-center text-[10px] border border-zinc-200/80 shadow-2xs">
        <div><div className="text-zinc-400">Beds</div><div className="font-bold text-zinc-900 mt-0.5">{bedrooms} Beds</div></div>
        <div><div className="text-zinc-400">Baths</div><div className="font-bold text-zinc-900 mt-0.5">{bathrooms} Baths</div></div>
        <div><div className="text-zinc-400">Capacity</div><div className="font-bold text-zinc-900 mt-0.5">Max {maxGuests}</div></div>
      </div>

      <div className="pt-2 border-t border-zinc-200/80 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-zinc-400 uppercase font-semibold">Nightly Yield Rate</div>
          <div className="text-sm font-extrabold text-indigo-600">${pricePerNight} <span className="text-[10px] text-zinc-500 font-normal">(₦{priceNairaPerNight.toLocaleString()})</span></div>
        </div>
        <div className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold text-white flex items-center gap-1 shadow-xs">
         Bookable
        </div>
      </div>
    </div>
  );
};
