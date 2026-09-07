import { FaPhone, FaEnvelope } from 'react-icons/fa6'
import { useHotel } from '../../hooks/useHotel'

export function BookingSupportBar() {
  const { data: hotel } = useHotel()
  const contact = hotel?.contact

  return (
    <div className="border-t border-hairline bg-paper-soft/60 px-6 py-4">
      <div className="container-x flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-ink-mute">
          Need help with your reservation? Our team is happy to assist.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <a href={`tel:${contact?.phone ?? '+2348130148920'}`} className="flex items-center gap-2 font-semibold text-ink hover:text-bronze-deep">
            <FaPhone className="h-3.5 w-3.5 text-bronze-deep" />
            {contact?.phoneDisplay ?? '+234 813 014 8920'}
          </a>
          <a href={`mailto:${contact?.email ?? 'booking@keoexperience.com'}`} className="flex items-center gap-2 font-semibold text-ink hover:text-bronze-deep">
            <FaEnvelope className="h-3.5 w-3.5 text-bronze-deep" />
            {contact?.email ?? 'booking@keoexperience.com'}
          </a>
        </div>
      </div>
    </div>
  )
}