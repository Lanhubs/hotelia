import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Seo } from '../components/seo/Seo'
import { CheckoutLayout } from '../components/booking/CheckoutLayout'
import { TextInput, TextAreaInput } from '../components/shared/Field'
import { Button } from '../components/shared/Button'
import { useCheckoutStore } from '../stores/checkoutStore'

interface Errors {
  fullName?: string
  email?: string
  phone?: string
}

export function GuestStepPage() {
  const navigate = useNavigate()
  const guest = useCheckoutStore((s) => s.guest)
  const setGuest = useCheckoutStore((s) => s.setGuest)
  const [errors, setErrors] = useState<Errors>({})

  const validate = (): boolean => {
    const next: Errors = {}
    if (guest.fullName.trim().length < 3) next.fullName = 'Please enter the lead guest’s full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) next.email = 'Please enter a valid email address.'
    if (guest.phone.trim().length < 7) next.phone = 'Please enter a valid phone number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    navigate('/booking/extras')
  }

  return (
    <>
      <Seo title="Guest information" description="Enter your details for your stay at KEO Experience." path="/booking/guest" />
      <CheckoutLayout step="Guest">
        <div>
          <h1 className="text-3xl font-light">Guest information</h1>
          <p className="mt-2 text-sm text-ink-mute">
            We only ask for what we need to confirm your reservation.
          </p>

          <form onSubmit={submit} noValidate className="mt-8 space-y-6">
            <TextInput
              label="Full name"
              name="fullName"
              value={guest.fullName}
              onChange={(e) => setGuest({ ...guest, fullName: e.target.value })}
              placeholder="e.g. Adaeze Okonkwo"
              autoComplete="name"
              error={errors.fullName}
            />
            <TextInput
              label="Email"
              name="email"
              type="email"
              value={guest.email}
              onChange={(e) => setGuest({ ...guest, email: e.target.value })}
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email}
            />
            <TextInput
              label="Phone"
              name="phone"
              type="tel"
              value={guest.phone}
              onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
              placeholder="+234 800 000 0000"
              autoComplete="tel"
              error={errors.phone}
            />
            <TextAreaInput
              label="Special requests (optional)"
              name="specialRequest"
              value={guest.specialRequest}
              onChange={(e) => setGuest({ ...guest, specialRequest: e.target.value })}
              hint="Late arrival, dietary needs, room preferences — anything we should know."
            />

            <div className="flex items-center justify-between gap-4 border-t border-hairline pt-6">
              <Button type="button" variant="ghost" onClick={() => navigate('/booking/review')}>
                Back
              </Button>
              <Button type="submit">Continue to extras</Button>
            </div>
          </form>
        </div>
      </CheckoutLayout>
    </>
  )
}