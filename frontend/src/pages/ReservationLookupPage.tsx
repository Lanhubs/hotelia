import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { TextInput } from '../components/shared/Field'
import { Button } from '../components/shared/Button'

export function ReservationLookupPage() {
  const navigate = useNavigate()
  const [reference, setReference] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (reference.trim().length < 5) {
      setError('Please enter your booking reference, e.g. KEO-482913.')
      return
    }
    setError('')
    const params = new URLSearchParams()
    if (email.trim()) params.set('email', email.trim())
    if (phone.trim()) params.set('phone', phone.trim())
    navigate(`/reservation/${encodeURIComponent(reference.trim())}?${params.toString()}`)
  }

  return (
    <>
      <Seo title="Find your reservation" description="Look up your reservation at KEO Experience Hotel using your booking reference." path="/reservation" />
      <PageHeader
        eyebrow="Reservations"
        title="Find your reservation"
        description="Enter your booking reference to view your stay, payment status and reservation details."
      />

      <section className="container-x py-12">
        <form onSubmit={submit} noValidate className="mx-auto max-w-xl space-y-6">
          <TextInput
            label="Booking reference"
            name="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. KEO-482913"
            hint="Found in your booking confirmation email."
            error={error}
          />
          <TextInput
            label="Email (optional)"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <TextInput
            label="Phone (optional)"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 800 000 0000"
            autoComplete="tel"
          />
          <Button type="submit" size="lg" className="w-full">
            Find my reservation
          </Button>
          <p className="text-center text-xs text-ink-mute">
            Need help? Call +234 813 014 8920 or email booking@keoexperience.com.
          </p>
        </form>
      </section>
    </>
  )
}