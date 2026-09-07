import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { CheckoutSteps } from './CheckoutSteps'
import type { CheckoutStep } from './checkoutStepsData'
import { BookingSummary } from './BookingSummary'
import { BookingSupportBar } from './BookingSupportBar'
import { useCheckoutStore } from '../../stores/checkoutStore'

export function CheckoutLayout({ step, children }: { step: CheckoutStep; children: ReactNode }) {
  const room = useCheckoutStore((s) => s.room)
  const search = useCheckoutStore((s) => s.search)

  if (!room || !search) return <Navigate to="/availability" replace />

  return (
    <>
      <section className="container-x py-10 md:py-14">
        <div className="mb-10">
          <CheckoutSteps current={step} />
        </div>
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>{children}</div>
          <BookingSummary />
        </div>
      </section>
      <BookingSupportBar />
    </>
  )
}