import { AmenityIcon, getAmenityIconName } from './AmenityIcon'
import type { AmenityItem } from '../../api/types'
import { cn } from '../../lib/cn'

export function AmenityList({
  amenities,
  limit,
  grid = false,
  className,
}: {
  amenities?: AmenityItem[]
  limit?: number
  grid?: boolean
  className?: string
}) {
  if (!amenities || amenities.length === 0) return null

  const normalized = amenities.map((item, index) => {
    if (typeof item === 'string') {
      return {
        id: `am-${index}-${item}`,
        name: item,
        icon: getAmenityIconName(item),
      }
    }
    return item
  })

  const items = limit ? normalized.slice(0, limit) : normalized

  if (grid) {
    return (
      <ul className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2', className)}>
        {items.map((amenity) => (
          <li key={amenity.id} className="flex items-center gap-3 border border-hairline bg-paper p-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-bronze/40 bg-bronze/10 text-bronze-deep">
              <AmenityIcon name={amenity.icon} className="h-4 w-4" />
            </span>
            <span className="text-sm text-ink">{amenity.name}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className={cn('space-y-3', className)}>
      {items.map((amenity) => (
        <li key={amenity.id} className="flex items-center gap-3 text-sm text-ink-mute">
          <AmenityIcon name={amenity.icon} className="h-4 w-4 shrink-0 text-bronze-deep" />
          {amenity.name}
        </li>
      ))}
    </ul>
  )
}