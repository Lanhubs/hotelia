import { config } from './config'

export function generateReference(prefix = 'KEO'): string {
  const n = Math.floor(100000 + Math.random() * 900000)
  return `${prefix}-${n}`
}

export function generateFolioNumber(): string {
  const year = new Date().getFullYear()
  const n = Math.floor(100000 + Math.random() * 900000)
  return `FOL-${year}-${n}`
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffTime = Math.abs(end.getTime() - start.getTime())    
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function formatMoney(amount: number, currency: 'USD' | 'NGN' = 'USD'): string {
  const rate = 1600 // USD to NGN
  const value = currency === 'NGN' ? amount * rate : amount
  const symbol = currency === 'NGN' ? '₦' : '$'
  return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password, { algorithm: 'bcrypt', cost: 10 })
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await Bun.password.verify(password, hash)
  } catch {
    return false
  }
}

export function parseDate(dateStr: string): Date {
  return new Date(dateStr.replace(/(\d+)\/(\d+)\/(\d+)/, '$2/$1/$3'))
}

export function formatDate(date: Date, format: 'YYYY-MM-DD' | 'ISO' = 'YYYY-MM-DD'): string {
  if (format === 'ISO') return date.toISOString()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseTime(timeStr: string): string {
  return timeStr.replace(/\s*(\d+):\s*(\d+)\s*/, '$1:$2')
}

export function paginate<T>(items: T[], page: number = 1, limit: number = 10): { data: T[]; total: number; page: number; totalPages: number } {
  const total = items.length
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const data = items.slice(startIndex, endIndex)
  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}