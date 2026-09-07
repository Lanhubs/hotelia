import { z } from 'zod'

export const NotificationSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  type: z.enum(['info', 'success', 'warning', 'error', 'booking', 'payment', 'system']),
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  actionUrl: z.string().url().optional(),
  isRead: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().optional(),
  readAt: z.date().optional(),
})

export type Notification = z.infer<typeof NotificationSchema>

export const CreateNotificationSchema = NotificationSchema.omit({
  id: true,
  createdAt: true,
  readAt: true,
})

export const UpdateNotificationSchema = z.object({
  isRead: z.boolean().optional(),
  isArchived: z.boolean().optional(),
})

export type CreateNotification = z.infer<typeof CreateNotificationSchema>
export type UpdateNotification = z.infer<typeof UpdateNotificationSchema>
