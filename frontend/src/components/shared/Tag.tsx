import { cn } from '../../lib/cn'

export function Tag({ children, dark, className }: { children: string; dark?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]',
        dark ? 'border-paper/25 text-paper/80' : 'border-ink/15 text-ink-mute',
        className,
      )}
    >
      {children}
    </span>
  )
}