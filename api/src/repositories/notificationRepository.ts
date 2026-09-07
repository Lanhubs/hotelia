import { getDatabase } from "../database"

export interface Notification {
  id: string
  userId: string
  type: 'booking' | 'payment' | 'keycard' | 'service' | 'housekeeping' | 'system'
  severity: 'info' | 'success' | 'urgent'
  title: string
  message: string
  meta?: string
  read: boolean
  timestamp: string
  source: 'action' | 'inbound'
  navigateTo?: string
}

export interface NotificationInput {
  id?: string
  userId: string
  type: Notification['type']
  severity: Notification['severity']
  title: string
  message: string
  meta?: string
  source: 'action' | 'inbound'
  navigateTo?: string
}

class NotificationRepository {
  async getAllNotifications(userId: string, limit: number = 20, offset: number = 0): Promise<Notification[]> {
    const db = getDatabase()
    const rows = await db.query<any>(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY timestamp DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    )
    return rows.rows.map(this.mapRowToNotification)
  }

  async getUnreadCount(userId: string): Promise<number> {
    const db = getDatabase()
    const result = await db.queryOne<any>(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND read = 0`,
      [userId]
    )
    return result?.count || 0
  }

  async createNotification(notification: NotificationInput): Promise<Notification> {
    const db = getDatabase()
    const id = notification.id || `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const timestamp = new Date().toISOString()
    
    await db.query(
      `INSERT INTO notifications (
        id, user_id, type, severity, title, message, meta, 
        read, timestamp, source, navigate_to
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        id,
        notification.userId,
        notification.type,
        notification.severity,
        notification.title,
        notification.message,
        notification.meta || null,
        0,
        timestamp,
        notification.source,
        notification.navigateTo || null
      ]
    )
    
    return {
      id,
      userId: notification.userId,
      type: notification.type,
      severity: notification.severity,
      title: notification.title,
      message: notification.message,
      meta: notification.meta,
      read: false,
      timestamp,
      source: notification.source,
      navigateTo: notification.navigateTo,
    }
  }

  async markAsRead(id: string): Promise<boolean> {
    const db = getDatabase()
    const result = await db.queryOne<any>(
      `SELECT id FROM notifications WHERE id = $1`,
      [id]
    )
    
    if (!result) return false
    
    await db.query(`UPDATE notifications SET read = 1 WHERE id = $1`, [id])
    return true
  }

  async markAllAsRead(userId: string): Promise<number> {
    const db = getDatabase()
    const result = await db.queryOne<any>(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND read = 0`,
      [userId]
    )
    const unreadCount = result?.count || 0
    
    await db.query(`UPDATE notifications SET read = 1 WHERE user_id = $1`, [userId])
    return unreadCount
  }

  async deleteNotification(id: string): Promise<boolean> {
    const db = getDatabase()
    const result = await db.queryOne<any>(
      `SELECT id FROM notifications WHERE id = $1`,
      [id]
    )
    
    if (!result) return false
    
    await db.query(`DELETE FROM notifications WHERE id = $1`, [id])
    return true
  }

  async deleteAllNotifications(userId: string): Promise<number> {
    const db = getDatabase()
    const result = await db.queryOne<any>(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = $1`,
      [userId]
    )
    const totalCount = result?.count || 0
    
    await db.query(`DELETE FROM notifications WHERE user_id = $1`, [userId])
    return totalCount
  }

  private mapRowToNotification(row: any): Notification {
    return {
      id: row.id,
      userId: row.user_id,
      type: row.type,
      severity: row.severity,
      title: row.title,
      message: row.message,
      meta: row.meta || undefined,
      read: row.read === 1,
      timestamp: row.timestamp,
      source: row.source,
      navigateTo: row.navigate_to || undefined,
    }
  }
}

export default new NotificationRepository()
