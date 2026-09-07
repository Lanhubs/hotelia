import paystackRepo from '../repositories/paystackRepository'
import paymentRepo from '../repositories/paymentRepository'
import { getDatabase } from '../database'
import { config } from '../config'

export interface PaymentInitResult {
  reference: string
  gateway: 'paystack'
  method: string
  amount: number
  redirectUrl?: string
  authorizationUrl?: string
  accessCode?: string
  transferInstructions?: {
    provider: string
    bankName: string
    accountName: string
    accountNumber: string
    reference: string
    amount: number
    expiresAt?: string
  }
}

export interface PaymentVerifyResult {
  state: string
  reference: string
  amount: number
  paidAt?: string
}

class PaymentService {
  async initialize(params: {
    bookingReference: string
    amount: number       // amount in NGN (kobo = amount * 100)
    method: string
    email: string
    idempotencyKey?: string
    depositAmount?: number
  }): Promise<PaymentInitResult> {
    const db = getDatabase()

    // Idempotency check
    if (params.idempotencyKey) {
      const existing = await paymentRepo.findByIdempotencyKey(params.idempotencyKey)
      if (existing) return this.formatInit(existing, params.method)
    }

    // Server-side: re-fetch authoritative amount from DB
    const booking = await db.queryOne<{ total_amount: number; guest_email: string }>(
      `SELECT total_amount, guest_email FROM bookings WHERE reference = $1`,
      [params.bookingReference]
    )
    if (!booking) throw new Error('Booking not found')

    const serverAmount = Number(booking.total_amount)
    const chargeAmount = params.method === 'deposit'
      ? Math.round(serverAmount * config.depositRate)
      : serverAmount
    const amountKobo = Math.round(chargeAmount * 100)

    const paystackRef = `KEO-PAY-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
    const callbackUrl = `${config.frontendUrl}/booking/confirmation?ref=${paystackRef}`

    if (params.method === 'card' || params.method === 'deposit') {
      const psData = await paystackRepo.initializeTransaction({
        email: booking.guest_email,
        amountKobo,
        reference: paystackRef,
        callbackUrl,
        metadata: { bookingReference: params.bookingReference, internal: true },
      })

      const row = await paymentRepo.create({
        bookingReference: params.bookingReference,
        paystackReference: paystackRef,
        idempotencyKey: params.idempotencyKey,
        amount: chargeAmount,
        amountKobo,
        method: params.method,
        authorizationUrl: psData.authorization_url,
        accessCode: psData.access_code,
      })

      return this.formatInit(row, params.method)
    }

    // Bank transfer: generate virtual account details (static for now; integrate Paystack Virtual Account API when needed)
    const transferExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const row = await paymentRepo.create({
      bookingReference: params.bookingReference,
      paystackReference: paystackRef,
      idempotencyKey: params.idempotencyKey,
      amount: chargeAmount,
      amountKobo,
      method: 'transfer',
      transferBankName: 'GTBank',
      transferAccountName: 'KEO Experience Hotel',
      transferAccountNumber: '0123456789',
      transferExpiresAt,
    })

    return this.formatInit(row, 'transfer')
  }

  async verify(paystackReference: string): Promise<PaymentVerifyResult> {
    const db = getDatabase()
    const psData = await paystackRepo.verifyTransaction(paystackReference)

    const state = psData.status === 'success' ? 'success' : psData.status === 'failed' ? 'failed' : 'pending'

    if (state === 'success') {
      await paymentRepo.markPaid(paystackReference, psData.paid_at ?? new Date().toISOString())
      // Update booking
      const row = await paymentRepo.findByPaystackReference(paystackReference)
      if (row) {
        await db.query(
          `UPDATE bookings SET amount_paid = amount_paid + $1, balance_due = GREATEST(0, balance_due - $1),
           payment_status = 'success', paid_at = NOW() WHERE reference = $2`,
          [row.amount, row.booking_reference]
        )
      }
    }

    return {
      state,
      reference: paystackReference,
      amount: Math.round(psData.amount / 100),
      paidAt: psData.paid_at ?? undefined,
    }
  }

  async handleWebhook(rawBody: string, signature: string): Promise<void> {
    const valid = await paystackRepo.verifyWebhookSignature(rawBody, signature)
    if (!valid) throw new Error('Invalid webhook signature')

    const event = JSON.parse(rawBody) as { event: string; data: any }
    if (event.event !== 'charge.success') return

    const psRef: string = event.data.reference
    await this.verify(psRef)
  }

  async chargeCard(params: {
    bookingReference: string
    card: { number: string; cvv: string; expiry_month: string; expiry_year: string }
    pin?: string
  }) {
    const db = getDatabase()
    const booking = await db.queryOne<{ total_amount: number; guest_email: string }>(
      `SELECT total_amount, guest_email FROM bookings WHERE reference = $1`,
      [params.bookingReference]
    )
    if (!booking) throw new Error('Booking not found')

    const amountKobo = Math.round(Number(booking.total_amount) * 100)
    const paystackRef = `KEO-CHARGE-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

    const res = await paystackRepo.chargeCard({
      email: booking.guest_email,
      amountKobo,
      reference: paystackRef,
      card: params.card,
      pin: params.pin,
    })

    return {
      status: res.status, // e.g. 'send_pin', 'send_otp', 'send_phone', 'send_birthday', 'success', 'failed'
      reference: res.reference || paystackRef,
      displayText: res.display_text,
      url: res.url,
    }
  }

  async submitPin(reference: string, pin: string) {
    const res = await paystackRepo.submitPin({ reference, pin })
    return {
      status: res.status,
      reference: res.reference || reference,
      displayText: res.display_text,
    }
  }

  async submitOtp(reference: string, otp: string) {
    const res = await paystackRepo.submitOtp({ reference, otp })
    if (res.status === 'success') {
      await this.verify(reference)
    }
    return {
      status: res.status,
      reference: res.reference || reference,
      displayText: res.display_text,
    }
  }

  async submitPhone(reference: string, phone: string) {
    const res = await paystackRepo.submitPhone({ reference, phone })
    return {
      status: res.status,
      reference: res.reference || reference,
      displayText: res.display_text,
    }
  }

  async submitBirthday(reference: string, birthday: string) {
    const res = await paystackRepo.submitBirthday({ reference, birthday })
    return {
      status: res.status,
      reference: res.reference || reference,
      displayText: res.display_text,
    }
  }

  private formatInit(row: any, method: string): PaymentInitResult {
    return {
      reference: row.paystack_reference ?? row.booking_reference,
      gateway: 'paystack',
      method,
      amount: Number(row.amount),
      authorizationUrl: row.authorization_url ?? undefined,
      accessCode: row.access_code ?? undefined,
      transferInstructions: row.transfer_account_number ? {
        provider: 'Bank Transfer',
        bankName: row.transfer_bank_name,
        accountName: row.transfer_account_name,
        accountNumber: row.transfer_account_number,
        reference: row.paystack_reference,
        amount: Number(row.amount),
        expiresAt: row.transfer_expires_at,
      } : undefined,
    }
  }
}

export default new PaymentService()
