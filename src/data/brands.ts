import type { Brand } from '../types/catalogue'

/**
 * Reference fixtures only — the live site reads brands from Supabase via
 * src/lib/api/brands.ts. Names use role descriptors rather than invented
 * company names. Mirrors the seeded rows; kept as a development reference
 * until the database migration is proven in production.
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
