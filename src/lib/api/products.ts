import { supabase } from '../supabase'
import { resolveIcon } from '../iconKeys'
import type { Product, ProductDetail, ProductImage, Specification } from '../../types/catalogue'
import type { ProductImageRow, ProductRelationRow } from './types'

type JoinOptions = {
  innerBrand?: boolean
  innerCategory?: boolean
}

/**
 * PostgREST needs an `!inner` join to filter on an embedded resource's column
 * (e.g. products where category.slug = 'chargers'), so the join style is
 * parameterised rather than duplicating the whole select string.
 */
function productSelect({ innerBrand = false, innerCategory = false }: JoinOptions = {}) {
  const brandJoin = innerBrand ? 'brand:brand_id!inner' : 'brand:brand_id'
  const categoryJoin = innerCategory ? 'category:category_id!inner' : 'category:category_id'

  return `
    id, slug, name, description, price, compare_at_price, sku, stock_status,
    featured, status, sort_order, specifications, compatibility,
    ${brandJoin} ( id, slug, name ),
    ${categoryJoin} ( id, slug, name, icon_key ),
    product_images ( id, url, alt_text, sort_order )
  `
}

function sortImages(images: ProductImageRow[]): ProductImageRow[] {
  return [...images].sort((a, b) => a.sort_order - b.sort_order)
}

function toProduct(row: ProductRelationRow): Product {
  const [primaryImage] = sortImages(row.product_images)

  return {
    id: row.slug,
    name: row.name,
    brand: row.brand?.name ?? 'ASTERA',
    brandSlug: row.brand?.slug,
    category: row.category?.name ?? 'Uncategorised',
    categorySlug: row.category?.slug,
    price: row.price ?? undefined,
    image: primaryImage?.url,
    icon: resolveIcon(row.category?.icon_key),
    description: row.description,
    featured: row.featured,
  }
}

/** `specifications` is admin-authored jsonb, so anything could be in there. */
function toSpecifications(raw: unknown): Specification[] {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return []

  return Object.entries(raw as Record<string, unknown>)
    .filter(([label, value]) => label.trim() !== '' && value !== null && value !== undefined && String(value).trim() !== '')
    .map(([label, value]) => ({ label, value: String(value) }))
}

function toProductImages(rows: ProductImageRow[], productName: string): ProductImage[] {
  return sortImages(rows).map((row) => ({
    id: row.id,
    url: row.url,
    alt: row.alt_text.trim() === '' ? productName : row.alt_text,
  }))
}

function toProductDetail(row: ProductRelationRow): ProductDetail {
  return {
    ...toProduct(row),
    compareAtPrice: row.compare_at_price ?? undefined,
    sku: row.sku ?? undefined,
    stockStatus: row.stock_status,
    compatibility: row.compatibility?.trim() ? row.compatibility : undefined,
    specifications: toSpecifications(row.specifications),
    images: toProductImages(row.product_images, row.name),
  }
}

function asRows(data: unknown): ProductRelationRow[] {
  return (data ?? []) as ProductRelationRow[]
}

/** Every published product, in catalogue order. */
export async function fetchPublishedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(productSelect())
    .eq('status', 'published')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return asRows(data).map(toProduct)
}

/** Full detail for one published product. Null when the slug doesn't exist, or the product is draft/archived. */
export async function fetchProductDetailBySlug(slug: string): Promise<ProductDetail | null> {
  const { data, error } = await supabase
    .from('products')
    .select(productSelect())
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data ? toProductDetail(data as unknown as ProductRelationRow) : null
}

export async function fetchProductsByCategorySlug(categorySlug: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(productSelect({ innerCategory: true }))
    .eq('status', 'published')
    .eq('category.slug', categorySlug)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return asRows(data).map(toProduct)
}

export async function fetchProductsByBrandSlug(brandSlug: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(productSelect({ innerBrand: true }))
    .eq('status', 'published')
    .eq('brand.slug', brandSlug)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return asRows(data).map(toProduct)
}

/** Other published products in the same category. Empty when the product is the only one there. */
export async function fetchRelatedProducts(
  categorySlug: string,
  excludeSlug: string,
  limit = 4,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(productSelect({ innerCategory: true }))
    .eq('status', 'published')
    .eq('category.slug', categorySlug)
    .neq('slug', excludeSlug)
    .order('sort_order', { ascending: true })
    .limit(limit)

  if (error) throw error
  return asRows(data).map(toProduct)
}
