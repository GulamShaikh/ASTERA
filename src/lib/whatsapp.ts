import { WHATSAPP_NUMBER } from '../content/site'

/** wa.me needs full international digits; the client's number was given as a plain 10-digit Indian number. */
function toInternationalDigits(rawNumber: string): string {
  const digits = rawNumber.replace(/\D/g, '')
  return digits.length === 10 ? `91${digits}` : digits
}

/** Null when WHATSAPP_NUMBER isn't configured yet — callers show a pending state instead of a broken link. */
export function buildWhatsAppLink(message: string): string | null {
  if (!WHATSAPP_NUMBER) return null
  const digits = toInternationalDigits(WHATSAPP_NUMBER)
  if (!digits) return null
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

/** Never includes the internal product id/slug — only what a customer would naturally type. */
export function productEnquiryMessage(product: { name: string; sku?: string }): string {
  const skuNote = product.sku ? ` (SKU: ${product.sku})` : ''
  return `Hi ASTERA, I'm interested in ${product.name}${skuNote}. Could you please share availability and details?`
}

export function generalEnquiryMessage(): string {
  return "Hi ASTERA, I'd like to know more about your products."
}
