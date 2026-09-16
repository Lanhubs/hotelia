import React from 'react';
import {
  LayoutGrid,
  BedDouble,
  Plane,
  UtensilsCrossed,
  BarChart2,
  CreditCard,
  Receipt,
  Settings,
  HelpCircle,
  Compass,
  CalendarCheck2,
  Calendar,
  CalendarDays,
} from 'lucide-react';

interface NavIconProps {
  name: string;
  className?: string;
}

export const NavIcon: React.FC<NavIconProps> = ({ name, className = 'w-4 h-4' }) => {
  switch (name) {
    case 'dashboard':
      return <LayoutGrid className={className} />;
    case 'accommodation':
    case 'rooms':
      return <BedDouble className={className} />;
    case 'bookings':
    case 'reservations':
    case 'booking':
      return <CalendarCheck2 className={className} />;
    case 'calendar':
      return <Calendar className={className} />;
    case 'travel':
      return <Plane className={className} />;
    case 'catering':
    case 'services':
      return <UtensilsCrossed className={className} />;
    case 'events':
      return <CalendarDays className={className} />;
    case 'reports':
    case 'analytic':
    case 'revenue':
      return <BarChart2 className={className} />;
    case 'accounting':
    case 'transaction':
    case 'transactions':
      return <CreditCard className={className} />;
    case 'cashbooks':
    case 'cashflow':
      return <Receipt className={className} />;
    case 'settings':
      return <Settings className={className} />;
    case 'help':
      return <HelpCircle className={className} />;
    default:
      return <Compass className={className} />;
  }
};
