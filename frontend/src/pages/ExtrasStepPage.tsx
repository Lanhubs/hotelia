import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Seo } from '../components/seo/Seo'
import { CheckoutLayout } from '../components/booking/CheckoutLayout'
import { Button } from '../components/shared/Button'
import { Skeleton } from '../components/shared/Skeleton'
import { useExtras } from '../hooks/useHotel'
import { useCheckoutStore } from '../stores/checkoutStore'
import { useCreateBooking } from '../hooks/useBooking'
import { formatNaira, formatNumber } from '../lib/money'
import { cn } from '../lib/cn'

export function ExtrasStepPage() {
  const navigate = useNavigate()
  const { data: extras, isLoading } = useExtras()
  const selected = useCheckoutStore((s) => s.extras)
  const setExtras = useCheckoutStore((s) => s.setExtras)
  const room = useCheckoutStore((s) => s.room)
  const search = useCheckoutStore((s) => s.search)
  const guest = useCheckoutStore((s) => s.guest)
  const setBooking = useCheckoutStore((s) => s.setBooking)
  const createBooking = useCreateBooking()
  const [error, setError] = useState<string | null>(null)

  // Redirect if required data is missing
  if (!room || !search) {
    navigate('/booking/review')
    return null
  }
  
  if (!guest.email?.trim() || !guest.fullName?.trim()) {
    navigate('/booking/guest')
    return null
  }

  const toggle = (id: string) => {
    const exists = selected.some((e) => e.id === id)
    if (exists) {
      setExtras(selected.filter((e) => e.id !== id))
    } else {
      const extra = extras?.find((e) => e.id === id)
      if (extra) setExtras([...selected, extra])
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!room) {
      setError('No room selected. Please go back and select a room.')
      return
    }
    
    if (!room.id && !room.slug) {
      setError('Room information is incomplete (missing ID and slug). Please go back and select a room again.')
      return
    }
    
    if (!search) {
      setError('No search dates selected. Please go back and select dates.')
      return
    }
    
    if (!guest.email?.trim() || !guest.fullName?.trim()) {
      setError('Guest information is incomplete. Please go back and fill in your details.')
      return
    }
    
    try {
      const booking = await createBooking.mutateAsync({ search, room, guest, extras: selected })
      setBooking(booking)
      navigate('/booking/payment')
    } catch (error: any) {
      console.error('Booking creation failed:', error)
      setError(error?.message || 'Failed to create booking. Please try again.')
    }
  }

  return (
    <>
      <Seo title="Add extras" description="Add optional extras to your stay at KEO Experience." path="/booking/extras" />
      <CheckoutLayout step="Extras">
        <div>
          <h1 className="text-3xl font-light">Optional extras</h1>
          <p className="mt-2 text-sm text-ink-mute">
            Add a little extra comfort to your stay. You can skip this — these are all optional.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {error && (
              <div className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-800">
                {error}
              </div>
            )}
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-36 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {extras?.map((extra) => {
                  const active = selected.some((e) => e.id === extra.id)
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => toggle(extra.id)}
                      aria-pressed={active}
                      className={cn(
                        'flex flex-col justify-between border p-5 text-left transition-colors',
                        active ? 'border-ink bg-ink text-paper' : 'border-hairline bg-paper hover:border-ink',
                      )}
                    >
                      <div>
                        <p className={cn('text-sm font-semibold', active ? 'text-paper' : 'text-ink')}>{extra.name}</p>
                        <p className={cn('mt-1 text-xs leading-relaxed', active ? 'text-paper/70' : 'text-ink-mute')}>
                          {extra.description}
                        </p>
                      </div>
                      <p className={cn('mt-4 font-numeric text-sm font-semibold', active ? 'text-bronze-soft' : 'text-ink')}>
                        {extra.price > 0 ? formatNaira(extra.price) : 'Free'}
                        {extra.perNight ? ' / night' : ' / stay'}
                      </p>
                    </button>
                  )
                })}
              </div>
            )}

            <div className="flex items-center justify-between gap-4 border-t border-hairline pt-6">
              <Button type="button" variant="ghost" onClick={() => navigate('/booking/guest')}>
                Back
              </Button>
              <Button type="submit" disabled={createBooking.isPending}>
                {createBooking.isPending ? 'Creating reservation…' : `Continue to payment${selected.length ? ` · ${formatNumber(selected.length)} selected` : ''}`}
              </Button>
            </div>
          </form>
        </div>
      </CheckoutLayout>
    </>
  )
}