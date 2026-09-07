const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('en-NG')

export function formatNaira(amount: number): string {
  return nairaFormatter.format(amount)
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatCurrency(amount: number, currency: 'NGN' | 'USD' = 'NGN'): string {
  if (currency === 'NGN') return formatNaira(amount)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}