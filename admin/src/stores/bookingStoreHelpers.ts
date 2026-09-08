import { BookingRecord, BookingStatus } from '../types/booking';
import { useNotificationStore } from './notificationStore';

export function notifyBookingCreated(newBooking: BookingRecord) {
  useNotificationStore.getState().push({
    type: 'booking',
    severity: 'success',
    title: 'New walk-in booking created',
    message: `${newBooking.guest.name} checked in · Room ${newBooking.room.roomNumber} (${newBooking.room.name}) · ${newBooking.stay.nights} nights`,
    meta: newBooking.folioNumber || newBooking.id,
    source: 'action',
    navigateTo: '/bookings',
  });
}

export function notifyStatusUpdated(target: BookingRecord, newStatus: BookingStatus) {
  useNotificationStore.getState().push({
    type: 'booking',
    severity: newStatus === 'Cancelled' ? 'urgent' : 'success',
    title: `Booking ${newStatus.toLowerCase()}`,
    message:
      newStatus === 'Checked Out'
        ? `${target.guest.name} · Room ${target.room.roomNumber} checked out. Room dispatched to housekeeping`
        : newStatus === 'Checked In'
        ? `${target.guest.name} checked in · Room ${target.room.roomNumber} · RFID keycard active`
        : `${target.guest.name} · Folio ${target.folioNumber} moved to ${newStatus}`,
    meta: target.folioNumber,
    source: 'action',
    navigateTo: '/bookings',
  });
}

export function notifyPaymentRecorded(target: BookingRecord, amount: number, paymentStatus: string) {
  useNotificationStore.getState().push({
    type: 'payment',
    severity: 'success',
    title: `Payment recorded (${paymentStatus})`,
    message: `$${amount.toLocaleString()} collected for ${target.guest.name} · Room ${target.room.roomNumber}`,
    meta: target.folioNumber,
    source: 'action',
    navigateTo: '/bookings',
  });
}

export function notifyKeycardIssued(target: BookingRecord, cardUid: string) {
  useNotificationStore.getState().push({
    type: 'keycard',
    severity: 'success',
    title: 'RFID keycard issued',
    message: `Key [${cardUid}] encoded & active for Room #${target.room.roomNumber} · ${target.guest.name}`,
    meta: cardUid,
    source: 'action',
    navigateTo: '/bookings',
  });
}

export function notifyBookingCancelled(target: BookingRecord, reason?: string) {
  useNotificationStore.getState().push({
    type: 'booking',
    severity: 'urgent',
    title: 'Booking cancelled',
    message: `${target.guest.name} · Folio ${target.folioNumber} cancelled${reason ? ` — ${reason}` : ''}`,
    meta: target.folioNumber,
    source: 'action',
    navigateTo: '/bookings',
  });
}
