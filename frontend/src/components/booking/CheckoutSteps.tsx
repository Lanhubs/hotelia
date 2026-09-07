import { cn } from '../../lib/cn'
import { CHECKOUT_STEPS, type CheckoutStep } from './checkoutStepsData'

export function CheckoutSteps({ current }: { current: CheckoutStep }) {
  const currentIndex = CHECKOUT_STEPS.indexOf(current)

  return (
    <nav aria-label="Booking progress">
      <ol className="flex items-center gap-2 md:gap-4">
        {CHECKOUT_STEPS.map((step, i) => {
          const done = i < currentIndex
          const active = i === currentIndex
          return (
            <li key={step} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-numeric text-xs transition-colors',
                  done && 'border-ink bg-ink text-paper',
                  active && 'border-bronze text-bronze-deep',
                  !done && !active && 'border-hairline text-ink-mute',
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  'hidden text-xs font-semibold uppercase tracking-[0.14em] sm:block',
                  active ? 'text-ink' : done ? 'text-ink-mute' : 'text-ink-mute/60',
                )}
              >
                {step}
              </span>
              {i < CHECKOUT_STEPS.length - 1 ? (
                <span className={cn('h-px flex-1', done ? 'bg-ink' : 'bg-hairline')} aria-hidden="true" />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}