import {
  FaWifi,
  FaWind,
  FaTv,
  FaBath,
  FaDroplet,
  FaMugHot,
  FaMugSaucer,
  FaCouch,
  FaUtensils,
  FaBriefcase,
  FaWandMagicSparkles,
  FaShirt,
  FaCar,
  FaBed,
  FaWineGlass,
} from 'react-icons/fa6'

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: FaWifi,
  wind: FaWind,
  tv: FaTv,
  bath: FaBath,
  droplet: FaDroplet,
  sparkles: FaWandMagicSparkles,
  coffee: FaMugHot,
  cup: FaMugSaucer,
  sofa: FaCouch,
  utensils: FaUtensils,
  briefcase: FaBriefcase,
  shirt: FaShirt,
  car: FaCar,
  bed: FaBed,
  'wine-glass': FaWineGlass,
}

export function getAmenityIconName(name: string): string {
  const lower = name.toLowerCase()
  if (lower.includes('wifi')) return 'wifi'
  if (lower.includes('air') || lower.includes('wind') || lower.includes('ac')) return 'wind'
  if (lower.includes('tv') || lower.includes('television') || lower.includes('smart')) return 'tv'
  if (lower.includes('bath') || lower.includes('shower') || lower.includes('tub')) return 'bath'
  if (lower.includes('water') || lower.includes('droplet')) return 'droplet'
  if (lower.includes('coffee') || lower.includes('tea') || lower.includes('breakfast')) return 'coffee'
  if (lower.includes('sofa') || lower.includes('lounge') || lower.includes('seating')) return 'sofa'
  if (lower.includes('dining') || lower.includes('room service') || lower.includes('food')) return 'utensils'
  if (lower.includes('desk') || lower.includes('work') || lower.includes('business')) return 'briefcase'
  if (lower.includes('laundry') || lower.includes('iron') || lower.includes('shirt')) return 'shirt'
  if (lower.includes('parking') || lower.includes('car') || lower.includes('transfer')) return 'car'
  if (lower.includes('bed') || lower.includes('linen')) return 'bed'
  if (lower.includes('bar') || lower.includes('wine') || lower.includes('mini')) return 'wine-glass'
  return 'sparkles'
}

export function AmenityIcon({ name, className }: { name: string; className?: string }) {
  const iconKey = icons[name] ? name : getAmenityIconName(name)
  const Icon = icons[iconKey] ?? FaWandMagicSparkles
  return <Icon className={className} aria-hidden="true" />
}