import React from 'react';
import { BedDouble, DollarSign, Building, Sparkles } from 'lucide-react';

interface CreateRoomSpecsStepProps {
  name: string; setName: (val: string) => void;
  category: string; setCategory: (val: string) => void;
  pricePerNight: number; setPricePerNight: (val: number) => void;
  priceNairaPerNight: number; setPriceNairaPerNight: (val: number) => void;
  tagline: string; setTagline: (val: string) => void;
  bedrooms: number; setBedrooms: (val: number) => void;
  bathrooms: number; setBathrooms: (val: number) => void;
  maxGuests: number; setMaxGuests: (val: number) => void;
  floor: number; setFloor: (val: number) => void;
  squareMeters: number; setSquareMeters: (val: number) => void;
  bedType: string; setBedType: (val: string) => void;
}

export const CreateRoomSpecsStep: React.FC<CreateRoomSpecsStepProps> = ({
  name, setName, category, setCategory, pricePerNight, setPricePerNight,
  priceNairaPerNight, setPriceNairaPerNight, tagline, setTagline,
  bedrooms, setBedrooms, bathrooms, setBathrooms, maxGuests, setMaxGuests,
  floor, setFloor, squareMeters, setSquareMeters, bedType, setBedType
}) => {
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-zinc-900 mb-1">Suite Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Royal Sovereign Ocean Villa & Plunge Pool"
            className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium">
            <option value="Ocean Villa">Ocean Villa</option>
            <option value="Presidential Suite">Presidential Suite</option>
            <option value="Executive Suite">Executive Suite</option>
            <option value="Deluxe Suite">Deluxe Suite</option>
            <option value="Penthouse">Penthouse</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">Bed Configuration</label>
          <input type="text" value={bedType} onChange={(e) => setBedType(e.target.value)} placeholder="e.g. 1 Super King Bed + Daybed" className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">USD Rate ($/night)</label>
          <input type="number" required value={pricePerNight} onChange={(e) => setPricePerNight(Number(e.target.value))} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-bold text-indigo-600" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">NGN Rate (₦/night)</label>
          <input type="number" required value={priceNairaPerNight} onChange={(e) => setPriceNairaPerNight(Number(e.target.value))} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-bold text-indigo-600" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">Floor Level</label>
          <input type="number" value={floor} onChange={(e) => setFloor(Number(e.target.value))} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">Area Size (Square Meters m²)</label>
          <input type="number" value={squareMeters} onChange={(e) => setSquareMeters(Number(e.target.value))} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">Bedrooms / Baths</label>
          <div className="flex gap-2">
            <input type="number" value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} placeholder="Beds" className="w-1/2 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium" />
            <input type="number" value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))} placeholder="Baths" className="w-1/2 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">Max Guest Capacity</label>
          <input type="number" value={maxGuests} onChange={(e) => setMaxGuests(Number(e.target.value))} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-zinc-700 mb-1">Executive Tagline</label>
          <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g. Private Cliffside Sanctuary with Heated Infinity Plunge Pool" className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium" />
        </div>
      </div>
    </div>
  );
};
