import { cn } from '../../lib/cn'
import { todayISO, addDaysISO } from '../../lib/dates'

export function DateSelector({
  checkIn,
  checkOut,
  onChange,
}: {
  checkIn: string
  checkOut: string
  onChange: (checkIn: string, checkOut: string) => void
}) {
  const minCheckOut = addDaysISO(checkIn || todayISO(), 1)

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label htmlFor="check-in" className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-mute">
          Check-in
        </label>
        <input
          id="check-in"
          type="date"
          value={checkIn}
          min={todayISO()}
          onChange={(e) => {
            const value = e.target.value
            onChange(value, value ? addDaysISO(value, 1) : checkOut)
          }}
          className={cn(
            'w-full border border-hairline bg-transparent px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none',
          )}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="check-out" className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-mute">
          Check-out
        </label>
        <input
          id="check-out"
          type="date"
          value={checkOut}
          min={minCheckOut}
          onChange={(e) => onChange(checkIn, e.target.value)}
          className="w-full border border-hairline bg-transparent px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
        />
      </div>
    </div>
  )
}