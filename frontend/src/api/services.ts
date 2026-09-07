import { apiGet } from './client'
import type { Service } from './types'

export async function getServices(): Promise<Service[]> {
  try {
    const res = await apiGet<any>('/services')
    if (Array.isArray(res)) return res as Service[]
    if (res && Array.isArray(res.services)) return res.services as Service[]
    if (res && Array.isArray(res.items)) return res.items as Service[]
    if (res && Array.isArray(res.rows)) return res.rows as Service[]
  } catch { /* ignore */ }
  return []
}

export async function getService(slug: string): Promise<Service> {
  try {
    const res = await apiGet<any>(`/services/${encodeURIComponent(slug)}`)
    if (res && (res.id || res.slug || res.name)) return res as Service
  } catch { /* ignore */ }
  const services = await getServices()
  const match = services.find((s) => s.slug?.toLowerCase() === slug.toLowerCase() || s.name?.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase())
  if (!match) throw new Error('Service not found')
  return match
}