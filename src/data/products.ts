import { IconBolt, IconCable, IconHeadphones, IconPhoneCase } from '../components/common/icons'
import type { ComponentType, SVGProps } from 'react'

export type Product = {
  id: string
  name: string
  brand: string
  category: string
  price?: number
  /** Real product photo, sourced from the approved Stitch design. Falls back to `icon` when absent. */
  image?: string
  /** Placeholder visual used until real product photography is supplied for this item. */
  icon: ComponentType<SVGProps<SVGSVGElement>>
  description: string
  featured?: boolean
}

/**
 * Demo catalogue data — no real ASTERA catalogue or pricing exists yet.
 * Product photography (where present via `image`) comes from the approved
 * Stitch "v3 Production Ready" design. Replace with the real catalogue
 * before launch; the shape below is the contract the UI expects.
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
