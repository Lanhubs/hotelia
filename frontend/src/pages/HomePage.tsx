import { Seo } from '../components/seo/Seo'
import { hotelJsonLd } from '../lib/hotelJsonLd'
import { Hero } from '../components/home/Hero'
import { TrustSignals } from '../components/home/TrustSignals'
import { Introduction } from '../components/home/Introduction'
import { FeaturedRooms } from '../components/home/FeaturedRooms'
import { ExperienceSection } from '../components/home/ExperienceSection'
import { ServicesPreview } from '../components/home/ServicesPreview'
import { EventsPreview } from '../components/home/EventsPreview'
import { GalleryPreview } from '../components/home/GalleryPreview'
import { Testimonials } from '../components/home/Testimonials'
import { LocationSection } from '../components/home/LocationSection'
import { StayWithUs } from '../components/home/StayWithUs'

export function HomePage() {
  return (
    <>
      <Seo
        title="KEO Experience Hotel & Events — Refined Stays, Remarkable Events"
        description="A premium boutique hotel and event destination in Ilorin, Kwara State. Stay beautifully. Celebrate meaningfully. Book your room today."
        path="/"
        jsonLd={hotelJsonLd}
      />
      <Hero />
      <TrustSignals />
      <Introduction />
      <FeaturedRooms />
      <ExperienceSection />
      <ServicesPreview />
      <EventsPreview />
      <GalleryPreview />
      <Testimonials />
      <LocationSection />
      <StayWithUs />
    </>
  )
}