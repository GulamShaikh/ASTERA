import { supabase } from '../../supabase'
import type { AdminBrand, AdminBrandInput } from '../../../types/admin'
import type { ContentStatus } from '../../../types/catalogue'

const SELECT = 'id, slug, name, category, description, logo_url, status, featured, local, sort_order, updated_at'

type Row = {
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
  updated_at: string
}

function toBrand(row: Row): AdminBrand {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    logoUrl: row.logo_url,
    status: row.status,
    featured: row.featured,
    local: row.local,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  }
}

function toColumns(input: AdminBrandInput) {
  return {
    name: input.name,
    slug: input.slug,
    category: input.category,
    description: input.description,
    logo_url: input.logoUrl,
    status: input.status,
    featured: input.featured,
    local: input.local,
    sort_order: input.sortOrder,
  }
}

function isDuplicateSlug(error: { code?: string; message: string }): boolean {
  return error.code === '23505' && error.message.includes('slug')
}

export async function listAdminBrands(): Promise<AdminBrand[]> {
  const { data, error } = await supabase.from('brands').select(SELECT).order('sort_order', { ascending: true })
  if (error) throw new Error(error.message)
  return ((data ?? []) as Row[]).map(toBrand)
}

export async function createBrand(input: AdminBrandInput): Promise<string> {
  const { data, error } = await supabase.from('brands').insert(toColumns(input)).select('id').single()
  if (error) {
    throw new Error(isDuplicateSlug(error) ? `The slug "${input.slug}" is already in use.` : error.message)
  }
  return (data as { id: string }).id
}

export async function updateBrand(id: string, input: AdminBrandInput): Promise<void> {
  const { error } = await supabase.from('brands').update(toColumns(input)).eq('id', id)
  if (error) {
    throw new Error(isDuplicateSlug(error) ? `The slug "${input.slug}" is already in use.` : error.message)
  }
}

export async function updateBrandStatus(id: string, status: ContentStatus): Promise<void> {
  const { error } = await supabase.from('brands').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function archiveBrand(id: string): Promise<void> {
  await updateBrandStatus(id, 'archived')
}

export async function isBrandSlugTaken(slug: string, exceptId?: string): Promise<boolean> {
  let query = supabase.from('brands').select('id').eq('slug', slug).limit(1)
  if (exceptId) query = query.neq('id', exceptId)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []).length > 0
}

/** Products still pointing at this brand, so archiving can warn first. */
export async function countProductsForBrand(brandId: string): Promise<{ published: number; total: number }> {
  const [published, total] = await Promise.all([
    supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('brand_id', brandId)
      .eq('status', 'published'),
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('brand_id', brandId),
  ])

  if (published.error) throw new Error(published.error.message)
  if (total.error) throw new Error(total.error.message)

  return { published: published.count ?? 0, total: total.count ?? 0 }
}
