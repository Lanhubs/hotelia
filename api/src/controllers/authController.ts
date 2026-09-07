import { Context } from "hono"
import authService from "../services/authService"
import { UnauthorizedError, handleApiError } from "../types/errorTypes"

class AuthController {
  async login(c: Context): Promise<Response> {
    try {
      const body = await c.req.json()
      const email = body.email || body.username
      const password = body.password
      if (!email || !password) {
        throw new UnauthorizedError('Email/username and password are required')
      }
      const result = await authService.login(email, password)
      return c.json(result)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async logout(c: Context): Promise<Response> {
    return c.json({ success: true })
  }

  async getCurrentUser(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      const user = await authService.getCurrentUser(userId)
      return c.json(user)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }
}

export default new AuthController()