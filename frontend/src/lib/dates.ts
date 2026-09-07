export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseISO(value: string): Date {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function addDaysISO(value: string, days: number): string {
  const date = parseISO(value)
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = parseISO(checkOut).getTime() - parseISO(checkIn).getTime()
  return Math.round(ms / 86400000)
}

export function isValidRange(checkIn: string, checkOut: string): boolean {
  if (!ISO_DATE.test(checkIn) || !ISO_DATE.test(checkOut)) return false
  return parseISO(checkOut).getTime() > parseISO(checkIn).getTime()
}

const formatter = new Intl.DateTimeFormat('en-NG', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const shortFormatter = new Intl.DateTimeFormat('en-NG', {
  day: 'numeric',
  month: 'short',
})

export function formatDate(value: string): string {
  return formatter.format(parseISO(value))
}

const dateTimeFormatter = new Intl.DateTimeFormat('en-NG', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export function formatDateTime(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? formatDate(value.slice(0, 10)) : dateTimeFormatter.format(date)
}

export function formatDateShort(value: string): string {
  return shortFormatter.format(parseISO(value))
}

export function formatDateRange(checkIn: string, checkOut: string): string {
  const nights = nightsBetween(checkIn, checkOut)
  const suffix = nights === 1 ? '1 night' : `${nights} nights`
  return `${formatDateShort(checkIn)} – ${formatDateShort(checkOut)} · ${suffix}`
}