import { supabase } from '../../supabase'
import type { AdminCategory, AdminCategoryInput } from '../../../types/admin'
import type { ContentStatus } from '../../../types/catalogue'

const SELECT = 'id, slug, name, description, icon_key, image_url, status, sort_order, updated_at'

type Row = {
  id: string
  slug: string
  name: string
  description: string
  icon_key: string
  image_url: string | null
  status: ContentStatus
  sort_order: number
  updated_at: string
}

function toCategory(row: Row): AdminCategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    iconKey: row.icon_key,
    imageUrl: row.image_url,
    status: row.status,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  }
}

function toColumns(input: AdminCategoryInput) {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description,
    icon_key: input.iconKey,
    image_url: input.imageUrl,
    status: input.status,
    sort_order: input.sortOrder,
  }
}

function isDuplicateSlug(error: { code?: string; message: string }): boolean {
  return error.code === '23505' && error.message.includes('slug')
}

export async function listAdminCategories(): Promise<AdminCategory[]> {
  const { data, error } = await supabase.from('categories').select(SELECT).order('sort_order', { ascending: true })
  if (error) throw new Error(error.message)
  return ((data ?? []) as Row[]).map(toCategory)
}

export async function createCategory(input: AdminCategoryInput): Promise<string> {
  const { data, error } = await supabase.from('categories').insert(toColumns(input)).select('id').single()
  if (error) {
    throw new Error(isDuplicateSlug(error) ? `The slug "${input.slug}" is already in use.` : error.message)
  }
  return (data as { id: string }).id
}

export async function updateCategory(id: string, input: AdminCategoryInput): Promise<void> {
  const { error } = await supabase.from('categories').update(toColumns(input)).eq('id', id)
  if (error) {
    throw new Error(isDuplicateSlug(error) ? `The slug "${input.slug}" is already in use.` : error.message)
  }
}

export async function updateCategoryStatus(id: string, status: ContentStatus): Promise<void> {
  const { error } = await supabase.from('categories').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function archiveCategory(id: string): Promise<void> {
  await updateCategoryStatus(id, 'archived')
}

export async function isCategorySlugTaken(slug: string, exceptId?: string): Promise<boolean> {
  let query = supabase.from('categories').select('id').eq('slug', slug).limit(1)
  if (exceptId) query = query.neq('id', exceptId)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []).length > 0
}

/**
 * How many products still point at this category, so the UI can warn before
 * archiving instead of silently emptying a public page.
 */
export async function countProductsInCategory(categoryId: string): Promise<{ published: number; total: number }> {
  const [published, total] = await Promise.all([
    supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', categoryId)
      .eq('status', 'published'),
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('category_id', categoryId),
  ])

  if (published.error) throw new Error(published.error.message)
  if (total.error) throw new Error(total.error.message)

  return { published: published.count ?? 0, total: total.count ?? 0 }
}
