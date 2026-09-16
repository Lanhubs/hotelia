import { useState } from 'react'
import { Calendar, Mail, Phone, Users, CreditCard, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Event } from '../../api/types'
import { useCreateEventBooking } from '../../hooks/useEvents'
import { formatNumber } from '../../lib/money'

interface BookingFormProps {
  event: Event
  onClose: () => void
}

export function BookingForm({ event, onClose }: BookingFormProps) {
  const createBooking = useCreateEventBooking()
  
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details')
const isDetails = step === 'details'
const isPayment = step === 'payment'
const isConfirmation = step === 'confirmation'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingRef, setBookingRef] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestCount: 1,
    specialRequests: '',
    ticketTierId: event.ticketTiers[0]?.id || '',
  })

  const selectedTier = event.ticketTiers.find(t => t.id === formData.ticketTierId)
  const isFree = !event.hasTickets
  const priceUSD = selectedTier?.priceUSD || 0
  const priceNaira = selectedTier?.priceNaira || 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const booking = await createBooking.mutateAsync({
        eventId: event.id,
        data: {
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          guestPhone: formData.guestPhone,
          guestCount: formData.guestCount,
          specialRequests: formData.specialRequests,
          ticketTierId: event.hasTickets ? formData.ticketTierId : undefined,
          occurrenceDate: event.startDate,
        }
      })
      setBookingRef(booking.id)
      setStep('confirmation')
    } catch (err: any) {
      setError(err.message || 'Booking failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentSubmit = async () => {
    // For paid tickets, redirect to payment
    if (event.hasTickets && bookingRef) {
      // In a real implementation, this would redirect to Paystack
      // For now, we'll simulate success
      setStep('confirmation')
    }
  }

  if (step === 'confirmation') {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 p-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-2xl font-light text-zinc-900">Booking Confirmed!</h3>
          <p className="mt-2 text-zinc-500">Your spot has been reserved for {event.title}</p>
        </div>
        {bookingRef && (
          <div className="bg-zinc-50 rounded-xl p-4 text-left space-y-2">
            <p className="text-sm text-zinc-500">Booking Reference</p>
            <p className="font-mono font-bold text-zinc-900 text-lg">{bookingRef}</p>
          </div>
        )}
        <div className="flex gap-3">
          <Link
            to="/events"
            className="flex-1 px-4 py-3 border border-zinc-200 rounded-lg text-zinc-700 font-medium hover:bg-zinc-50 transition-colors"
          >
            Back to Events
          </Link>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-bronze-deep text-white rounded-lg font-medium hover:bg-bronze-deep/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${isDetails ? 'text-bronze-deep' : 'text-zinc-400'}`}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-bronze-deep text-white">1</div>
          <span className="text-sm font-medium">Details</span>
        </div>
        <div className="flex-1 h-px bg-zinc-200 mx-4" />
        <div className={`flex items-center gap-2 ${isPayment ? 'text-bronze-deep' : 'text-zinc-400'}`}>
          <span className="text-sm font-medium">Payment</span>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-zinc-200 text-zinc-500">2</div>
        </div>
        <div className="flex-1 h-px bg-zinc-200 mx-4" />
        <div className={`flex items-center gap-2 ${isConfirmation ? 'text-bronze-deep' : 'text-zinc-400'}`}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-zinc-200 text-zinc-500">3</div>
          <span className="text-sm font-medium">Confirm</span>
        </div>
      </div>

      {isDetails && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-zinc-900">Guest Details</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.guestName}
                  onChange={e => setFormData({ ...formData, guestName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-bronze-deep/20 focus:border-bronze-deep"
                  placeholder="John Doe"
                />
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Email *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.guestEmail}
                  onChange={e => setFormData({ ...formData, guestEmail: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-bronze-deep/20 focus:border-bronze-deep"
                  placeholder="john@example.com"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Phone *</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={formData.guestPhone}
                  onChange={e => setFormData({ ...formData, guestPhone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-bronze-deep/20 focus:border-bronze-deep"
                  placeholder="+234 800 000 0000"
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Number of Guests *</label>
              <select
                value={formData.guestCount}
                onChange={e => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-bronze-deep/20 focus:border-bronze-deep"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {event.hasTickets && selectedTier && (
            <div className="p-4 bg-bronze-deep/5 border border-bronze-deep/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900">{selectedTier.name} Ticket</p>
                  <p className="text-sm text-zinc-500">{selectedTier.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-bronze-deep">₦{formatNumber(priceNaira)}</p>
                  <p className="text-sm text-zinc-500">${priceUSD} USD</p>
                </div>
              </div>
            </div>
          )}

          {event.hasTickets && event.ticketTiers.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Select Ticket Tier</label>
              <div className="space-y-2">
                {event.ticketTiers.map(tier => (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, ticketTierId: tier.id })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.ticketTierId === tier.id
                        ? 'border-bronze-deep bg-bronze-deep/5'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-zinc-900">{tier.name}</p>
                        <p className="text-sm text-zinc-500">{tier.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-zinc-900">₦{formatNumber(tier.priceNaira || tier.priceUSD * 1600)}</p>
                        <p className="text-sm text-zinc-500">${tier.priceUSD} USD</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Special Requests</label>
            <textarea
              value={formData.specialRequests}
              onChange={e => setFormData({ ...formData, specialRequests: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-bronze-deep/20 focus:border-bronze-deep"
              placeholder="Any dietary requirements, accessibility needs, or special requests..."
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-xl">
            <Calendar className="h-5 w-5 text-zinc-400 mt-0.5 shrink-0" />
            <div className="text-sm text-zinc-600">
              <p className="font-medium text-zinc-900">{event.title}</p>
              <p>{new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p>{event.startTime} – {event.endTime}</p>
              {event.venueName && <p>{event.venueName}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 bg-bronze-deep text-white rounded-lg font-medium hover:bg-bronze-deep/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              isFree ? 'Reserve My Spot' : 'Proceed to Payment'
            )}
          </button>
        </div>
      )}

      {step === 'payment' && (
        <div className="space-y-6">
          <h4 className="text-lg font-medium text-zinc-900">Payment</h4>
          <div className="p-4 bg-zinc-50 rounded-xl space-y-3">
            <p className="text-sm text-zinc-600">Complete your payment to confirm your booking.</p>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-zinc-200">
              <div>
                <p className="font-medium text-zinc-900">{selectedTier?.name || 'Standard'} Ticket</p>
                <p className="text-sm text-zinc-500">Qty: {formData.guestCount}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-bronze-deep">₦{formatNumber((priceNaira || priceUSD * 1600) * formData.guestCount)}</p>
                <p className="text-sm text-zinc-500">${priceUSD * formData.guestCount} USD</p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handlePaymentSubmit}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-bronze-deep text-white rounded-lg font-medium hover:bg-bronze-deep/90 transition-colors disabled:opacity-50"
            >
              <CreditCard className="h-5 w-5" />
              <span>Pay with Card (Paystack)</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-6 py-4 border border-zinc-200 text-zinc-700 rounded-lg font-medium hover:bg-zinc-50 transition-colors"
            >
              <span className="text-lg">🏦</span>
              <span>Bank Transfer</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setStep('details')}
            className="w-full py-3 px-6 border border-zinc-200 text-zinc-700 rounded-lg font-medium hover:bg-zinc-50 transition-colors"
          >
            Back to Details
          </button>
        </div>
      )}
    </form>
  )
}