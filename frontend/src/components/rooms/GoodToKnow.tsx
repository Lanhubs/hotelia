import { FaClock, FaMugHot, FaCar, FaLocationDot } from 'react-icons/fa6'
import type { ReactNode } from 'react'
import { useHotel } from '../../hooks/useHotel'

function Card({ icon, title, lines }: { icon: ReactNode; title: string; lines: string[] }) {
  return (
    <div className="border border-hairline bg-paper p-5">
      <span className="flex h-10 w-10 items-center justify-center border border-bronze/40 bg-bronze/10 text-bronze-deep">
        {icon}
      </span>
      <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
      {lines.map((line) => (
        <p key={line} className="mt-1 text-sm leading-relaxed text-ink-mute">
          {line}
        </p>
      ))}
    </div>
  )
}

export function GoodToKnow() {
  const { data: hotel } = useHotel()
  const p = hotel?.policies
  const contact = hotel?.contact

  return (
    <div>
      <h2 className="text-2xl">Good to know</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card
          icon={<FaClock className="h-4 w-4" />}
          title="Check-in & check-out"
          lines={[`Check-in from ${p?.checkInTime ?? '2:00 PM'}`, `Check-out by ${p?.checkOutTime ?? '12:00 PM'}`]}
        />
        <Card
          icon={<FaMugHot className="h-4 w-4" />}
          title="Breakfast"
          lines={['Complimentary breakfast served in the courtyard each morning.']}
        />
        <Card icon={<FaCar className="h-4 w-4" />} title="Parking & security" lines={['Secure parking and a 24-hour front desk at the property.']} />
        <Card
          icon={<FaLocationDot className="h-4 w-4" />}
          title="Location"
          lines={[`${contact?.address ?? '54, Pipeline Road, Off Offa Garage Road'}, ${contact?.city ?? 'Ilorin, Kwara State'}`]}
        />
      </div>
    </div>
  )
}