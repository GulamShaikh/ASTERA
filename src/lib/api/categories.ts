import { supabase } from '../supabase'
import { resolveIcon } from '../iconKeys'
import type { Category } from '../../types/catalogue'
import type { CategoryRow } from './types'

const CATEGORY_SELECT = 'id, slug, name, description, icon_key, image_url, status, sort_order'

function toCategory(row: CategoryRow): Category {
  return {
    id: row.slug,
    name: row.name,
    description: row.description,
    icon: resolveIcon(row.icon_key),
    imageUrl: row.image_url ?? undefined,
  }
}

export async function fetchPublishedCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select(CATEGORY_SELECT)
    .eq('status', 'published')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return ((data ?? []) as CategoryRow[]).map(toCategory)
}

/** Null when the slug doesn't exist, or the category is draft/archived. */
export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select(CATEGORY_SELECT)
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data ? toCategory(data as CategoryRow) : null
}
