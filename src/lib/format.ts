import type { StockStatus } from '../types/catalogue'

const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** Formats a catalogue price. Prices are optional in the schema — callers check for undefined first. */
export function formatPrice(value: number): string {
  return priceFormatter.format(value)
}

const STOCK_LABELS: Record<StockStatus, string> = {
  in_stock: 'In Stock',
  out_of_stock: 'Out of Stock',
  preorder: 'Pre-order',
}

export function stockStatusLabel(status: StockStatus): string {
  return STOCK_LABELS[status]
}
