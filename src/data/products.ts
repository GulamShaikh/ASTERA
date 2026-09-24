import { IconBolt, IconCable, IconHeadphones, IconPhoneCase } from '../components/common/icons'
import type { Product } from '../types/catalogue'

/**
 * Reference fixtures only — the live site reads this catalogue from Supabase
 * via src/lib/api/products.ts. These mirror the rows seeded by
 * supabase/migrations/20260923040000_seed_demo_data.sql and are kept as a
 * development reference until the database migration is proven in production.
 * Nothing in src/pages or src/components imports this file.
 */
export const products: Product[] = [
  {
    id: 'gan-dual-port-charger',
    name: 'GaN Dual-Port Charger',
    brand: 'Emerging Brand',
    category: 'Chargers',
    image: '/images/products/gan-dual-port-charger.jpg',
    icon: IconBolt,
    description: 'Dual USB-C fast charging in an ultra-compact everyday shell.',
    featured: true,
  },
  {
    id: 'braided-type-c-cable',
    name: 'Braided Type-C Cable',
    brand: 'Independent Brand',
    category: 'Cables',
    image: '/images/products/braided-type-c-cable.jpg',
    icon: IconCable,
    description: 'Reinforced strain-relief joints with a durable tangle-resistant sleeve.',
  },
  {
    id: 'wireless-earbuds',
    name: 'Wireless Earbuds',
    brand: 'Emerging Brand',
    category: 'Earphones & Earbuds',
    image: '/images/products/wireless-earbuds.jpg',
    icon: IconHeadphones,
    description: 'Balanced sound chamber with a comfortable ergonomic daily fit.',
    featured: true,
  },
  {
    id: 'magnetic-phone-case',
    name: 'Magnetic Phone Case',
    brand: 'Independent Brand',
    category: 'Mobile Cases',
    image: '/images/products/phonecase.jpg',
    icon: IconPhoneCase,
    description: 'Tactile side grips with a responsive matte finish.',
  },
]
