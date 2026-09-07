import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Seo } from '../components/seo/Seo'
import { CheckoutLayout } from '../components/booking/CheckoutLayout'
import { PaymentStatus } from '../components/booking/PaymentStatus'
import { PaymentMethodPicker } from '../components/booking/payment/PaymentMethodPicker'
import { CardForm } from '../components/booking/payment/CardForm'
import { TransferPanel } from '../components/booking/payment/TransferPanel'
import { PayAtHotelPanel } from '../components/booking/payment/PayAtHotelPanel'
import { Button } from '../components/shared/Button'
import { useCheckoutStore } from '../stores/checkoutStore'
import { useInitializePayment, useSetPaymentMethod, useVerifyPaymentMutation, useInvalidateReservation } from '../hooks/usePayment'
import { useHotel } from '../hooks/useHotel'
import { formatNaira } from '../lib/money'
import { chargeCard, submitPin, submitOtp, submitPhone, submitBirthday } from '../api/payments'
import type { PaymentMethod, PaymentState } from '../api/types'

export function PaymentStepPage() {
  const navigate = useNavigate()
  const booking = useCheckoutStore((s) => s.booking)
  const payment = useCheckoutStore((s) => s.payment)
  const setPayment = useCheckoutStore((s) => s.setPayment)
  const setBooking = useCheckoutStore((s) => s.setBooking)
  const invalidate = useInvalidateReservation()
  const { data: hotel } = useHotel()

  const init = useInitializePayment()
  const verify = useVerifyPaymentMutation()
  const methodSet = useSetPaymentMethod()

  const [method, setMethod] = useState<PaymentMethod | null>(null)
  const [payMode, setPayMode] = useState<'full' | 'deposit' | null>(null)
  const [localState, setLocalState] = useState<PaymentState | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const total = booking?.financials.totalAmount ?? 0
  const depositRate = hotel?.payment.depositRate ?? 0.25
  const depositAmount = Math.round(total * depositRate)

  if (booking && (booking.paymentState === 'success' || booking.paymentState === 'pay_at_hotel'))
    return <Navigate to="/booking/confirmation" replace />

  const [authStep, setAuthStep] = useState<'pin' | 'otp' | 'phone' | 'birthday' | null>(null)
  const [authInput, setAuthInput] = useState('')
  const [authPrompt, setAuthPrompt] = useState('')
  const [activePaystackRef, setActivePaystackRef] = useState('')

  const handleCardPay = async (cardDetails?: { number: string; cvc: string; expiry: string; cardholderName: string }) => {
    if (!booking) return
    setBusy(true)
    setErrorMessage(null)
    setLocalState('processing')
    try {
      if (cardDetails) {
        const [expMonth, expYear] = cardDetails.expiry.split('/')
        const res = await chargeCard({
          bookingReference: booking.reference,
          card: {
            number: cardDetails.number.replace(/\s+/g, ''),
            cvv: cardDetails.cvc,
            expiry_month: expMonth,
            expiry_year: expYear,
          },
        })

        setActivePaystackRef(res.reference)

        if (res.status === 'send_pin') {
          setAuthStep('pin')
          setAuthPrompt(res.displayText || 'Enter your card PIN')
          setBusy(false)
          return
        } else if (res.status === 'send_otp') {
          setAuthStep('otp')
          setAuthPrompt(res.displayText || 'Enter the OTP sent to your phone/email')
          setBusy(false)
          return
        } else if (res.status === 'send_phone') {
          setAuthStep('phone')
          setAuthPrompt(res.displayText || 'Enter your phone number registered with bank')
          setBusy(false)
          return
        } else if (res.status === 'send_birthday') {
          setAuthStep('birthday')
          setAuthPrompt(res.displayText || 'Enter your birthday (YYYY-MM-DD)')
          setBusy(false)
          return
        } else if (res.status === 'success') {
          await verify.mutateAsync(res.reference)
          invalidate(booking.reference)
          navigate(`/booking/confirmation/${booking.reference}`)
          return
        }
      }

      // Fallback redirect if standard initialization
      const chargeAmount = method === 'pay_at_hotel' && payMode === 'deposit' ? depositAmount : total
      const idempotencyKey = `pay-${booking.reference}-${Date.now()}`

      const p = await init.mutateAsync({
        bookingReference: booking.reference,
        amount: chargeAmount,
        method: 'card',
        idempotencyKey,
      })
      setPayment(p)

      if (p.authorizationUrl || p.redirectUrl) {
        window.location.href = (p.authorizationUrl || p.redirectUrl)!
      } else {
        await verify.mutateAsync(p.reference)
        invalidate(booking.reference)
        navigate(`/booking/confirmation/${p.reference}`)
      }
    } catch (err: any) {
      setLocalState('failed')
      setErrorMessage(err.message || 'Unable to process card payment.')
      setBusy(false)
    }
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authInput || !activePaystackRef) return
    setBusy(true)
    setErrorMessage(null)
    try {
      let res: { status: string; reference: string; displayText?: string }
      if (authStep === 'pin') {
        res = await submitPin(activePaystackRef, authInput)
      } else if (authStep === 'otp') {
        res = await submitOtp(activePaystackRef, authInput)
      } else if (authStep === 'phone') {
        res = await submitPhone(activePaystackRef, authInput)
      } else if (authStep === 'birthday') {
        res = await submitBirthday(activePaystackRef, authInput)
      } else {
        return
      }

      setAuthInput('')

      if (res.status === 'send_otp') {
        setAuthStep('otp')
        setAuthPrompt(res.displayText || 'Enter the OTP sent to your phone/email')
        setBusy(false)
      } else if (res.status === 'send_phone') {
        setAuthStep('phone')
        setAuthPrompt(res.displayText || 'Enter your phone number registered with bank')
        setBusy(false)
      } else if (res.status === 'send_birthday') {
        setAuthStep('birthday')
        setAuthPrompt(res.displayText || 'Enter your birthday (YYYY-MM-DD)')
        setBusy(false)
      } else if (res.status === 'success') {
        setAuthStep(null)
        await verify.mutateAsync(res.reference || activePaystackRef)
        if (booking) invalidate(booking.reference)
        navigate(`/booking/confirmation/${booking?.reference}`)
      } else {
        setErrorMessage(res.displayText || 'Verification status pending. Check confirmation.')
        setBusy(false)
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification step failed.')
      setBusy(false)
    }
  }

  const onMethodChange = async (m: PaymentMethod) => {
    setMethod(m)
    setPayMode(null)
    setErrorMessage(null)
    if (m === 'transfer' && booking && !payment) {
      try {
        const p = await init.mutateAsync({
          bookingReference: booking.reference,
          amount: total,
          method: 'transfer',
          idempotencyKey: `tf-${booking.reference}`,
        })
        if (p) setPayment(p)
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to generate transfer details')
      }
    }
  }

  const confirmMethod = async (m: PaymentMethod, deposit = 0) => {
    if (!booking) return
    setBusy(true)
    setErrorMessage(null)
    try {
      const updated = await methodSet.mutateAsync({ reference: booking.reference, method: m, depositAmount: deposit })
      if (updated) setBooking(updated)
      invalidate(booking.reference)
      navigate('/booking/confirmation')
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not confirm payment selection')
    } finally {
      setBusy(false)
    }
  }

  if (!booking) {
    return (
      <CheckoutLayout step="Payment">
        <p className="text-sm text-ink-mute">No reservation to pay for. Please start a new booking.</p>
        <Button className="mt-4" onClick={() => navigate('/availability')}>
          Start booking
        </Button>
      </CheckoutLayout>
    )
  }

  return (
    <>
      <Seo title="Payment" description="Choose how to pay for your stay at KEO Experience." path="/booking/payment" />
      <CheckoutLayout step="Payment">
        <div>
          <h1 className="text-3xl font-light">Payment</h1>
          <p className="mt-2 text-sm text-ink-mute">
            Reservation <span className="font-numeric font-semibold text-ink">{booking.reference}</span>
          </p>

          {errorMessage && (
            <div className="mt-4 p-4 border border-rose-200 bg-rose-50 text-rose-800 text-xs rounded-lg">
              {errorMessage}
            </div>
          )}

          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border border-hairline bg-paper-soft/40 p-6">
              <span className="text-sm text-ink-mute">Total for your stay</span>
              <span className="font-numeric text-3xl font-semibold text-ink">{formatNaira(total)}</span>
            </div>

            <PaymentMethodPicker value={method} onChange={onMethodChange} disabled={busy} />

            {method === 'card' ? (
              <div className="border border-hairline p-6">
                <CardForm amount={total} onPay={handleCardPay} busy={busy} />
              </div>
            ) : null}

            {method === 'transfer' ? (
              <div>
                {payment?.transferInstructions ? (
                  <TransferPanel
                    instructions={payment.transferInstructions}
                    busy={busy}
                    onConfirmed={() => confirmMethod('transfer')}
                  />
                ) : (
                  <p className="border border-hairline p-6 text-sm text-ink-mute">Preparing transfer details…</p>
                )}
              </div>
            ) : null}

            {method === 'pay_at_hotel' ? (
              <div className="space-y-6">
                <PayAtHotelPanel total={total} deposit={depositAmount} mode={payMode} onModeChange={setPayMode} />
                {payMode === 'full' ? (
                  <div className="border border-hairline p-6">
                    <p className="text-sm text-ink-mute">
                      No payment is taken now. Your reservation is confirmed and you’ll settle {formatNaira(total)} at
                      check-in.
                    </p>
                    <Button onClick={() => confirmMethod('pay_at_hotel')} disabled={busy} className="mt-4 w-full">
                      {busy ? 'Confirming…' : 'Confirm pay at check-in'}
                    </Button>
                  </div>
                ) : null}
                {payMode === 'deposit' ? (
                  <div className="border border-hairline p-6">
                    <CardForm amount={depositAmount} onPay={handleCardPay} busy={busy} />
                  </div>
                ) : null}
              </div>
            ) : null}

            {localState === 'processing' || localState === 'failed' ? (
              <PaymentStatus
                state={localState}
                onRetry={() => handleCardPay()}
                onCancel={() => setLocalState(null)}
              />
            ) : null}

            {authStep && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                <div className="w-full max-w-md border border-hairline bg-paper p-6 shadow-xl">
                  <h3 className="text-xl font-semibold uppercase tracking-wider text-bronze-deep">
                    {authStep === 'pin' ? 'Card PIN Verification' : authStep === 'otp' ? 'OTP Verification' : authStep === 'phone' ? 'Phone Verification' : 'Birthday Verification'}
                  </h3>
                  <p className="mt-2 text-sm text-ink-mute">{authPrompt}</p>

                  <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
                    <input
                      type={authStep === 'pin' ? 'password' : 'text'}
                      value={authInput}
                      onChange={(e) => setAuthInput(e.target.value)}
                      placeholder={authStep === 'pin' ? '****' : authStep === 'otp' ? '123456' : authStep === 'phone' ? '08012345678' : 'YYYY-MM-DD'}
                      className="w-full border border-hairline bg-paper p-3 text-center text-lg font-mono outline-none focus:border-ink"
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setAuthStep(null)} className="w-1/2">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={busy || !authInput} className="w-1/2">
                        {busy ? 'Verifying…' : 'Submit'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </CheckoutLayout>
    </>
  )
}