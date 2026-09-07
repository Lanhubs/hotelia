import { getDatabase } from '../database'

export interface PaymentRow {
  id: string
  booking_reference: string
  paystack_reference: string | null
  idempotency_key: string | null
  amount: number
  amount_kobo: number
  method: string
  gateway: string
  status: string
  authorization_url: string | null
  access_code: string | null
  transfer_bank_name: string | null
  transfer_account_name: string | null
  transfer_account_number: string | null
  transfer_expires_at: string | null
  paid_at: string | null
  created_at: string
}

class PaymentRepository {
  async create(data: {
    bookingReference: string
    paystackReference?: string
    idempotencyKey?: string
    amount: number
    amountKobo: number
    method: string
    authorizationUrl?: string
    accessCode?: string
    transferBankName?: string
    transferAccountName?: string
    transferAccountNumber?: string
    transferExpiresAt?: string
  }): Promise<PaymentRow> {
    const db = getDatabase()
    return await db.queryOne<PaymentRow>(
      `INSERT INTO payments (
        booking_reference, paystack_reference, idempotency_key,
        amount, amount_kobo, method, authorization_url, access_code,
        transfer_bank_name, transfer_account_name, transfer_account_number, transfer_expires_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [
        data.bookingReference, data.paystackReference ?? null, data.idempotencyKey ?? null,
        data.amount, data.amountKobo, data.method,
        data.authorizationUrl ?? null, data.accessCode ?? null,
        data.transferBankName ?? null, data.transferAccountName ?? null,
        data.transferAccountNumber ?? null, data.transferExpiresAt ?? null,
      ]
    ) as unknown as PaymentRow
  }

  async findByIdempotencyKey(key: string): Promise<PaymentRow | null> {
    const db = getDatabase()
    return await db.queryOne<PaymentRow>(
      `SELECT * FROM payments WHERE idempotency_key = $1`,
      [key]
    )
  }

  async findByPaystackReference(ref: string): Promise<PaymentRow | null> {
    const db = getDatabase()
    return await db.queryOne<PaymentRow>(
      `SELECT * FROM payments WHERE paystack_reference = $1`,
      [ref]
    )
  }

  async markPaid(paystackRef: string, paidAt: string): Promise<void> {
    const db = getDatabase()
    await db.query(
      `UPDATE payments SET status = 'success', paid_at = $1 WHERE paystack_reference = $2`,
      [paidAt, paystackRef]
    )
  }

  async markFailed(paystackRef: string): Promise<void> {
    const db = getDatabase()
    await db.query(
      `UPDATE payments SET status = 'failed' WHERE paystack_reference = $1`,
      [paystackRef]
    )
  }
}

export default new PaymentRepository()