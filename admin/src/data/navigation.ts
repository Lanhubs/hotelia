import { NavigationSection } from '../types';

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    title: 'Daily Operations',
    key: 'DAILY_OPERATIONS',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'dashboard',
      },
      {
        id: 'accommodation',
        label: 'Accommodation',
        path: '/accommodation',
        icon: 'accommodation',
      },
      {
        id: 'bookings',
        label: 'Bookings & Folios',
        path: '/bookings',
        icon: 'bookings',
      },
      {
        id: 'travel',
        label: 'Travel',
        path: '/travel',
        icon: 'travel',
      },
      {
        id: 'catering',
        label: 'Catering',
        path: '/services',
        icon: 'catering',
      },
      {
        id: 'events',
        label: 'Events & Parties',
        path: '/events',
        icon: 'events',
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
        path: '/revenue',
        icon: 'reports',
      },
      {
        id: 'accounting',
        label: 'Accounting',
        path: '/transactions',
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
        path: '/settings',
        icon: 'settings',
      },
      {
        id: 'help',
        label: 'Help and Support',
        path: '/help',
        icon: 'help',
      },
    ],
  },
];
