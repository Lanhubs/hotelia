import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'outline' | 'ghost' | 'light'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-semibold tracking-normal transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze disabled:opacity-50 disabled:pointer-events-none select-none'

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-ink-soft rounded-sm',
  outline: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper rounded-sm',
  ghost: 'text-ink hover:text-bronze-deep rounded-sm',
  light: 'bg-paper text-ink hover:bg-paper-soft rounded-sm',
}

const sizes: Record<Size, string> = {
  sm: 'text-xs px-4 py-2',
  md: 'text-sm px-6 py-3',
  lg: 'text-sm px-8 py-4',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  )
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
  variant?: Variant
  size?: Size
  children: ReactNode
  state?: unknown
}

export function ButtonLink({ to, variant = 'primary', size = 'md', className, children, state, ...rest }: ButtonLinkProps) {
  return (
    <Link to={to} state={state} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  )
}