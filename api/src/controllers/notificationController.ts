import { Context } from 'hono'
import notificationService from '../services/notificationService'
import { handleApiError } from '../types/errorTypes'

class NotificationController {
  /** GET /api/notifications - list all notifications for current user */
  async getNotifications(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      if (!userId) {
        return c.json({ error: 'User not authenticated' }, 401)
      }
      
      const limit = Number(c.req.query('limit') || '20')
      const offset = Number(c.req.query('offset') || '0')
      
      const notifications = await notificationService.getAllNotifications(userId, limit, offset)
      return c.json({ notifications })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  /** GET /api/notifications/unread-count - get unread notification count */
  async getUnreadCount(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      if (!userId) {
        return c.json({ error: 'User not authenticated' }, 401)
      }
      
      const count = await notificationService.getUnreadCount(userId)
      return c.json({ unreadCount: count })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  /** POST /api/notifications - create a new notification */
  async createNotification(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      if (!userId) {
        return c.json({ error: 'User not authenticated' }, 401)
      }
      
      const body = await c.req.json()
      const notification = await notificationService.createNotification({
        userId,
        ...body,
      })
      return c.json({ notification, message: 'Notification created successfully' }, 201)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  /** PATCH /api/notifications/:id/read - mark notification as read */
  async markAsRead(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      if (!userId) {
        return c.json({ error: 'User not authenticated' }, 401)
      }
      
      const id = c.req.param('id')
      const success = await notificationService.markAsRead(id)
      
      if (!success) {
        return c.json({ error: 'Notification not found' }, 404)
      }
      
      return c.json({ success: true, message: 'Notification marked as read' })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  /** PATCH /api/notifications/read-all - mark all notifications as read */
  async markAllAsRead(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      if (!userId) {
        return c.json({ error: 'User not authenticated' }, 401)
      }
      
      const count = await notificationService.markAllAsRead(userId)
      return c.json({ 
        success: true, 
        message: `Marked ${count} notification(s) as read`,
        readCount: count 
      })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  /** DELETE /api/notifications/:id - delete a specific notification */
  async deleteNotification(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      if (!userId) {
        return c.json({ error: 'User not authenticated' }, 401)
      }
      
      const id = c.req.param('id')
      const success = await notificationService.deleteNotification(id)
      
      if (!success) {
        return c.json({ error: 'Notification not found' }, 404)
      }
      
      return c.json({ success: true, message: 'Notification deleted successfully' })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  /** DELETE /api/notifications - delete all notifications for current user */
  async deleteAllNotifications(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      if (!userId) {
        return c.json({ error: 'User not authenticated' }, 401)
      }
      
      const count = await notificationService.deleteAllNotifications(userId)
      return c.json({ 
        success: true, 
        message: `Deleted ${count} notification(s)`,
        deletedCount: count 
      })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }
}

export default new NotificationController()
