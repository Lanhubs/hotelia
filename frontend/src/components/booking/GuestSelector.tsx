import { Stepper } from '../shared/Stepper'

export function GuestSelector({
  adults,
  childCount,
  rooms,
  onChange,
}: {
  adults: number
  childCount: number
  rooms: number
  onChange: (patch: { adults?: number; children?: number; rooms?: number }) => void
}) {
  return (
    <div className="divide-y divide-hairline border border-hairline">
      <div className="px-4 py-3">
        <Stepper label="Adults" value={adults} min={1} max={8} onChange={(v) => onChange({ adults: v })} />
      </div>
      <div className="px-4 py-3">
        <Stepper label="Children" value={childCount} min={0} max={6} onChange={(v) => onChange({ children: v })} />
      </div>
      <div className="px-4 py-3">
        <Stepper label="Rooms" value={rooms} min={1} max={5} onChange={(v) => onChange({ rooms: v })} />
      </div>
    </div>
  )
}