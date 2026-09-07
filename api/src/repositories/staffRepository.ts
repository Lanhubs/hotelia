import { getDatabase } from '../database'

class StaffRepository {
  async getAllStaff() {
    const db = getDatabase()
    const result = await db.query<any>(
      `SELECT id, name, email, staff_id, role, role_title, avatar_url,
              department, hotel_branch, shift, terminal_id, permissions,
              phone, is_active, last_login
       FROM staff_users
       ORDER BY CASE WHEN role = 'manager' THEN 0 ELSE 1 END, name ASC`
    )
    return result.rows
  }

  async getStaffByRole(role: string) {
    const db = getDatabase()
    return db.queryOne<any>(
      `SELECT id, name, email, staff_id, role, role_title, avatar_url,
              department, hotel_branch, shift, terminal_id, permissions, phone
       FROM staff_users WHERE role = $1 AND is_active = true`,
      [role]
    )
  }

  async updateStaffProfile(id: string, data: {
    name?: string
    email?: string
    roleTitle?: string
    phone?: string
    shift?: string
    department?: string
    avatarUrl?: string
  }) {
    const db = getDatabase()
    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    if (data.name)       { fields.push(`name = $${idx++}`);        values.push(data.name) }
    if (data.email)      { fields.push(`email = $${idx++}`);       values.push(data.email) }
    if (data.roleTitle)  { fields.push(`role_title = $${idx++}`);  values.push(data.roleTitle) }
    if (data.phone)      { fields.push(`phone = $${idx++}`);       values.push(data.phone) }
    if (data.shift)      { fields.push(`shift = $${idx++}`);       values.push(data.shift) }
    if (data.department) { fields.push(`department = $${idx++}`);  values.push(data.department) }
    if (data.avatarUrl)  { fields.push(`avatar_url = $${idx++}`);  values.push(data.avatarUrl) }

    if (fields.length === 0) return null
    fields.push(`updated_at = NOW()`)
    values.push(id)

    await db.query(
      `UPDATE staff_users SET ${fields.join(', ')} WHERE id = $${idx}`,
      values
    )
    return this.getStaffById(id)
  }

  async updatePassword(id: string, newPasswordHash: string) {
    const db = getDatabase()
    await db.query(
      `UPDATE staff_users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
      [newPasswordHash, id]
    )
  }

  async updatePin(id: string, newPinHash: string) {
    const db = getDatabase()
    await db.query(
      `UPDATE staff_users SET pin_hash = $1, updated_at = NOW() WHERE id = $2`,
      [newPinHash, id]
    )
  }

  async getStaffById(id: string) {
    const db = getDatabase()
    return db.queryOne<any>(
      `SELECT id, name, email, staff_id, role, role_title, avatar_url,
              department, hotel_branch, shift, terminal_id, permissions, phone
       FROM staff_users WHERE id = $1`,
      [id]
    )
  }

  async verifyPassword(id: string, password: string): Promise<boolean> {
    const db = getDatabase()
    const user = await db.queryOne<any>(
      `SELECT password_hash FROM staff_users WHERE id = $1`,
      [id]
    )
    if (!user) return false
    return Bun.password.verifySync(password, user.password_hash)
  }
}

export default new StaffRepository()
