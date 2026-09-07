import { ButtonLink } from './Button'

export function ErrorState({
  title,
  message,
  actionLabel,
  actionTo,
}: {
  title?: string
  message: string
  actionLabel?: string
  actionTo?: string
}) {
  return (
    <div className="border border-hairline bg-paper-soft/50 px-8 py-14 text-center">
      <h3 className="text-xl">{title ?? 'Something went wrong'}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-mute">{message}</p>
      {actionLabel && actionTo ? (
        <div className="mt-6">
          <ButtonLink to={actionTo} variant="outline">
            {actionLabel}
          </ButtonLink>
        </div>
      ) : null}
    </div>
  )
}