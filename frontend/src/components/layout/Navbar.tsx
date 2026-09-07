import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FaBars } from 'react-icons/fa6'
import { cn } from '../../lib/cn'
import { PRIMARY_NAV } from './navLinks'
import { ButtonLink } from '../shared/Button'
import { MobileMenu } from './MobileMenu'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'text-sm tracking-normal transition-colors hover:text-bronze-soft',
      isActive ? 'text-paper font-semibold' : 'text-paper/75',
    )

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled
          ? 'bg-ink/98 backdrop-blur-md shadow-card border-b border-paper/15'
          : 'bg-ink/90 backdrop-blur-md border-b border-paper/10',
      )}
    >
      <div className="container-x flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="KEO Experience Home">
          <img
            src="/keo-logo.png"
            alt="KEO Experience"
            className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {PRIMARY_NAV.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ButtonLink to="/availability" variant="light" size="sm" className="hidden sm:inline-flex shadow-xs">
            Book Now
          </ButtonLink>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center border border-paper/30 text-paper hover:bg-paper/10 transition-colors lg:hidden cursor-pointer rounded-xs"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <FaBars className="h-4 w-4" />
          </button>
        </div>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  )
}