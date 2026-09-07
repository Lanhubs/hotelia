import notificationRepository from '../repositories/notificationRepository'
import { ValidationError, NotFoundError } from '../types/errorTypes'

export interface NotificationOutput {
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

export interface CreateNotificationInput {
  userId: string
  type: NotificationOutput['type']
  severity: NotificationOutput['severity']
  title: string
  message: string
  meta?: string
  source: 'action' | 'inbound'
  navigateTo?: string
}

class NotificationService {
  async getAllNotifications(userId: string, limit: number = 20, offset: number = 0): Promise<NotificationOutput[]> {
    if (!userId) {
      throw new ValidationError('User ID is required')
    }
    
    return await notificationRepository.getAllNotifications(userId, limit, offset)
  }

  async getUnreadCount(userId: string): Promise<number> {
    if (!userId) {
      throw new ValidationError('User ID is required')
    }
    
    return await notificationRepository.getUnreadCount(userId)
  }

  async createNotification(input: CreateNotificationInput): Promise<NotificationOutput> {
    const { userId, type, severity, title, message, source } = input
    
    if (!userId || !type || !severity || !title || !message || !source) {
      throw new ValidationError('All required fields must be provided')
    }
    
    if (title.length > 100) {
      throw new ValidationError('Title must be 100 characters or less')
    }
    
    if (message.length > 500) {
      throw new ValidationError('Message must be 500 characters or less')
    }
    
    const validTypes = ['booking', 'payment', 'keycard', 'service', 'housekeeping', 'system'] as const
    if (!validTypes.includes(type)) {
      throw new ValidationError('Invalid notification type')
    }
    
    const validSeverities = ['info', 'success', 'urgent'] as const
    if (!validSeverities.includes(severity)) {
      throw new ValidationError('Invalid notification severity')
    }
    
    const validSources = ['action', 'inbound'] as const
    if (!validSources.includes(source)) {
      throw new ValidationError('Invalid notification source')
    }
    
    return await notificationRepository.createNotification(input)
  }

  async markAsRead(id: string): Promise<boolean> {
    if (!id) {
      throw new ValidationError('Notification ID is required')
    }
    
    const success = await notificationRepository.markAsRead(id)
    if (!success) {
      throw new NotFoundError('Notification not found')
    }
    
    return success
  }

  async markAllAsRead(userId: string): Promise<number> {
    if (!userId) {
      throw new ValidationError('User ID is required')
    }
    
    return await notificationRepository.markAllAsRead(userId)
  }

  async deleteNotification(id: string): Promise<boolean> {
    if (!id) {
      throw new ValidationError('Notification ID is required')
    }
    
    const success = await notificationRepository.deleteNotification(id)
    if (!success) {
      throw new NotFoundError('Notification not found')
    }
    
    return success
  }

  async deleteAllNotifications(userId: string): Promise<number> {
    if (!userId) {
      throw new ValidationError('User ID is required')
    }
    
    return await notificationRepository.deleteAllNotifications(userId)
  }

  async sendBookingNotification(userId: string, title: string, message: string, meta?: string, navigateTo?: string): Promise<NotificationOutput> {
    return await this.createNotification({
      userId,
      type: 'booking',
      severity: 'info',
      title,
      message,
      meta,
      source: 'inbound',
      navigateTo,
    })
  }

  async sendPaymentNotification(userId: string, title: string, message: string, meta?: string, navigateTo?: string): Promise<NotificationOutput> {
    return await this.createNotification({
      userId,
      type: 'payment',
      severity: 'success',
      title,
      message,
      meta,
      source: 'inbound',
      navigateTo,
    })
  }

  async sendKeycardNotification(userId: string, title: string, message: string, meta?: string, navigateTo?: string): Promise<NotificationOutput> {
    return await this.createNotification({
      userId,
      type: 'keycard',
      severity: 'info',
      title,
      message,
      meta,
      source: 'inbound',
      navigateTo,
    })
  }

  async sendServiceNotification(userId: string, title: string, message: string, meta?: string, navigateTo?: string): Promise<NotificationOutput> {
    return await this.createNotification({
      userId,
      type: 'service',
      severity: 'info',
      title,
      message,
      meta,
      source: 'action',
      navigateTo,
    })
  }

  async sendHousekeepingNotification(userId: string, title: string, message: string, meta?: string, navigateTo?: string): Promise<NotificationOutput> {
    return await this.createNotification({
      userId,
      type: 'housekeeping',
      severity: 'info',
      title,
      message,
      meta,
      source: 'action',
      navigateTo,
    })
  }

  async sendSystemNotification(userId: string, title: string, message: string, meta?: string, navigateTo?: string): Promise<NotificationOutput> {
    return await this.createNotification({
      userId,
      type: 'system',
      severity: 'urgent',
      title,
      message,
      meta,
      source: 'action',
      navigateTo,
    })
  }
}

export default new NotificationService()
