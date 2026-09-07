import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PageShell } from './components/layout/PageShell'
import { HomePage } from './pages/HomePage'
import { RoomsPage } from './pages/RoomsPage'
import { RoomDetailPage } from './pages/RoomDetailPage'
import { AvailabilityPage } from './pages/AvailabilityPage'
import { ReviewStepPage } from './pages/ReviewStepPage'
import { GuestStepPage } from './pages/GuestStepPage'
import { ExtrasStepPage } from './pages/ExtrasStepPage'
import { PaymentStepPage } from './pages/PaymentStepPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { ReservationLookupPage } from './pages/ReservationLookupPage'
import { ReservationDetailPage } from './pages/ReservationDetailPage'
import { ReceiptPage } from './pages/ReceiptPage'
import { ServicesPage } from './pages/ServicesPage'
import { ServiceDetailPage } from './pages/ServiceDetailPage'
import { EventsPage } from './pages/EventsPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { ExperiencePage } from './pages/ExperiencePage'
import { GalleryPage } from './pages/GalleryPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { PoliciesPage } from './pages/PoliciesPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:slug" element={<RoomDetailPage />} />
          <Route path="/availability" element={<AvailabilityPage />} />
          <Route path="/booking/review" element={<ReviewStepPage />} />
          <Route path="/booking/guest" element={<GuestStepPage />} />
          <Route path="/booking/extras" element={<ExtrasStepPage />} />
          <Route path="/booking/payment" element={<PaymentStepPage />} />
          <Route path="/booking/confirmation" element={<ConfirmationPage />} />
          <Route path="/booking/confirmation/:reference" element={<ConfirmationPage />} />
          <Route path="/reservation" element={<ReservationLookupPage />} />
          <Route path="/reservation/:reference" element={<ReservationDetailPage />} />
          <Route path="/reservation/:reference/receipt" element={<ReceiptPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventDetailPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/policies" element={<PoliciesPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}