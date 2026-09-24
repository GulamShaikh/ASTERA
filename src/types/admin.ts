import type { ContentStatus, ProductImage, StockStatus } from './catalogue'

/** Admin sees every row regardless of status, and works with real database ids (not slugs). */

export type AdminProductListItem = {
  id: string
  slug: string
  name: string
  brandId: string | null
  brandName: string | null
  categoryId: string | null
  categoryName: string | null
  price: number | null
  sku: string | null
  stockStatus: StockStatus
  status: ContentStatus
  featured: boolean
  sortOrder: number
  updatedAt: string
  primaryImageUrl: string | null
}

export type AdminProductInput = {
  name: string
  slug: string
  brandId: string | null
  categoryId: string | null
  description: string
  /** Flat key/value pairs persisted to the `specifications` jsonb column. */
  specifications: Record<string, string>
  compatibility: string | null
  price: number | null
  compareAtPrice: number | null
  sku: string | null
  stockStatus: StockStatus
  featured: boolean
  status: ContentStatus
  sortOrder: number
}

export type AdminProductRecord = AdminProductInput & {
  id: string
  images: ProductImage[]
}

export type AdminCategory = {
  id: string
  slug: string
  name: string
  description: string
  iconKey: string
  imageUrl: string | null
  status: ContentStatus
  sortOrder: number
  updatedAt: string
}

export type AdminCategoryInput = {
  name: string
  slug: string
  description: string
  iconKey: string
  imageUrl: string | null
  status: ContentStatus
  sortOrder: number
}

export type AdminBrand = {
  id: string
  slug: string
  name: string
  category: string
  description: string
  logoUrl: string | null
  status: ContentStatus
  featured: boolean
  local: boolean
  sortOrder: number
  updatedAt: string
}

export type AdminBrandInput = {
  name: string
  slug: string
  category: string
  description: string
  logoUrl: string | null
  status: ContentStatus
  featured: boolean
  local: boolean
  sortOrder: number
}

export type CatalogueCounts = {
  productsPublished: number
  productsDraft: number
  productsArchived: number
  productsFeatured: number
  categoriesPublished: number
  categoriesTotal: number
  brandsPublished: number
  brandsTotal: number
}

/** A media item shown in /admin/media, always tied to the entity that owns it. */
export type MediaItem = {
  id: string
  url: string
  alt: string
  bucket: string
  ownerType: 'product' | 'brand' | 'category'
  ownerId: string
  ownerName: string
  ownerHref: string
  /** Product images are rows we can delete; brand/category images are columns we clear. */
  deletable: boolean
}
