import { supabase } from '../supabase'
import type { Brand } from '../../types/catalogue'
import type { BrandRow } from './types'

const BRAND_SELECT = 'id, slug, name, category, description, logo_url, status, featured, local, sort_order'

function toBrand(row: BrandRow): Brand {
  return {
    id: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    logoUrl: row.logo_url ?? undefined,
    local: row.local,
    featured: row.featured,
  }
}

export async function fetchPublishedBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select(BRAND_SELECT)
    .eq('status', 'published')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return ((data ?? []) as BrandRow[]).map(toBrand)
}

/** Null when the slug doesn't exist, or the brand is draft/archived. */
export async function fetchBrandBySlug(slug: string): Promise<Brand | null> {
  const { data, error } = await supabase
    .from('brands')
    .select(BRAND_SELECT)
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data ? toBrand(data as BrandRow) : null
}
