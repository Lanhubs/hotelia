import React from 'react'
import {
  FaLocationDot,

  FaChampagneGlasses,
  FaUtensils,
  FaShieldHalved,
  FaStar,
  FaCreditCard,
  FaHeadset,
} from 'react-icons/fa6'
import { Section } from '../shared/Section'
import { LiaBedSolid } from 'react-icons/lia'

interface PillarItem {
  icon: React.ComponentType<{ className?: string }>
  badge: string
  title: string
  highlight: string
  text: string
}

const PILLARS: PillarItem[] = [
  {
    icon: FaLocationDot,
    badge: 'Central & Serene',
    title: 'Prime Ilorin Promenade',
    highlight: 'Pipeline Rd, Off Offa Garage',
    text: 'Tucked away in an exclusive, secure enclave with rapid access to the city centre and MMIA express routes.',
  },
  {
    icon: LiaBedSolid,
    badge: '5-Star Standard',
    title: 'Architectural Suites',
    highlight: 'Bespoke Bedding & High Ceilings',
    text: 'Acoustically insulated suites and apartments engineered for deep restorative rest, privacy, and productivity.',
  },
  {
    icon: FaChampagneGlasses,
    badge: 'Events & Galas',
    title: 'Remarkable Celebrations',
    highlight: 'Ballroom, Lawns & Boardrooms',
    text: 'From intimate executive banquets to grand society weddings, supported by a dedicated events and banquet concierge.',
  },
  {
    icon: FaUtensils,
    badge: 'Artisanal Dining',
    title: 'Refined Gastronomy',
    highlight: 'All-Day Chef Dining & Breakfast',
    text: 'Fresh local culinary heritage meets international haute cuisine, crafted daily with complimentary breakfast for guests.',
  },
]

const TRUST_METRICS = [
  { icon: FaStar, label: '4.9/5 Verified Guest Rating' },
  { icon: FaShieldHalved, label: '24/7 Monitored Security & Privacy' },
  { icon: FaCreditCard, label: 'Instant Paystack & Settle-at-Check-in' },
  { icon: FaHeadset, label: '24/7 Dedicated Concierge Care' },
]

export function TrustSignals() {
  return (
    <Section className="py-0!">
      <div className="relative -mt-6 sm:-mt-10 mb-8 container-x z-20">
        {/* Luxury Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {PILLARS.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="group relative bg-paper border border-hairline hover:border-bronze p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className="w-10 h-10 rounded-sm bg-paper-soft group-hover:bg-ink group-hover:text-paper text-bronze-deep flex items-center justify-center transition-colors duration-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-bronze-deep bg-bronze-soft/20 px-2.5 py-1 rounded-xs">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-ink group-hover:text-bronze-deep transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-bronze-deep mt-0.5 mb-2 font-display">
                    {item.highlight}
                  </p>
                  <p className="text-xs leading-relaxed text-ink-mute">
                    {item.text}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-hairline/60 flex items-center justify-between text-[11px] font-medium text-ink-mute group-hover:text-ink transition-colors">
                  <span>Explore experience</span>
                  <span className="text-bronze font-bold transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Executive Highlights Bar */}
        <div className="mt-4 bg-ink text-paper p-4 sm:p-5 rounded-xs border border-ink-soft">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium divide-y sm:divide-y-0 sm:divide-x divide-ink-soft/80">
            {TRUST_METRICS.map((metric, i) => {
              const MetricIcon = metric.icon
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 ${i > 0 ? 'sm:pl-5' : ''} ${i > 1 ? 'pt-3 sm:pt-0' : ''}`}
                >
                  <MetricIcon className="w-4 h-4 text-bronze-soft shrink-0" />
                  <span className="text-paper/90 text-xs tracking-tight">{metric.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Section>
  )
}