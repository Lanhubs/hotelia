import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

const fieldBase =
  'w-full bg-transparent border border-hairline px-4 py-3 text-sm text-ink placeholder:text-ink-mute/60 transition-colors duration-200 focus:outline-none focus:border-ink disabled:bg-paper-soft disabled:opacity-60 rounded-none'

const errorBase = 'border-error focus:border-error'

type FieldProps = (args: { id: string; error: boolean }) => ReactNode

export function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: FieldProps }) {
  const id = useId()
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-mute">
        {label}
      </label>
      {children({ id, error: Boolean(error) })}
      {error ? (
        <p className="text-xs text-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-mute">{hint}</p>
      ) : null}
    </div>
  )
}

export function TextInput({
  label,
  error,
  hint,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  return (
    <Field label={label} error={error} hint={hint}>
      {({ id, error: hasError }) => (
        <input id={id} aria-invalid={hasError || undefined} className={cn(fieldBase, hasError && errorBase, className)} {...rest} />
      )}
    </Field>
  )
}

export function SelectInput({
  label,
  error,
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) {
  return (
    <Field label={label} error={error}>
      {({ id, error: hasError }) => (
        <select id={id} aria-invalid={hasError || undefined} className={cn(fieldBase, hasError && errorBase, 'pr-8', className)} {...rest}>
          {children}
        </select>
      )}
    </Field>
  )
}

export function TextAreaInput({
  label,
  error,
  hint,
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; hint?: string }) {
  return (
    <Field label={label} error={error} hint={hint}>
      {({ id, error: hasError }) => (
        <textarea id={id} aria-invalid={hasError || undefined} rows={4} className={cn(fieldBase, hasError && errorBase, className)} {...rest} />
      )}
    </Field>
  )
}