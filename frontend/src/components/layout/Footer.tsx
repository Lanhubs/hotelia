import { Link } from 'react-router-dom'
import { FaPhone, FaEnvelope, FaLocationDot, FaInstagram, FaFacebookF } from 'react-icons/fa6'
import { FOOTER_NAV, INFO_NAV } from './navLinks'
import { useHotel } from '../../hooks/useHotel'

export function Footer() {
  const { data: hotel } = useHotel()
  const contact = hotel?.contact

  return (
    <footer className="bg-ink text-paper">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link to="/" className="inline-block group" aria-label="KEO Experience Home">
              <img
                src="/keo-logo.png"
                alt="KEO Experience"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/70">
              Refined stays and remarkable events in Ilorin. A place to stay, dine, relax, celebrate and meet — designed for comfort and privacy.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-soft">Stay</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {FOOTER_NAV.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-paper/70 transition-colors hover:text-paper">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-soft">Hotel</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {INFO_NAV.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-paper/70 transition-colors hover:text-paper">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-soft">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm text-paper/70">
              <li>
                <a href={`tel:${contact?.phone ?? '+2348130148920'}`} className="flex items-center gap-3 hover:text-paper">
                  <FaPhone className="h-3.5 w-3.5 text-bronze-soft" />
                  {contact?.phoneDisplay ?? '+234 813 014 8920'}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact?.email ?? 'booking@keoexperience.com'}`} className="flex items-center gap-3 hover:text-paper">
                  <FaEnvelope className="h-3.5 w-3.5 text-bronze-soft" />
                  {contact?.email ?? 'booking@keoexperience.com'}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaLocationDot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bronze-soft" />
                <span>
                  {contact?.address ?? '54, Pipeline Road, Off Offa Garage Road'}
                  <br />
                  {contact?.city ?? 'Ilorin, Kwara State, Nigeria'}
                </span>
              </li>
            </ul>
            <div className="mt-6 flex gap-4 text-paper/50">
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="transition-colors hover:text-bronze-soft">
                <FaInstagram className="h-4 w-4" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="transition-colors hover:text-bronze-soft">
                <FaFacebookF className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-paper/15 pt-6 text-xs text-paper/45 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} KEO Experience Hotel &amp; Events. All rights reserved.</p>
          <p>Stay well. Celebrate better.</p>
        </div>
      </div>
    </footer>
  )
}