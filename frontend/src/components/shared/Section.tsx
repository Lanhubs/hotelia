import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function Section({
  children,
  className,
  as: Tag = 'section',
  dark,
}: {
  children: ReactNode
  className?: string
  as?: 'section' | 'div' | 'header' | 'footer'
  dark?: boolean
}) {
  return (
    <Tag className={dark ? 'bg-ink text-paper' : 'bg-paper text-ink'}>
      <div className={cn('container-x py-20 md:py-28', className)}>{children}</div>
    </Tag>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  dark,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  dark?: boolean
}) {
  return (
    <div className={cn('max-w-2xl space-y-4', align === 'center' && 'mx-auto text-center')}>
      {eyebrow ? (
        <p className={cn('text-[11px] font-semibold uppercase tracking-[0.22em]', dark ? 'text-bronze-soft' : 'text-bronze-deep')}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl md:text-4xl leading-tight">{title}</h2>
      {description ? (
        <p className={cn('text-base leading-relaxed', dark ? 'text-paper/70' : 'text-ink-mute')}>{description}</p>
      ) : null}
    </div>
  )
}