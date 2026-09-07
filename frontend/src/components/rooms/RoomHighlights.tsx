import { FaCircleCheck } from 'react-icons/fa6'

export function RoomHighlights({ features }: { features: string[] }) {
  return (
    <div>
      <h2 className="text-2xl">Room highlights</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-ink-mute">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-bronze/40 bg-bronze/10 text-bronze-deep">
              <FaCircleCheck className="h-3.5 w-3.5" />
            </span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}