export interface ServiceMenuItem {
  id: string;
  name: string;
  category: 'fnb' | 'catering' | 'spa' | 'concierge' | 'comfort';
  categoryLabel: string;
  description: string;
  priceUSD: number;
  prepTime: string;
  image: string;
  tags: string[];
  popular?: boolean;
  dietary?: string[];
}

export interface ServiceOrder {
  id: string;
  orderNumber: string;
  guestName: string;
  guestAvatar: string;
  vipTier: 'Diamond' | 'Gold' | 'Silver' | 'Standard';
  roomNumber: string;
  department: 'Culinary' | 'Catering' | 'Spa & Wellness' | 'Concierge' | 'Housekeeping';
  status: 'Received' | 'In Prep' | 'Dispatched' | 'Completed';
  priority: 'Urgent' | 'High' | 'Normal';
  scheduledTime: string;
  assignedStaff: string;
  items: {
    itemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    specialNotes?: string;
  }[];
  totalAmountUSD: number;
  isBilledToFolio: boolean;
  folioId: string;
  dietaryAllergens?: string;
  orderNotes?: string;
  createdAt: string;
}
