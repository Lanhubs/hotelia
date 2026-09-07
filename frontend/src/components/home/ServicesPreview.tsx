import { Link } from 'react-router-dom'
import { Section, SectionHeading } from '../shared/Section'
import { Skeleton } from '../shared/Skeleton'
import { Reveal } from '../shared/Reveal'
import { useServices } from '../../hooks/useServices'
import { formatNaira } from '../../lib/money'

export function ServicesPreview() {
  const { data, isLoading } = useServices()

  return (
    <Section>
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Hospitality" title="Little things that make a stay feel easy" />
        <Link to="/services" className="text-sm font-semibold text-ink underline decoration-bronze underline-offset-4 hover:text-bronze-deep">
          All services
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data?.slice(0, 4).map((service, i) => (
            <Reveal key={service.id} delay={i * 70}>
              <Link to={`/services/${service.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden bg-paper-soft">
                  <img
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">
                  {service.category}
                </p>
                <h3 className="mt-1 text-lg group-hover:text-bronze-deep">{service.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink-mute">{service.description}</p>
                {service.price ? <p className="mt-2 font-numeric text-sm font-semibold text-ink">{formatNaira(service.price)}</p> : null}
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  )
}