import { FaCircleCheck, FaCircleXmark, FaClock, FaHourglassHalf, FaHotel } from 'react-icons/fa6'
import type { PaymentState } from '../../api/types'
import { Button } from '../shared/Button'

export function PaymentStatus({
  state,
  onRetry,
  onCancel,
}: {
  state: PaymentState
  onRetry?: () => void
  onCancel?: () => void
}) {
  if (state === 'pay_at_hotel') {
    return (
      <div className="border border-hairline bg-paper-soft/50 p-8 text-center">
        <FaHotel className="mx-auto h-8 w-8 text-bronze-deep" />
        <h3 className="mt-4 text-xl">No online payment</h3>
        <p className="mt-2 text-sm text-ink-mute">You’ll settle your balance at check-in. No charge has been made today.</p>
      </div>
    )
  }

  if (state === 'processing') {
    return (
      <div className="border border-hairline bg-paper-soft/50 p-8 text-center">
        <FaHourglassHalf className="mx-auto h-8 w-8 animate-pulse text-bronze-deep" />
        <h3 className="mt-4 text-xl">Processing payment</h3>
        <p className="mt-2 text-sm text-ink-mute">Please wait while your payment is being verified.</p>
      </div>
    )
  }

  if (state === 'success') {
    return (
      <div className="border border-hairline bg-paper-soft/50 p-8 text-center">
        <FaCircleCheck className="mx-auto h-9 w-9 text-bronze-deep" />
        <h3 className="mt-4 text-xl">Payment successful</h3>
        <p className="mt-2 text-sm text-ink-mute">Your reservation is confirmed. A receipt has been sent to your email.</p>
      </div>
    )
  }

  if (state === 'failed') {
    return (
      <div className="border border-hairline bg-paper-soft/50 p-8 text-center">
        <FaCircleXmark className="mx-auto h-9 w-9 text-error" />
        <h3 className="mt-4 text-xl">Payment failed</h3>
        <p className="mt-2 text-sm text-ink-mute">
          We could not complete your payment. No charge was made. You can try again.
        </p>
        {onRetry ? (
          <Button onClick={onRetry} className="mt-5">
            Retry payment
          </Button>
        ) : null}
      </div>
    )
  }

  if (state === 'cancelled') {
    return (
      <div className="border border-hairline bg-paper-soft/50 p-8 text-center">
        <FaCircleXmark className="mx-auto h-9 w-9 text-ink-mute" />
        <h3 className="mt-4 text-xl">Payment cancelled</h3>
        <p className="mt-2 text-sm text-ink-mute">You cancelled the payment. Your reservation is saved and you can try again anytime.</p>
        {onCancel ? (
          <Button onClick={onCancel} className="mt-5">
            Return to payment
          </Button>
        ) : null}
      </div>
    )
  }

  return (
    <div className="border border-hairline bg-paper-soft/50 p-8 text-center">
      <FaClock className="mx-auto h-8 w-8 text-ink-mute" />
      <h3 className="mt-4 text-xl">Payment pending</h3>
      <p className="mt-2 text-sm text-ink-mute">Your payment has not been completed yet.</p>
    </div>
  )
}