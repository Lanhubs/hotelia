import { getDatabase } from "../database"
import type { ServiceMenu, ServiceOrder } from "../types/services"

class ServiceRepository {
  async fetchServiceMenu(): Promise<ServiceMenu[]> {
    const db = getDatabase()
    const result = await db.query<ServiceMenu>('SELECT * FROM service_menu ORDER BY is_popular DESC, name')
    return result.rows
  }

  async fetchServiceBySlug(slug: string): Promise<ServiceMenu | null> {
    const db = getDatabase()
    const service = await db.queryOne<ServiceMenu>(
      'SELECT * FROM service_menu WHERE LOWER(REPLACE(name, \' \', \'-\')) = $1',
      [slug]
    )
    return service
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