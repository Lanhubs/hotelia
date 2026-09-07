import React, { useState } from 'react';
import { X, Image as ImageIcon, Sliders } from 'lucide-react';
import { AccommodationRoom } from '../../data/accommodationData';
import { CreateRoomSpecsStep } from './CreateRoomSpecsStep';
import { CreateRoomMediaStep } from './CreateRoomMediaStep';
import { CreateRoomLivePreview } from './CreateRoomLivePreview';

interface CreateRoomModalProps {
  onClose: () => void;
  onSubmit: (roomData: Partial<AccommodationRoom>) => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ onClose, onSubmit }) => {
  const [activeStudioTab, setActiveStudioTab] = useState<'specs' | 'media'>('specs');

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Ocean Villa');
  const [tagline, setTagline] = useState('Executive Luxury Suite with Sunset Plunge Pool');
  const [location, setLocation] = useState('Victoria Island Promenade, Lagos');
  const [pricePerNight, setPricePerNight] = useState<number>(450);
  const [priceNairaPerNight, setPriceNairaPerNight] = useState<number>(720000);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [maxGuests, setMaxGuests] = useState<number>(4);
  const [floor, setFloor] = useState<number>(3);
  const [squareMeters, setSquareMeters] = useState<number>(95);
  const [bedType, setBedType] = useState('Super King Bed');
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1600&h=900');
  const [gallery, setGallery] = useState<string[]>([
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1600&h=900',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=85&w=1600&h=900',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=85&w=1600&h=900',
  ]);
  const [videoUrl, setVideoUrl] = useState('https://vimeo.com/76979871');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      id: `room-${Date.now()}`,
      name,
      category,
      tagline: tagline || 'Executive Luxury Suite',
      location,
      bedrooms,
      bathrooms,
      maxGuests,
      rating: 5.0,
      reviewsCount: 1,
      pricePerNight,
      originalPricePerNight: Math.round(pricePerNight * 1.15),
      priceNairaPerNight,
      heroImage,
      gallery,
      overview: 'Luxury oceanfront suite featuring private plunge pool, master marble bathroom, and 24/7 dedicated butler service.',
      amenities: [
        { id: 'wifi', name: 'Gigabit Wifi', icon: 'wifi', category: 'essentials' },
        { id: 'tv', name: '75" 4K Smart OLED TV', icon: 'tv', category: 'luxury' },
        { id: 'utensils', name: '24/7 Butler Service', icon: 'utensils', category: 'dining' },
      ],
      houseRules: ['No smoking indoors', 'Check-in: 3:00 PM', 'Check-out: 11:00 AM'],
      healthSafety: ['Daily Deep Sanitation', 'UV Key Disinfection'],
      cancellationPolicy: 'Free cancellation up to 48 hours before check-in date.',
      locationDetails: {
        address: location,
        neighborhood: 'Victoria Island Promenade',
        coordinates: { lat: 6.4281, lng: 3.4219 },
        nearbyAttractions: ['Ocean Promenade (0.2 km)', 'VIP Helipad (0.5 km)'],
      },
      floor,
      squareMeters,
      isWalkInReady: true,
      roomNumbers: [`${floor}0${Math.floor(1 + Math.random() * 8)}`],
      mealsIncluded: ['Breakfast & Evening Champagne Included'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-zinc-200 p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-900 border border-indigo-100">
                Executive Media & Suite Studio
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 mt-0.5">Publish New Luxury Suite</h2>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <div className="flex items-center p-1 bg-zinc-100 rounded-xl border border-zinc-200 flex-1 sm:flex-none justify-center">
              <button
                type="button"
                onClick={() => setActiveStudioTab('specs')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeStudioTab === 'specs' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> Specs & Rates
              </button>
              <button
                type="button"
                onClick={() => setActiveStudioTab('media')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeStudioTab === 'media' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Media & VR ({gallery.length})
              </button>
            </div>

            <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:bg-zinc-100 cursor-pointer shrink-0"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            {activeStudioTab === 'specs' ? (
              <CreateRoomSpecsStep
                name={name} setName={setName} category={category} setCategory={setCategory}
                pricePerNight={pricePerNight} setPricePerNight={setPricePerNight}
                priceNairaPerNight={priceNairaPerNight} setPriceNairaPerNight={setPriceNairaPerNight}
                tagline={tagline} setTagline={setTagline} bedrooms={bedrooms} setBedrooms={setBedrooms}
                bathrooms={bathrooms} setBathrooms={setBathrooms} maxGuests={maxGuests} setMaxGuests={setMaxGuests}
                floor={floor} setFloor={setFloor} squareMeters={squareMeters} setSquareMeters={setSquareMeters}
                bedType={bedType} setBedType={setBedType}
              />
            ) : (
              <CreateRoomMediaStep
                heroImage={heroImage} setHeroImage={setHeroImage} gallery={gallery} setGallery={setGallery}
                videoUrl={videoUrl} setVideoUrl={setVideoUrl}
              />
            )}

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer">Cancel</button>
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5">
                Publish to Catalog
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 sticky top-0">
            <CreateRoomLivePreview
              name={name} category={category} pricePerNight={pricePerNight} priceNairaPerNight={priceNairaPerNight}
              bedrooms={bedrooms} bathrooms={bathrooms} maxGuests={maxGuests} squareMeters={squareMeters}
              floor={floor} heroImage={heroImage} tagline={tagline} videoUrl={videoUrl} galleryCount={gallery.length}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
