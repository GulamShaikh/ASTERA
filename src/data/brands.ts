export type Brand = {
  id: string
  name: string
  category: string
  description: string
  local?: boolean
  featured?: boolean
}

/**
 * Demo brand-discovery data — ASTERA has not onboarded real partner brands
 * yet. Names use role descriptors rather than invented company names; swap
 * in real brand profiles as partnerships are confirmed.
 */
export const brands: Brand[] = [
  {
    id: 'hardware-power',
    name: 'Independent Hardware Studio',
    category: 'Hardware & Power',
    description:
      'Focused on compact power architectures and thermal efficiency for everyday workspace setups.',
  },
  {
    id: 'audio-sound',
    name: 'Acoustic Design Studio',
    category: 'Audio & Sound',
    description:
      'Dedicated to balanced sound tuning, clean listening profiles, and comfortable all-day wear.',
  },
  {
    id: 'device-protection',
    name: 'Protective Gear Makers',
    category: 'Device Protection',
    description:
      'Precision composite textures and ergonomic design built for reliable device longevity.',
  },
]
