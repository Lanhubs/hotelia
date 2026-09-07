import { config } from '../config'

interface PaystackInitResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

interface PaystackVerifyResponse {
  status: boolean
  message: string
  data: {
    status: string          // 'success' | 'failed' | 'abandoned'
    reference: string
    amount: number          // in kobo
    paid_at: string | null
    gateway_response: string
    channel: string
    currency: string
    customer: { email: string }
  }
}

class PaystackRepository {
  private get headers() {
    return {
      Authorization: `Bearer ${config.paystackSecretKey}`,
      'Content-Type': 'application/json',
    }
  }

  async initializeTransaction(params: {
    email: string
    amountKobo: number
    reference: string
    callbackUrl: string
    metadata?: Record<string, unknown>
  }): Promise<PaystackInitResponse['data']> {
    const res = await fetch(`${config.paystackBaseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        email: params.email,
        amount: params.amountKobo,
        reference: params.reference,
        callback_url: params.callbackUrl,
        metadata: params.metadata ?? {},
      }),
    })

    const json = (await res.json()) as PaystackInitResponse
    if (!json.status) throw new Error(`Paystack init failed: ${json.message}`)
    return json.data
  }

  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse['data']> {
    const res = await fetch(
      `${config.paystackBaseUrl}/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: this.headers }
    )

    const json = (await res.json()) as PaystackVerifyResponse
    if (!json.status) throw new Error(`Paystack verify failed: ${json.message}`)
    return json.data
  }

  async chargeCard(params: {
    email: string
    amountKobo: number
    reference: string
    card: {
      number: string
      cvv: string
      expiry_month: string
      expiry_year: string
    }
    pin?: string
  }) {
    const res = await fetch(`${config.paystackBaseUrl}/charge`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        email: params.email,
        amount: params.amountKobo,
        reference: params.reference,
        card: params.card,
        pin: params.pin,
      }),
    })
    const json = await res.json() as any
    if (!json.status) throw new Error(json.message || 'Charge failed')
    return json.data
  }

  async submitPin(params: { reference: string; pin: string }) {
    const res = await fetch(`${config.paystackBaseUrl}/charge/submit_pin`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        reference: params.reference,
        pin: params.pin,
      }),
    })
    const json = await res.json() as any
    if (!json.status) throw new Error(json.message || 'Submit PIN failed')
    return json.data
  }

  async submitOtp(params: { reference: string; otp: string }) {
    const res = await fetch(`${config.paystackBaseUrl}/charge/submit_otp`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        reference: params.reference,
        otp: params.otp,
      }),
    })
    const json = await res.json() as any
    if (!json.status) throw new Error(json.message || 'Submit OTP failed')
    return json.data
  }

  async submitPhone(params: { reference: string; phone: string }) {
    const res = await fetch(`${config.paystackBaseUrl}/charge/submit_phone`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        reference: params.reference,
        phone: params.phone,
      }),
    })
    const json = await res.json() as any
    if (!json.status) throw new Error(json.message || 'Submit phone failed')
    return json.data
  }

  async submitBirthday(params: { reference: string; birthday: string }) {
    const res = await fetch(`${config.paystackBaseUrl}/charge/submit_birthday`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        reference: params.reference,
        birthday: params.birthday,
      }),
    })
    const json = await res.json() as any
    if (!json.status) throw new Error(json.message || 'Submit birthday failed')
    return json.data
  }

  /** Verify a Paystack webhook HMAC-SHA512 signature */
  async verifyWebhookSignature(rawBody: string, signature: string): Promise<boolean> {
    if (!config.paystackSecretKey) return false
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(config.paystackSecretKey),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    )
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody))
    const hex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('')
    return hex === signature
  }
}

export default new PaystackRepository()