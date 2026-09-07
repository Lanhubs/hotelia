import { NavigationSection } from '../types';

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    title: 'Daily Operations',
    key: 'DAILY_OPERATIONS',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: 'dashboard',
      },
      {
        id: 'accommodation',
        label: 'Accommodation',
        path: '/admin/accommodation',
        icon: 'accommodation',
      },
      {
        id: 'bookings',
        label: 'Bookings & Folios',
        path: '/admin/bookings',
        icon: 'bookings',
      },
      {
        id: 'travel',
        label: 'Travel',
        path: '/admin/travel',
        icon: 'travel',
      },
      {
        id: 'catering',
        label: 'Catering',
        path: '/admin/services',
        icon: 'catering',
      },
    ],
  },
  {
    title: 'Documents',
    key: 'DOCUMENTS',
    items: [
      {
        id: 'reports',
        label: 'Reports and Analytics',
        path: '/admin/revenue',
        icon: 'reports',
      },
      {
        id: 'accounting',
        label: 'Accounting',
        path: '/admin/transactions',
        icon: 'accounting',
      },
      
    ],
  },
  {
    title: 'System',
    key: 'SYSTEM',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        path: '/admin/settings',
        icon: 'settings',
      },
      {
        id: 'help',
        label: 'Help and Support',
        path: '/admin/help',
        icon: 'help',
      },
    ],
  },
];
