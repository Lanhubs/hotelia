import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaXmark, FaPhone, FaEnvelope, FaLocationDot, FaInstagram, FaFacebookF } from 'react-icons/fa6'
import { PRIMARY_NAV } from './navLinks'
import { useHotel } from '../../hooks/useHotel'
import { ButtonLink } from '../shared/Button'

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: hotel } = useHotel()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-ink text-paper lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="container-x flex h-20 items-center justify-between">
        <Link to="/" onClick={onClose} aria-label="KEO Experience Home">
          <img
            src="/keo-logo.png"
            alt="KEO Experience"
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-10 w-10 items-center justify-center border border-paper/25 text-paper cursor-pointer"
        >
          <FaXmark className="h-5 w-5" />
        </button>
      </div>

      <div className="container-x flex h-[calc(100%-5rem)] flex-col justify-between pb-10 pt-6">
        <nav aria-label="Mobile" className="space-y-1">
          {PRIMARY_NAV.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="flex items-center gap-4 py-3 text-2xl font-light text-paper/90 transition-colors hover:text-bronze-soft"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              <span className="font-numeric text-xs text-bronze-soft">0{i + 1}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-6">
          <ButtonLink to="/availability" variant="light" className="w-full" onClick={onClose}>
            Book Now
          </ButtonLink>
          <div className="space-y-3 border-t border-paper/15 pt-6 text-sm text-paper/70">
            <a href={`tel:${hotel?.contact.phone ?? '+2348130148920'}`} className="flex items-center gap-3">
              <FaPhone className="h-3.5 w-3.5 text-bronze-soft" />
              {hotel?.contact.phoneDisplay ?? '+234 813 014 8920'}
            </a>
            <a href={`mailto:${hotel?.contact.email ?? 'booking@keoexperience.com'}`} className="flex items-center gap-3">
              <FaEnvelope className="h-3.5 w-3.5 text-bronze-soft" />
              {hotel?.contact.email ?? 'booking@keoexperience.com'}
            </a>
            <p className="flex items-start gap-3">
              <FaLocationDot className="mt-1 h-3.5 w-3.5 shrink-0 text-bronze-soft" />
              {hotel?.contact.address ?? '54, Pipeline Road, Off Offa Garage Road'},{' '}
              {hotel?.contact.city ?? 'Ilorin, Kwara State'}
            </p>
          </div>
          <div className="flex gap-4 border-t border-paper/15 pt-6 text-paper/60">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-bronze-soft">
              <FaInstagram className="h-4 w-4" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-bronze-soft">
              <FaFacebookF className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}