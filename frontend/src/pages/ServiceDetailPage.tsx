import { Link, useParams } from 'react-router-dom'
import { FaCircleCheck, FaEnvelope, FaPhone } from 'react-icons/fa6'
import { Seo } from '../components/seo/Seo'
import { Skeleton } from '../components/shared/Skeleton'
import { ErrorState } from '../components/shared/ErrorState'
import { ButtonLink } from '../components/shared/Button'
import { useService } from '../hooks/useServices'
import { useHotel } from '../hooks/useHotel'
import { formatNaira } from '../lib/money'

export function ServiceDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { data: service, isLoading, isError } = useService(slug)
  const { data: hotel } = useHotel()
  const contact = hotel?.contact

  if (isLoading) {
    return (
      <div className="container-x py-20">
        <Skeleton className="aspect-[16/10] w-full" />
        <Skeleton className="mt-8 h-10 w-2/3" />
      </div>
    )
  }

  if (isError || !service) {
    return (
      <div className="container-x py-20">
        <ErrorState title="Service not found" message="We couldn’t find that service. Browse all our services instead." actionLabel="All services" actionTo="/services" />
      </div>
    )
  }

  return (
    <>
      <Seo title={service.name} description={service.description} path={`/services/${service.slug}`} />
      <section className="container-x py-10 md:py-14">
        <nav className="text-xs text-ink-mute">
          <Link to="/services" className="hover:text-bronze-deep">Services</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{service.name}</span>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <div className="aspect-[4/3] overflow-hidden bg-paper-soft">
            <img src={service.image} alt={service.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">{service.category}</p>
            <h1 className="mt-2 text-4xl font-light leading-tight">{service.name}</h1>
            <p className="mt-5 text-base leading-relaxed text-ink-mute">{service.description}</p>

            {service.price ? (
              <p className="mt-6 font-numeric text-2xl font-semibold text-ink">{formatNaira(service.price)}</p>
            ) : service.priceLabel ? (
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-bronze-deep">{service.priceLabel}</p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2">
              {service.available ? (
                <span className="flex items-center gap-2 text-xs text-ink-mute">
                  <FaCircleCheck className="h-3.5 w-3.5 text-bronze-deep" /> Currently available
                </span>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {service.requestable ? (
                <ButtonLink to="/contact" size="lg">
                  Request this service
                </ButtonLink>
              ) : null}
              <ButtonLink to="/availability" variant="outline" size="lg">
                Book a stay
              </ButtonLink>
            </div>

            <div className="mt-8 border-t border-hairline pt-6 text-sm text-ink-mute">
              <p className="flex items-center gap-3">
                <FaPhone className="h-3.5 w-3.5 text-bronze-deep" /> {contact?.phoneDisplay ?? '+234 813 014 8920'}
              </p>
              <p className="mt-2 flex items-center gap-3">
                <FaEnvelope className="h-3.5 w-3.5 text-bronze-deep" /> {contact?.email ?? 'booking@keoexperience.com'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}