import { FaBuildingColumns, FaCopy, FaCircleCheck } from 'react-icons/fa6'
import type { TransferInstructions } from '../../../api/types'
import { formatNaira } from '../../../lib/money'
import { Button } from '../../shared/Button'

export function TransferPanel({
  instructions,
  busy,
  onConfirmed,
}: {
  instructions: TransferInstructions
  busy: boolean
  onConfirmed: () => void
}) {
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      /* clipboard unavailable */
    }
  }

  const row = (label: string, value: string, copyable = false) => (
    <div className="flex items-center justify-between gap-4 border-b border-hairline py-3 last:border-0">
      <span className="text-sm text-ink-mute">{label}</span>
      <span className="flex items-center gap-2 text-right font-medium text-ink">
        {value}
        {copyable ? (
          <button type="button" onClick={() => copy(value)} aria-label={`Copy ${label}`}>
            <FaCopy className="h-3.5 w-3.5 text-bronze-deep" />
          </button>
        ) : null}
      </span>
    </div>
  )

  return (
    <div className="border border-hairline">
      <div className="border-b border-hairline bg-paper-soft/40 p-5">
        <div className="flex items-center gap-3">
          <FaBuildingColumns className="h-6 w-6 text-bronze-deep" />
          <div>
            <p className="text-sm font-semibold text-ink">Transfer {formatNaira(instructions.amount)}</p>
            <p className="text-xs text-ink-mute">via {instructions.provider}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        {row('Bank', instructions.bankName)}
        {row('Account name', instructions.accountName)}
        {row('Account number', instructions.accountNumber, true)}
        {row('Amount', formatNaira(instructions.amount))}
        {row('Payment reference', instructions.reference, true)}

        <div className="mt-4 rounded-sm border border-bronze/40 bg-paper-soft/40 p-4 text-xs leading-relaxed text-ink-mute">
          <p className="flex items-start gap-2">
            <FaCircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bronze-deep" />
            Make the transfer using the payment reference above as your narration, then click below. Your reservation is
            confirmed once we verify the transfer — usually within minutes.
          </p>
        </div>

        <Button onClick={onConfirmed} disabled={busy} className="mt-5 w-full">
          {busy ? 'Submitting…' : 'I’ve made the transfer'}
        </Button>
      </div>
    </div>
  )
}