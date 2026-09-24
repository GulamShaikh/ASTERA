import { supabase } from '../../supabase'
import type { AdminProductInput, AdminProductListItem, AdminProductRecord } from '../../../types/admin'
import type { ContentStatus } from '../../../types/catalogue'
import { listProductImages } from './media'

const LIST_SELECT = `
  id, slug, name, price, sku, stock_status, status, featured, sort_order, updated_at,
  brand:brand_id ( id, name ),
  category:category_id ( id, name ),
  product_images ( url, sort_order )
`

const RECORD_SELECT = `
  id, slug, name, description, specifications, compatibility, price, compare_at_price,
  sku, stock_status, featured, status, sort_order, brand_id, category_id
`

type ListRow = {
  id: string
  slug: string
  name: string
  price: number | null
  sku: string | null
  stock_status: AdminProductListItem['stockStatus']
  status: ContentStatus
  featured: boolean
  sort_order: number
  updated_at: string
  brand: { id: string; name: string } | null
  category: { id: string; name: string } | null
  product_images: { url: string; sort_order: number }[]
}

type RecordRow = {
  id: string
  slug: string
  name: string
  description: string
  specifications: unknown
  compatibility: string | null
  price: number | null
  compare_at_price: number | null
  sku: string | null
  stock_status: AdminProductListItem['stockStatus']
  featured: boolean
  status: ContentStatus
  sort_order: number
  brand_id: string | null
  category_id: string | null
}

function toSpecifications(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const entries = Object.entries(raw as Record<string, unknown>)
    .filter(([key]) => key.trim() !== '')
    .map(([key, value]) => [key, String(value ?? '')] as const)
  return Object.fromEntries(entries)
}

function toListItem(row: ListRow): AdminProductListItem {
  const primary = [...row.product_images].sort((a, b) => a.sort_order - b.sort_order)[0]

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brandId: row.brand?.id ?? null,
    brandName: row.brand?.name ?? null,
    categoryId: row.category?.id ?? null,
    categoryName: row.category?.name ?? null,
    price: row.price,
    sku: row.sku,
    stockStatus: row.stock_status,
    status: row.status,
    featured: row.featured,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
    primaryImageUrl: primary?.url ?? null,
  }
}

function toColumns(input: AdminProductInput) {
  return {
    name: input.name,
    slug: input.slug,
    brand_id: input.brandId,
    category_id: input.categoryId,
    description: input.description,
    specifications: input.specifications,
    compatibility: input.compatibility,
    price: input.price,
    compare_at_price: input.compareAtPrice,
    sku: input.sku,
    stock_status: input.stockStatus,
    featured: input.featured,
    status: input.status,
    sort_order: input.sortOrder,
  }
}

/** Postgres unique-violation on the slug index. */
function isDuplicateSlug(error: { code?: string; message: string }): boolean {
  return error.code === '23505' && error.message.includes('slug')
}

/** Every product regardless of status — admin-only, enforced by RLS. */
export async function listAdminProducts(): Promise<AdminProductListItem[]> {
  const { data, error } = await supabase
    .from('products')
    .select(LIST_SELECT)
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  return ((data ?? []) as unknown as ListRow[]).map(toListItem)
}

export async function getProductById(id: string): Promise<AdminProductRecord | null> {
  const { data, error } = await supabase.from('products').select(RECORD_SELECT).eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return null

  const row = data as unknown as RecordRow
  const images = await listProductImages(row.id)

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    brandId: row.brand_id,
    categoryId: row.category_id,
    description: row.description,
    specifications: toSpecifications(row.specifications),
    compatibility: row.compatibility,
    price: row.price,
    compareAtPrice: row.compare_at_price,
    sku: row.sku,
    stockStatus: row.stock_status,
    featured: row.featured,
    status: row.status,
    sortOrder: row.sort_order,
    images,
  }
}

export async function createProduct(input: AdminProductInput): Promise<string> {
  const { data, error } = await supabase.from('products').insert(toColumns(input)).select('id').single()

  if (error) {
    throw new Error(isDuplicateSlug(error) ? `The slug "${input.slug}" is already in use.` : error.message)
  }
  return (data as { id: string }).id
}

export async function updateProduct(id: string, input: AdminProductInput): Promise<void> {
  const { error } = await supabase.from('products').update(toColumns(input)).eq('id', id)
  if (error) {
    throw new Error(isDuplicateSlug(error) ? `The slug "${input.slug}" is already in use.` : error.message)
  }
}

export async function updateProductStatus(id: string, status: ContentStatus): Promise<void> {
  const { error } = await supabase.from('products').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
}

/** Catalogue removal is always an archive — rows are never hard-deleted from the admin UI. */
export async function archiveProduct(id: string): Promise<void> {
  await updateProductStatus(id, 'archived')
}

/** True when another product already uses this slug. */
export async function isProductSlugTaken(slug: string, exceptId?: string): Promise<boolean> {
  let query = supabase.from('products').select('id').eq('slug', slug).limit(1)
  if (exceptId) query = query.neq('id', exceptId)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []).length > 0
}
