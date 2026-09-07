export interface ServiceMenu {
  id: string
  name: string
  category: string
  categoryLabel: string
  description: string | null
  priceUSD: number
  priceNaira: number | null
  prepTime: string
  image: string | null
  tags: string[] | null
  dietary: string[] | null
  isPopular: boolean
  createdAt: string
}

export interface ServiceOrder {
  id: string
  orderNumber: string
  bookingId: string | null
  guestName: string
  guestAvatar: string | null
  vipTier: string
  roomNumber: string
  department: string
  status: string
  priority: string
  scheduledTime: string
  assignedStaff: string
  items: any
  totalAmount: number
  totalAmountUSD: number
  isBilledToFolio: boolean
  folioId: string | null
  dietaryAllergens: string | null
  orderNotes: string | null
  createdAt: string
  completedAt: string | null
}

export interface ServiceDepartment {
  name: string
  value: number
  color: string
  commission: number
}