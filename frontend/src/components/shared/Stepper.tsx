import { FaMinus, FaPlus } from 'react-icons/fa6'
import { cn } from '../../lib/cn'
import { clamp } from '../../lib/cn'

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 9,
  label,
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      {label ? <span className="text-sm text-ink">{label}</span> : null}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Decrease"
          disabled={value <= min}
          onClick={() => onChange(clamp(value - 1, min, max))}
          className="flex h-9 w-9 items-center justify-center border border-ink/20 text-ink transition-colors hover:border-ink disabled:opacity-35"
        >
          <FaMinus className="h-3 w-3" />
        </button>
        <span className={cn('w-8 text-center text-sm font-semibold font-numeric')}>{value}</span>
        <button
          type="button"
          aria-label="Increase"
          disabled={value >= max}
          onClick={() => onChange(clamp(value + 1, min, max))}
          className="flex h-9 w-9 items-center justify-center border border-ink/20 text-ink transition-colors hover:border-ink disabled:opacity-35"
        >
          <FaPlus className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}