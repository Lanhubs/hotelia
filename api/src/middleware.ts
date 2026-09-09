import { Context } from 'hono'
import jwt from 'jsonwebtoken'
import { config } from './config'

export interface AuthenticatedRequest extends Context {
  var: {
    userId: string
    userRole: string
    userPermissions: string[]
  }
}

export async function authMiddleware(c: Context, next: () => Promise<void>) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.split(' ')[1]
  try {
    // Verify JWT token
    const payload = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload
    
    if (!payload || !payload.sub) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Set user info in context
    c.set('userId', payload.sub as string)
    c.set('userRole', payload.role as string)
    c.set('userPermissions', payload.permissions as string[])
    
    await next()
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}

export function requirePermission(permission: string) {
  return async (c: Context, next: () => Promise<void>) => {
    const permissions = c.get('userPermissions') as string[]
    if (!permissions.includes('all') && !permissions.includes(permission)) {
      return c.json({ error: 'Forbidden' }, 403)
    }
    await next()
  }
}

export function jsonBody<T>(c: Context): Promise<T> {
  return c.req.json()
}