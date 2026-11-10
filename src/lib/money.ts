const tzs = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

export function formatTZS(amount: number): string {
  return `TSh ${tzs.format(amount)}`
}
