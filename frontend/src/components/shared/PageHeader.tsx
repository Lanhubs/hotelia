import type { ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <header className="border-b border-hairline bg-paper">
      <div className="container-x py-16 md:py-20">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 max-w-2xl text-4xl font-light leading-tight md:text-5xl">{title}</h1>
        {description ? <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-mute">{description}</p> : null}
        {children}
      </div>
    </header>
  )
}