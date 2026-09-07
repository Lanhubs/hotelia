import { getDatabase } from '../database'

export interface Extra {
  id: string
  slug: string
  name: string
  description: string
  price: number
  price_naira: number
  per_night: boolean
  icon: string
}

class ExtrasRepository {
  async findAll(): Promise<Extra[]> {
    const db = getDatabase()
    const result = await db.query<Extra>(
      `SELECT id, slug, name, description, price, price_naira, per_night, icon
       FROM extras WHERE is_active = true ORDER BY price ASC`
    )
    return result.rows
  }

  async findByIds(ids: string[]): Promise<Extra[]> {
    if (!ids.length) return []
    const db = getDatabase()
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ')
    const result = await db.query<Extra>(
      `SELECT id, slug, name, description, price, price_naira, per_night, icon
       FROM extras WHERE id IN (${placeholders}) AND is_active = true`,
      ids
    )
    return result.rows
  }
}

export default new ExtrasRepository()
