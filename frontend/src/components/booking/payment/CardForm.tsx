import { useState } from 'react'
import { FaLock, FaCreditCard } from 'react-icons/fa6'
import { formatNaira } from '../../../lib/money'
import { cn } from '../../../lib/cn'
import { Button } from '../../shared/Button'

function digits(value: string): string {
  return value.replace(/\D/g, '')
}

function formatCardNumber(value: string): string {
  return digits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(value: string): string {
  const d = digits(value).slice(0, 4)
  if (d.length <= 2) return d
  return `${d.slice(0, 2)}/${d.slice(2)}`
}

function validExpiry(value: string): boolean {
  const m = value.match(/^(\d{2})\/(\d{2})$/)
  if (!m) return false
  const month = Number(m[1])
  if (month < 1 || month > 12) return false
  const year = 2000 + Number(m[2])
  const now = new Date()
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}

export function CardForm({
  amount,
  onPay,
  busy,
}: {
  amount: number
  onPay: (payload: { cardholderName: string; number: string; expiry: string; cvc: string }) => void
  busy: boolean
}) {
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [touched, setTouched] = useState(false)

  const cardValid = digits(number).length === 16
  const cvcValid = cvc.length >= 3 && cvc.length <= 4
  const formValid = name.trim().length > 0 && cardValid && validExpiry(expiry) && cvcValid

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!formValid) return
    onPay({ cardholderName: name.trim(), number: digits(number), expiry, cvc })
  }

  const field = (hasError: boolean) =>
    cn(
      'w-full border bg-paper px-4 py-3 text-sm outline-none transition-colors',
      hasError ? 'border-error' : 'border-hairline focus:border-ink',
    )

  const err = (show: boolean) => (show ? 'text-xs text-error' : 'hidden')

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center gap-3 border border-hairline bg-paper-soft/40 p-5">
        <FaCreditCard className="h-6 w-6 text-bronze-deep" />
        <div className="flex-1">
          <p className="text-sm text-ink-mute">Amount to charge</p>
          <p className="font-numeric text-2xl font-semibold text-ink">{formatNaira(amount)}</p>
        </div>
      </div>

      <div>
        <label htmlFor="card-name" className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-mute">
          Cardholder name
        </label>
        <input
          id="card-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="cc-name"
          placeholder="Name on card"
          className={field(touched && name.trim().length === 0)}
        />
        <p className={err(touched && name.trim().length === 0)}>Enter the name on your card.</p>
      </div>

      <div>
        <label htmlFor="card-number" className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-mute">
          Card number
        </label>
        <input
          id="card-number"
          value={number}
          onChange={(e) => setNumber(formatCardNumber(e.target.value))}
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="4242 4242 4242 4242"
          className={field(touched && !cardValid)}
        />
        <p className={err(touched && !cardValid)}>Enter a valid 16-digit card number.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="card-expiry" className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-mute">
            Expiry
          </label>
          <input
            id="card-expiry"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            className={field(touched && !validExpiry(expiry))}
          />
          <p className={err(touched && !validExpiry(expiry))}>Use MM/YY.</p>
        </div>
        <div>
          <label htmlFor="card-cvc" className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-mute">
            CVC
          </label>
          <input
            id="card-cvc"
            value={cvc}
            onChange={(e) => setCvc(digits(e.target.value).slice(0, 4))}
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            className={field(touched && !cvcValid)}
          />
          <p className={err(touched && !cvcValid)}>3–4 digits.</p>
        </div>
      </div>

      <Button type="submit" disabled={busy} className="w-full">
        {busy ? 'Processing…' : `Pay ${formatNaira(amount)}`}
      </Button>

      <p className="flex items-center justify-center gap-2 text-xs text-ink-mute">
        <FaLock className="h-3 w-3" /> Payments are processed securely by our payment partner. We never store your card details.
      </p>
    </form>
  )
}