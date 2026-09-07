import { Context } from 'hono'

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
    const db = (await import('./database')).getDatabase()
    const user = await db.queryOne<{ id: string; role: string; permissions: string[] }>(
      'SELECT id, role, permissions FROM staff_users WHERE id = $1 AND is_active = true',
      [token]
    )

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    c.set('userId', user.id)
    c.set('userRole', user.role)
    c.set('userPermissions', user.permissions)
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