import { FaLocationDot } from 'react-icons/fa6'

export function MapSection({ query }: { query: string }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
  return (
    <div className="relative overflow-hidden bg-paper-soft">
      <iframe
        title="Map showing KEO Experience Hotel"
        src={src}
        className="h-[24rem] w-full border-0 grayscale-[0.2]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 bg-ink px-5 py-3 text-sm text-paper">
        <FaLocationDot className="h-4 w-4 text-bronze-soft" />
        KEO Experience Hotel &amp; Events
      </div>
    </div>
  )
}