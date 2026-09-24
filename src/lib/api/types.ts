/** Row shapes as they come back from Supabase -- kept separate from the UI
 * types in src/types/catalogue.ts, which are the shapes components consume. */

import type { ContentStatus, StockStatus } from '../../types/catalogue'

export type { ContentStatus, StockStatus }

export type BrandRow = {
  id: string
  slug: string
  name: string
  category: string
  description: string
  logo_url: string | null
  status: ContentStatus
  featured: boolean
  local: boolean
  sort_order: number
}

export type CategoryRow = {
  id: string
  slug: string
  name: string
  description: string
  icon_key: string
  image_url: string | null
  status: ContentStatus
  sort_order: number
}

export type ProductImageRow = {
  id: string
  url: string
  alt_text: string
  sort_order: number
}

export type ProductRelationRow = {
  id: string
  slug: string
  name: string
  description: string
  price: number | null
  compare_at_price: number | null
  sku: string | null
  stock_status: StockStatus
  featured: boolean
  status: ContentStatus
  sort_order: number
  specifications: unknown
  compatibility: string | null
  brand: Pick<BrandRow, 'id' | 'slug' | 'name'> | null
  category: Pick<CategoryRow, 'id' | 'slug' | 'name' | 'icon_key'> | null
  product_images: ProductImageRow[]
}
