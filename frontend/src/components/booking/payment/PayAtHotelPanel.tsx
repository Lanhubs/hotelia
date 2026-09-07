import { FaHotel, FaPiggyBank } from 'react-icons/fa6'
import { formatNaira } from '../../../lib/money'
import { cn } from '../../../lib/cn'

export function PayAtHotelPanel({
  total,
  deposit,
  mode,
  onModeChange,
}: {
  total: number
  deposit: number
  mode: 'full' | 'deposit' | null
  onModeChange: (m: 'full' | 'deposit') => void
}) {
  const options = [
    {
      value: 'full' as const,
      icon: <FaHotel className="h-5 w-5" />,
      title: 'Pay in full at check-in',
      desc: 'No charge now. Settle the full balance when you arrive at the hotel.',
      amount: total,
      label: `Due at check-in: ${formatNaira(total)}`,
    },
    {
      value: 'deposit' as const,
      icon: <FaPiggyBank className="h-5 w-5" />,
      title: 'Pay a deposit now',
      desc: 'Secure your stay with a small deposit today. Pay the rest at check-in.',
      amount: deposit,
      label: `Deposit today: ${formatNaira(deposit)}`,
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((opt) => {
        const active = mode === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onModeChange(opt.value)}
            aria-pressed={active}
            className={cn(
              'flex flex-col items-start gap-3 border p-5 text-left transition-colors',
              active ? 'border-ink bg-ink text-paper' : 'border-hairline bg-paper hover:border-ink',
            )}
          >
            <span className={cn(active ? 'text-bronze-soft' : 'text-bronze-deep')}>{opt.icon}</span>
            <span>
              <span className={cn('block text-sm font-semibold', active ? 'text-paper' : 'text-ink')}>{opt.title}</span>
              <span className={cn('mt-1 block text-xs leading-relaxed', active ? 'text-paper/70' : 'text-ink-mute')}>
                {opt.desc}
              </span>
            </span>
            <span className={cn('mt-1 font-numeric text-sm font-semibold', active ? 'text-bronze-soft' : 'text-ink')}>
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}