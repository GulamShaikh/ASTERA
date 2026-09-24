import { supabase } from '../../supabase'
import type { MediaItem } from '../../../types/admin'
import type { ProductImage } from '../../../types/catalogue'

export const PRODUCT_IMAGES_BUCKET = 'product-images'
export const BRAND_LOGOS_BUCKET = 'brand-logos'
export const CATEGORY_IMAGES_BUCKET = 'category-images'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']

const PUBLIC_URL_MARKER = '/storage/v1/object/public/'

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Use a JPG, PNG, WebP, AVIF, or SVG image.'
  }
  if (file.size > MAX_FILE_BYTES) {
    return `Image must be under 5 MB (this one is ${(file.size / 1024 / 1024).toFixed(1)} MB).`
  }
  return null
}

/**
 * Storage path for a public URL, or null when the URL isn't a Storage object
 * (the seeded demo images still point at files bundled in /public).
 */
export function storagePathFromUrl(url: string, bucket: string): string | null {
  const marker = `${PUBLIC_URL_MARKER}${bucket}/`
  const index = url.indexOf(marker)
  if (index === -1) return null
  return decodeURIComponent(url.slice(index + marker.length).split('?')[0])
}

function fileExtension(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase()
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName
  return file.type.split('/')[1] ?? 'jpg'
}

/** Uploads to `{bucket}/{folder}/{uuid}.{ext}` and returns the public URL. */
export async function uploadImage(bucket: string, folder: string, file: File): Promise<string> {
  const invalid = validateImageFile(file)
  if (invalid) throw new Error(invalid)

  const path = `${folder}/${crypto.randomUUID()}.${fileExtension(file)}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })
  if (error) throw new Error(error.message)

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}

/** Best-effort: a missing storage object must not block clearing the database reference. */
export async function removeStorageObject(bucket: string, url: string): Promise<void> {
  const path = storagePathFromUrl(url, bucket)
  if (!path) return
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) console.warn('[ASTERA] could not remove storage object', path, error.message)
}

export async function listProductImages(productId: string): Promise<ProductImage[]> {
  const { data, error } = await supabase
    .from('product_images')
    .select('id, url, alt_text, sort_order')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  return ((data ?? []) as { id: string; url: string; alt_text: string; sort_order: number }[]).map((row) => ({
    id: row.id,
    url: row.url,
    alt: row.alt_text,
  }))
}

export async function addProductImage(
  productId: string,
  url: string,
  altText: string,
  sortOrder: number,
): Promise<void> {
  const { error } = await supabase
    .from('product_images')
    .insert({ product_id: productId, url, alt_text: altText, sort_order: sortOrder })
  if (error) throw new Error(error.message)
}

export async function updateProductImageAlt(imageId: string, altText: string): Promise<void> {
  const { error } = await supabase.from('product_images').update({ alt_text: altText }).eq('id', imageId)
  if (error) throw new Error(error.message)
}

/** Removes the row and its storage object, so no orphan is left behind either way. */
export async function deleteProductImage(imageId: string, url: string): Promise<void> {
  const { error } = await supabase.from('product_images').delete().eq('id', imageId)
  if (error) throw new Error(error.message)
  await removeStorageObject(PRODUCT_IMAGES_BUCKET, url)
}

/** Persists the displayed order; index 0 becomes the primary image. */
export async function reorderProductImages(orderedImageIds: string[]): Promise<void> {
  for (const [index, id] of orderedImageIds.entries()) {
    const { error } = await supabase.from('product_images').update({ sort_order: index }).eq('id', id)
    if (error) throw new Error(error.message)
  }
}

/** Every catalogue image, grouped by the entity that owns it. */
export async function listAllMedia(): Promise<MediaItem[]> {
  const [productImages, brands, categories] = await Promise.all([
    supabase
      .from('product_images')
      .select('id, url, alt_text, sort_order, product:product_id ( id, name, slug )')
      .order('sort_order', { ascending: true }),
    supabase.from('brands').select('id, name, slug, logo_url').not('logo_url', 'is', null),
    supabase.from('categories').select('id, name, slug, image_url').not('image_url', 'is', null),
  ])

  if (productImages.error) throw new Error(productImages.error.message)
  if (brands.error) throw new Error(brands.error.message)
  if (categories.error) throw new Error(categories.error.message)

  type ProductImageRow = {
    id: string
    url: string
    alt_text: string
    product: { id: string; name: string; slug: string } | null
  }

  const items: MediaItem[] = []

  for (const row of (productImages.data ?? []) as unknown as ProductImageRow[]) {
    if (!row.product) continue
    items.push({
      id: row.id,
      url: row.url,
      alt: row.alt_text,
      bucket: PRODUCT_IMAGES_BUCKET,
      ownerType: 'product',
      ownerId: row.product.id,
      ownerName: row.product.name,
      ownerHref: `/admin/products/${row.product.id}/edit`,
      deletable: true,
    })
  }

  for (const row of (brands.data ?? []) as { id: string; name: string; logo_url: string }[]) {
    items.push({
      id: `brand-${row.id}`,
      url: row.logo_url,
      alt: `${row.name} logo`,
      bucket: BRAND_LOGOS_BUCKET,
      ownerType: 'brand',
      ownerId: row.id,
      ownerName: row.name,
      ownerHref: '/admin/brands',
      deletable: true,
    })
  }

  for (const row of (categories.data ?? []) as { id: string; name: string; image_url: string }[]) {
    items.push({
      id: `category-${row.id}`,
      url: row.image_url,
      alt: `${row.name} image`,
      bucket: CATEGORY_IMAGES_BUCKET,
      ownerType: 'category',
      ownerId: row.id,
      ownerName: row.name,
      ownerHref: '/admin/categories',
      deletable: true,
    })
  }

  return items
}

/** Clears a brand logo / category image reference and removes the stored file. */
export async function detachEntityImage(item: MediaItem): Promise<void> {
  if (item.ownerType === 'brand') {
    const { error } = await supabase.from('brands').update({ logo_url: null }).eq('id', item.ownerId)
    if (error) throw new Error(error.message)
  } else if (item.ownerType === 'category') {
    const { error } = await supabase.from('categories').update({ image_url: null }).eq('id', item.ownerId)
    if (error) throw new Error(error.message)
  } else {
    await deleteProductImage(item.id, item.url)
    return
  }

  await removeStorageObject(item.bucket, item.url)
}
