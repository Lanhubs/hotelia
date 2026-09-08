import { Jwt } from 'hono/jwt'
import authRepository from "../repositories/authRepository"
import { config } from "../config"
import { UnauthorizedError } from "../types/errorTypes"

class AuthService {
  // Generate JWT token
  async generateToken(user: { id: string; role: string; permissions: string[] }) {
    const payload = {
      sub: user.id,
      role: user.role,
      permissions: user.permissions,
    }
    return await Jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' })
  }

  // Verify JWT token
  async verifyToken(token: string) {
    try {
      return await Jwt.verify(token, config.jwtSecret)
    } catch {
      return null
    }
  }

  async login(email: string, password: string) {
    const user = await authRepository.findUserByEmail(email)
    
    if (!user) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const isValid = await authRepository.verifyPassword(password, user.password_hash)
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials')
    }

    await authRepository.updateLastLogin(user.id)

    // Generate JWT token
    const token = await this.generateToken({
      id: user.id,
      role: user.role,
      permissions: user.permissions,
    })

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        staffId: user.staff_id,
        role: user.role,
        roleTitle: user.role_title,
        avatarUrl: user.avatar_url,
        department: user.department,
        hotelBranch: user.hotel_branch,
        shift: user.shift,
        terminalId: user.terminal_id,
        permissions: user.permissions,
        phone: user.phone,
      },
    }
  }

  async getCurrentUser(userId: string) {
    const user = await authRepository.findUserById(userId)
    
    if (!user) {
      throw new UnauthorizedError('User not found')
    }

    return user
  }
}

export default new AuthService()