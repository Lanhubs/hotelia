import React from 'react';
import { BedDouble, DollarSign, Building, Sparkles, Plus, X, Key } from 'lucide-react';

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
  roomNumbers: string[]; setRoomNumbers: (val: string[]) => void;
}

export const CreateRoomSpecsStep: React.FC<CreateRoomSpecsStepProps> = ({
  name, setName, category, setCategory, pricePerNight, setPricePerNight,
  priceNairaPerNight, setPriceNairaPerNight, tagline, setTagline,
  bedrooms, setBedrooms, bathrooms, setBathrooms, maxGuests, setMaxGuests,
  floor, setFloor, squareMeters, setSquareMeters, bedType, setBedType,
  roomNumbers, setRoomNumbers
}) => {
  const addRoomNumber = () => {
    setRoomNumbers([...roomNumbers, '']);
  };

  const removeRoomNumber = (index: number) => {
    const newRoomNumbers = roomNumbers.filter((_, i) => i !== index);
    setRoomNumbers(newRoomNumbers);
  };

  const updateRoomNumber = (index: number, value: string) => {
    const newRoomNumbers = [...roomNumbers];
    newRoomNumbers[index] = value;
    setRoomNumbers(newRoomNumbers);
  };

  const generateRoomNumber = (index: number) => {
    const baseNumber = `${floor}${String(index + 1).padStart(2, '0')}`;
    updateRoomNumber(index, baseNumber);
  };
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

        {/* Room Numbers Assignment Section */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-zinc-900">Room Numbers Assignment</label>
            <span className="text-[10px] text-zinc-500 font-medium">● Walk-in Ready Rooms</span>
          </div>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 space-y-2.5">
            <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-medium">
              <Key className="w-3 h-3" />
              <span>Assign specific room numbers for this suite category. These will be available for walk-in reservations.</span>
            </div>
            
            {roomNumbers.map((roomNumber, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-bold min-w-[20px]">#{index + 1}</span>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => updateRoomNumber(index, e.target.value)}
                    placeholder={`e.g. ${floor}${String(index + 1).padStart(2, '0')}`}
                    className="flex-1 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => generateRoomNumber(index)}
                    className="px-2 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-[10px] font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    Auto
                  </button>
                </div>
                {roomNumbers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRoomNumber(index)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addRoomNumber}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border-2 border-dashed border-zinc-300 rounded-lg text-xs font-semibold text-zinc-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Another Room Number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
