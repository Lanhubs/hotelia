declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackOptions) => {
        openIframe: () => void
      }
      newTransaction?: (options: any) => void
    }
  }
}

export interface PaystackOptions {
  key: string
  email: string
  amount: number // In Kobo (NGN * 100)
  ref?: string
  currency?: string
  channels?: string[]
  metadata?: Record<string, unknown>
  callback: (response: { reference: string; status: string; trans?: string; transaction?: string; message?: string }) => void
  onClose: () => void
}

let scriptLoadingPromise: Promise<void> | null = null

export function loadPaystackScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Window is not defined'))
  if (window.PaystackPop) return Promise.resolve()
  if (scriptLoadingPromise) return scriptLoadingPromise

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = (err) => {
      scriptLoadingPromise = null
      reject(new Error('Failed to load Paystack Inline SDK: ' + String(err)))
    }
    document.head.appendChild(script)
  })

  return scriptLoadingPromise
}

export async function openPaystackInline(options: PaystackOptions): Promise<void> {
  await loadPaystackScript()
  if (!window.PaystackPop) {
    throw new Error('Paystack SDK is unavailable')
  }

  const handler = window.PaystackPop.setup(options)
  handler.openIframe()
}
