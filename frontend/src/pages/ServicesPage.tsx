import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Skeleton } from '../components/shared/Skeleton'
import { ErrorState } from '../components/shared/ErrorState'
import { useServices } from '../hooks/useServices'
import { SERVICE_CATEGORIES } from '../lib/financials'
import { cn } from '../lib/cn'
import { formatNaira } from '../lib/money'

export function ServicesPage() {
  const { data, isLoading, isError } = useServices()
  const [category, setCategory] = useState('All')

  const services = data?.filter((s) => category === 'All' || s.category === category) ?? []

  return (
    <>
      <Seo
        title="Services"
        description="Discover dining, transport, events and hospitality services at KEO Experience Hotel, Ilorin."
        path="/services"
      />
      <PageHeader
        eyebrow="Hospitality"
        title="Services"
        description="Everything you need for a comfortable stay — from breakfast in the courtyard to airport pickup and event hosting."
      />

      <section className="container-x py-12">
        <div className="flex flex-wrap gap-2 border-b border-hairline pb-6">
          {['All', ...SERVICE_CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                'border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors',
                category === c ? 'border-ink bg-ink text-paper' : 'border-hairline text-ink-mute hover:border-ink',
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] w-full" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState message="We couldn’t load our services right now. Please try again later." actionLabel="Back to home" actionTo="/" />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Link key={service.id} to={`/services/${service.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-paper-soft">
                    <img
                      src={service.image}
                      alt={service.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">{service.category}</p>
                      <h2 className="mt-1 text-xl group-hover:text-bronze-deep">{service.name}</h2>
                    </div>
                    {service.price ? <span className="font-numeric text-sm font-semibold text-ink">{formatNaira(service.price)}</span> : null}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-mute">{service.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}