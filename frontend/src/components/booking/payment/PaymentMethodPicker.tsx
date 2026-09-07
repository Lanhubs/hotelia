import { FaCreditCard, FaBuildingColumns, FaHotel } from 'react-icons/fa6'
import type { ReactNode } from 'react'
import type { PaymentMethod } from '../../../api/types'
import { cn } from '../../../lib/cn'

const OPTIONS: Array<{
  value: PaymentMethod
  icon: ReactNode
  title: string
  desc: string
}> = [
  {
    value: 'card',
    icon: <FaCreditCard className="h-5 w-5" />,
    title: 'Pay with card',
    desc: 'Secure card payment now. Visa, Mastercard and Verve supported.',
  },
  {
    value: 'transfer',
    icon: <FaBuildingColumns className="h-5 w-5" />,
    title: 'Pay by transfer',
    desc: 'We’ll give you bank details to transfer the amount and verify it.',
  },
  {
    value: 'pay_at_hotel',
    icon: <FaHotel className="h-5 w-5" />,
    title: 'Pay at the hotel',
    desc: 'Settle at check-in — in full or with a small deposit now.',
  },
]

export function PaymentMethodPicker({
  value,
  onChange,
  disabled,
}: {
  value: PaymentMethod | null
  onChange: (m: PaymentMethod) => void
  disabled?: boolean
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {OPTIONS.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            disabled={disabled}
            aria-pressed={active}
            className={cn(
              'flex flex-col items-start gap-3 border p-5 text-left transition-colors',
              active ? 'border-ink bg-ink text-paper' : 'border-hairline bg-paper hover:border-ink',
            )}
          >
            <span className={cn(active ? 'text-bronze-soft' : 'text-bronze-deep')}>{opt.icon}</span>
            <span>
              <span className={cn('block text-sm font-semibold', active ? 'text-paper' : 'text-ink')}>
                {opt.title}
              </span>
              <span className={cn('mt-1 block text-xs leading-relaxed', active ? 'text-paper/70' : 'text-ink-mute')}>
                {opt.desc}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}