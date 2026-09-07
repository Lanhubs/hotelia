import { Context } from 'hono'
import staffRepository from '../repositories/staffRepository'
import { handleApiError } from '../types/errorTypes'

class StaffController {
  /** GET /admin/staff — list all staff (GM only) */
  async listStaff(c: Context): Promise<Response> {
    try {
      const staff = await staffRepository.getAllStaff()
      return c.json({ staff })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  /** GET /admin/staff/:role — get staff profile by role */
  async getStaffByRole(c: Context): Promise<Response> {
    try {
      const role = c.req.param('role')
      if (!role) return c.json({ error: 'Role parameter is required' }, 400)
      const staff = await staffRepository.getStaffByRole(role)
      if (!staff) return c.json({ error: 'Not found' }, 404)
      return c.json({ staff })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  /** PUT /admin/staff/:id/profile — update profile fields */
  async updateProfile(c: Context): Promise<Response> {
    try {
      const id = c.req.param('id')
      if (!id) return c.json({ error: 'ID parameter is required' }, 400)
      const body = await c.req.json()
      const { name, email, roleTitle, phone, shift, department, avatarUrl } = body
      const updated = await staffRepository.updateStaffProfile(id, {
        name, email, roleTitle, phone, shift, department, avatarUrl,
      })
      return c.json({ success: true, staff: updated })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  /** PUT /admin/staff/:id/password — change password (requires current password) */
  async updatePassword(c: Context): Promise<Response> {
    try {
      const id = c.req.param('id')
      if (!id) return c.json({ error: 'ID parameter is required' }, 400)
      const { currentPassword, newPassword } = await c.req.json()

      if (!newPassword || newPassword.length < 6) {
        return c.json({ error: 'Password must be at least 6 characters' }, 400)
      }

      // Verify current password before allowing change
      const valid = await staffRepository.verifyPassword(id, currentPassword)
      if (!valid) {
        return c.json({ error: 'Current password is incorrect' }, 401)
      }

      const hash = Bun.password.hashSync(newPassword)
      await staffRepository.updatePassword(id, hash)
      return c.json({ success: true, message: 'Password updated successfully' })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  /** POST /admin/staff/:id/verify-pin — check PIN for terminal unlock */
  async verifyPin(c: Context): Promise<Response> {
    try {
      const id = c.req.param('id')
      if (!id) return c.json({ error: 'ID parameter is required' }, 400)
      const { pin } = await c.req.json()
      const db = (await import('../database')).getDatabase()
      const user = await db.queryOne<any>(
        `SELECT pin_hash FROM staff_users WHERE id = $1`, [id]
      )
      if (!user?.pin_hash) return c.json({ error: 'Not found' }, 404)
      const valid = Bun.password.verifySync(pin, user.pin_hash)
      if (!valid) return c.json({ error: 'Invalid PIN' }, 401)
      return c.json({ success: true })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  /** PUT /admin/staff/:id/pin — update terminal PIN */
  async updatePin(c: Context): Promise<Response> {
    try {
      const id = c.req.param('id')
      if (!id) return c.json({ error: 'ID parameter is required' }, 400)
      const { pin } = await c.req.json()

      if (!pin || !/^\d{4,6}$/.test(pin)) {
        return c.json({ error: 'PIN must be 4–6 digits' }, 400)
      }

      const hash = Bun.password.hashSync(pin)
      await staffRepository.updatePin(id, hash)
      return c.json({ success: true, message: 'Terminal PIN updated successfully' })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }
}

export default new StaffController()
