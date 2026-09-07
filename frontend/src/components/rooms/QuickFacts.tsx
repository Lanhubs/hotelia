import { FaUserGroup, FaBed, FaRulerCombined, FaLayerGroup } from 'react-icons/fa6'
import type { ReactNode } from 'react'
import type { Room } from '../../api/types'

function Tile({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="border border-hairline bg-paper p-4">
      <span className="flex h-9 w-9 items-center justify-center border border-bronze/40 bg-bronze/10 text-bronze-deep">
        {icon}
      </span>
      <p className="mt-3 text-sm font-semibold text-ink">{value}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-ink-mute">{label}</p>
    </div>
  )
}

export function QuickFacts({ room }: { room: Room }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      <Tile icon={<FaUserGroup className="h-4 w-4" />} value={`${room.capacity}`} label="Guests" />
      <Tile icon={<FaBed className="h-4 w-4" />} value={room.bedType} label="Bed" />
      <Tile icon={<FaRulerCombined className="h-4 w-4" />} value={`${room.size} m²`} label="Size" />
      <Tile icon={<FaLayerGroup className="h-4 w-4" />} value={room.floor} label="Floor" />
    </div>
  )
}