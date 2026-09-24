import { supabase } from '../../supabase'
import type { CatalogueCounts } from '../../../types/admin'
import type { ContentStatus } from '../../../types/catalogue'

/** head:true + exact count — the rows themselves are never transferred. */
async function count(table: string, filters: { status?: ContentStatus; featured?: boolean } = {}): Promise<number> {
  let query = supabase.from(table).select('id', { count: 'exact', head: true })
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.featured !== undefined) query = query.eq('featured', filters.featured)

  const { count: result, error } = await query
  if (error) throw new Error(error.message)
  return result ?? 0
}

/** Real row counts only — no derived or estimated metrics. */
export async function fetchCatalogueCounts(): Promise<CatalogueCounts> {
  const [
    productsPublished,
    productsDraft,
    productsArchived,
    productsFeatured,
    categoriesPublished,
    categoriesTotal,
    brandsPublished,
    brandsTotal,
  ] = await Promise.all([
    count('products', { status: 'published' }),
    count('products', { status: 'draft' }),
    count('products', { status: 'archived' }),
    count('products', { featured: true }),
    count('categories', { status: 'published' }),
    count('categories'),
    count('brands', { status: 'published' }),
    count('brands'),
  ])

  return {
    productsPublished,
    productsDraft,
    productsArchived,
    productsFeatured,
    categoriesPublished,
    categoriesTotal,
    brandsPublished,
    brandsTotal,
  }
}
