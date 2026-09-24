/**
 * Client-supplied business details — the single place to edit them.
 *
 * A `null` value means ASTERA hasn't confirmed that detail yet. The UI shows
 * a clearly-marked "pending" state instead of inventing a number, address, or
 * inbox. Fill in a value here and the pending marker disappears everywhere
 * it's used.
 */

/**
 * Client-provided contact number (given as a 10-digit Indian number, used for
 * both WhatsApp and phone). Digits only, or `null` if not yet available —
 * src/lib/whatsapp.ts formats it into a wa.me link.
 */
export const WHATSAPP_NUMBER: string | null = '9372194085'

export type ContactChannel = {
  id: string
  label: string
  value: string | null
  /** Builds the link target once a real value exists (mailto:, tel:, etc.). */
  toHref?: (value: string) => string
}

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: 'phone',
    label: 'Phone',
    value: WHATSAPP_NUMBER,
    toHref: (value) => `tel:+91${value.replace(/\D/g, '')}`,
  },
  {
    id: 'email',
    label: 'Email',
    value: 'gulamshaikh2455@gmail.com',
    toHref: (value) => `mailto:${value}`,
  },
  {
    id: 'address',
    label: 'Address',
    value: 'Marve Road, Malad West, Mumbai 400095',
  },
  {
    id: 'hours',
    label: 'Business Hours',
    value: '11:00 AM – 11:00 PM',
  },
]

/** ASTERA's curation principles, from the project brief — not marketing claims about outcomes. */
export const CURATION_PRINCIPLES = [
  {
    title: 'Discover New Brands',
    description: 'Seek out emerging, independent, and local accessory makers before they reach mainstream shelves.',
  },
  {
    title: 'Curate Useful Products',
    description: 'Choose accessories for everyday usefulness rather than spec-sheet novelty.',
  },
  {
    title: 'Check for Quality',
    description: 'Evaluate build, materials, connector fit, and how a product holds up in daily use.',
  },
  {
    title: 'Make Good Technology Accessible',
    description: 'Present clear specifications and honest descriptions so the right choice is an easy one.',
  },
  {
    title: 'Support Emerging Makers',
    description: 'Give smaller brands a considered place to be found, alongside the products they build.',
  },
]
