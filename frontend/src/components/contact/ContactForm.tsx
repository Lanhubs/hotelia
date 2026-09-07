import { useState } from 'react'
import { FaCircleCheck } from 'react-icons/fa6'
import { TextInput, TextAreaInput, SelectInput } from '../shared/Field'
import { Button } from '../shared/Button'

const types = ['Booking enquiry', 'Event enquiry', 'General']

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    window.setTimeout(() => {
      setPending(false)
      setSubmitted(true)
    }, 600)
  }

  if (submitted) {
    return (
      <div className="border border-hairline bg-paper-soft/50 p-10 text-center">
        <FaCircleCheck className="mx-auto h-9 w-9 text-bronze-deep" />
        <h3 className="mt-4 text-xl">Message sent</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-mute">
          Thank you for reaching out. Our team will get back to you shortly. For urgent matters, please call.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <SelectInput label="Enquiry type" name="type" defaultValue="Booking enquiry">
        {types.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </SelectInput>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextInput label="Full name" name="name" required placeholder="Your name" autoComplete="name" />
        <TextInput label="Email" name="email" type="email" required placeholder="you@example.com" autoComplete="email" />
      </div>
      <TextInput label="Phone" name="phone" type="tel" placeholder="+234 800 000 0000" autoComplete="tel" />
      <TextAreaInput label="Message" name="message" required placeholder="How can we help?" />
      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}