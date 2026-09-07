export interface RevenueDashboard {
  revenue: number
  revpar: number
  adr: number
  fnbSpend: number
  directBookings: number
  channelBreakdown: ServiceChannelBreakdown[]
  deptProfit: DepartmentProfit[]
  dailyRevenue: DailyRevenue[]
  recentTransactions: RecentTransaction[]
}

export interface ServiceChannelBreakdown {
  name: string
  value: number
  color: string
  commission: number
}

export interface DepartmentProfit {
  department: string
  grossRevenueUSD: number
  operatingCostUSD: number
  gopUSD: number
  marginPct: string
  status: string
}

export interface DailyRevenue {
  day: string
  rooms: number
  fnb: number
  spa: number
  concierge: number
  total: number
  occupancy: number
}

export interface RecentTransaction {
  id: string
  folio: string
  desc: string
  category: string
  method: string
  time: string
  amountUSD: number
}