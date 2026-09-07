import { getDatabase } from "../database"
import { verifyPassword } from "../utils"

class AuthRepository {
  async findUserByEmail(email: string) {
    const db = getDatabase()
    const user = await db.queryOne<any>(
      'SELECT * FROM staff_users WHERE email = $1 AND is_active = true',
      [email]
    )
    return user
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await verifyPassword(password, hash)
  }

  async updateLastLogin(userId: string): Promise<void> {
    const db = getDatabase()
    await db.query('UPDATE staff_users SET last_login = NOW() WHERE id = $1', [userId])
  }

  async findUserById(userId: string) {
    const db = getDatabase()
    const user = await db.queryOne<any>(
      'SELECT id, name, email, staff_id, role, role_title, avatar_url, department, hotel_branch, shift, terminal_id, permissions, phone FROM staff_users WHERE id = $1',
      [userId]
    )
    return user
  }
}

export default new AuthRepository()