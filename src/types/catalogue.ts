import type { ComponentType, SVGProps } from 'react'

/**
 * The shapes the UI renders. These are the stable contract between the data
 * layer (src/lib/api/*, backed by Supabase) and every component -- kept here
 * rather than in src/data so they survive once the demo fixtures are removed.
 */

export type ContentStatus = 'draft' | 'published' | 'archived'
export type StockStatus = 'in_stock' | 'out_of_stock' | 'preorder'

/** Card-level product shape, used by every grid/listing. `id` is the product slug. */
export type Product = {
  id: string
  name: string
  brand: string
  brandSlug?: string
  category: string
  categorySlug?: string
  price?: number
  image?: string
  /** Fallback visual when a product has no photography yet. */
  icon: ComponentType<SVGProps<SVGSVGElement>>
  description: string
  featured?: boolean
}

export type ProductImage = {
  id: string
  url: string
  alt: string
}

export type Specification = {
  label: string
  value: string
}

/** Everything the /product/:slug page needs. */
export type ProductDetail = Product & {
  compareAtPrice?: number
  sku?: string
  stockStatus: StockStatus
  compatibility?: string
  specifications: Specification[]
  images: ProductImage[]
}

/** `id` is the category slug. */
export type Category = {
  id: string
  name: string
  description: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  imageUrl?: string
}

/** `id` is the brand slug. */
export type Brand = {
  id: string
  name: string
  category: string
  description: string
  logoUrl?: string
  local?: boolean
  featured?: boolean
}
