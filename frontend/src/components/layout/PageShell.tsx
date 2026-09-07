import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { Lightbox } from '../gallery/Lightbox'
import { useScrollToTop } from '../../hooks/useScrollToTop'

export function PageShell() {
  useScrollToTop()
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Lightbox />
    </div>
  )
}