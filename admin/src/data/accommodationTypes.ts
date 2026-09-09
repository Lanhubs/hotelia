export interface AccommodationRoom {
  id: string;
  slug?: string;
  name: string;
  tagline: string;
  location: string;
  category: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  originalPricePerNight: number;
  priceNairaPerNight: number;
  heroImage: string;
  gallery: string[];
  videoUrl?: string;
  host: {
    name: string;
    role: string;
    experience: string;
    avatar: string;
  };
  overview: string;
  amenities: {
    id: string;
    name: string;
    icon: string;
    category: 'essentials' | 'luxury' | 'wellness' | 'dining';
  }[];
  houseRules?: string[];
  healthSafety?: string[];
  cancellationPolicy?: string;
  locationDetails?: any;
  mealsIncluded: string[];
  facilities?: string[];
  roomNumbers: string[];
  floor: number;
  squareMeters: number;
  isWalkInReady: boolean;
  status?: 'Available' | 'Occupied' | 'Reserved' | 'Cleaning';
}
