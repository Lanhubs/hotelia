import { getDatabase } from "../database"
import type { ServiceMenu, ServiceOrder } from "../types/services"

function parseJsonArray(value: any): any[] {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : [] } catch { return [] }
  }
  return []
}

function mapServiceMenuItem(row: any): any {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    categoryLabel: row.category_label || row.categoryLabel || '',
    description: row.description || '',
    priceUSD: Number(row.price_usd ?? row.priceUSD ?? 0),
    priceNaira: row.price_naira ?? row.priceNaira ?? null,
    prepTime: row.prep_time || row.prepTime || '',
    image: row.image || '',
    tags: parseJsonArray(row.tags),
    dietary: parseJsonArray(row.dietary),
    isPopular: !!row.is_popular || !!row.isPopular,
    createdAt: row.created_at || row.createdAt || null,
  }
}

class ServiceRepository {
  async fetchServiceMenu(): Promise<any[]> {
    const db = getDatabase()
    const result = await db.query<any>('SELECT * FROM service_menu ORDER BY is_popular DESC, name')
    return result.rows.map(mapServiceMenuItem)
  }

  async fetchServiceBySlug(slug: string): Promise<any | null> {
    const db = getDatabase()
    const service = await db.queryOne<any>(
      'SELECT * FROM service_menu WHERE LOWER(REPLACE(name, \' \', \'-\')) = $1',
      [slug]
    )
    return mapServiceMenuItem(service)
  }

  async createServiceMenuItem(data: any): Promise<any> {
    const db = getDatabase()
    const id = data.id || `menu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const result = await db.queryOne<any>(
      `INSERT INTO service_menu (
        id, name, category, category_label, description, price_usd, price_naira,
        prep_time, image, tags, dietary, is_popular
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [
        id,
        data.name,
        data.category || 'fnb',
        data.categoryLabel || 'In-Room Gourmet Dining',
        data.description || '',
        Number(data.priceUSD ?? data.price ?? 0),
        data.priceNaira ?? null,
        data.prepTime || '',
        data.image || '',
        JSON.stringify(Array.isArray(data.tags) ? data.tags : []),
        JSON.stringify(Array.isArray(data.dietary) ? data.dietary : []),
        data.isPopular ? 1 : 0,
      ]
    )
    return mapServiceMenuItem(result)
  }

  async updateServiceMenuItem(id: string, data: any): Promise<any> {
    const db = getDatabase()
    await db.query(
      `UPDATE service_menu SET
        name = COALESCE($1, name),
        category = COALESCE($2, category),
        category_label = COALESCE($3, category_label),
        description = COALESCE($4, description),
        price_usd = COALESCE($5, price_usd),
        price_naira = COALESCE($6, price_naira),
        prep_time = COALESCE($7, prep_time),
        image = COALESCE($8, image),
        tags = COALESCE($9, tags),
        dietary = COALESCE($10, dietary),
        is_popular = COALESCE($11, is_popular)
      WHERE id = $12`,
      [
        data.name ?? null,
        data.category ?? null,
        data.categoryLabel ?? null,
        data.description ?? null,
        data.priceUSD != null ? Number(data.priceUSD) : null,
        data.priceNaira != null ? Number(data.priceNaira) : null,
        data.prepTime ?? null,
        data.image ?? null,
        data.tags != null ? JSON.stringify(data.tags) : null,
        data.dietary != null ? JSON.stringify(data.dietary) : null,
        data.isPopular != null ? (data.isPopular ? 1 : 0) : null,
        id,
      ]
    )

    const updated = await db.queryOne<any>('SELECT * FROM service_menu WHERE id = $1', [id])
    return mapServiceMenuItem(updated) || { id, ...data }
  }

  async deleteServiceMenuItem(id: string): Promise<boolean> {
    const db = getDatabase()
    await db.query('DELETE FROM service_menu WHERE id = $1', [id])
    return true
  }

  async createServiceOrder(data: any): Promise<ServiceOrder | null> {
    const db = getDatabase()
    const order = await db.queryOne<ServiceOrder>(
      `INSERT INTO service_orders (
        order_number, guest_name, guest_avatar, vip_tier, room_number, department,
        status, priority, scheduled_time, assigned_staff, items, total_amount, total_amount_usd,
        is_billed_to_folio, folio_id, dietary_allergens, order_notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      ) RETURNING *`,
      [
        data.orderNumber, data.guestName, data.guestAvatar, data.vipTier, data.roomNumber, data.department,
        data.status, data.priority, data.scheduledTime, data.assignedStaff, JSON.stringify(data.items), 
        data.totalAmount, data.totalAmountUSD,
        data.isBilledToFolio, data.folioId, data.dietaryAllergens || null, data.orderNotes || null
      ]
    )
    return order
  }

  async fetchServiceOrders(filters: { department?: string; status?: string }): Promise<ServiceOrder[]> {
    const db = getDatabase()
    let query = `SELECT * FROM service_orders WHERE 1=1`
    const params: any[] = []

    if (filters.department && filters.department !== 'all') {
      query += ` AND department = $${params.length + 1}`
      params.push(filters.department)
    }

    if (filters.status && filters.status !== 'all') {
      query += ` AND status = $${params.length + 1}`
      params.push(filters.status)
    }

    query += ` ORDER BY created_at DESC`
    const result = await db.query<ServiceOrder>(query, params)
    return result.rows
  }

  async updateServiceOrderStatus(id: string, status: string): Promise<ServiceOrder | null> {
    const db = getDatabase()
    const order = await db.queryOne<ServiceOrder>(
      `UPDATE service_orders SET status = $1, completed_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    )
    return order
  }

  async findServiceOrderById(id: string): Promise<ServiceOrder | null> {
    const db = getDatabase()
    const order = await db.queryOne<ServiceOrder>(
      `SELECT * FROM service_orders WHERE id = $1`,
      [id]
    )
    return order
  }
}

export default new ServiceRepository()