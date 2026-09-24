import type { Product } from '../types/catalogue'

export const ALL_CATEGORIES = 'All Products'

export type SortOption = 'featured' | 'name-asc' | 'name-desc' | 'category'

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' },
  { value: 'category', label: 'Category' },
]

export function filterProducts(products: Product[], category: string, query: string): Product[] {
  const q = query.trim().toLowerCase()

  return products.filter((product) => {
    const matchesCategory = category === ALL_CATEGORIES || product.category === category
    const matchesQuery =
      q.length === 0 ||
      [product.name, product.description, product.category, product.brand].some((field) =>
        field.toLowerCase().includes(q),
      )
    return matchesCategory && matchesQuery
  })
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products]

  switch (sort) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
    case 'featured':
    default:
      // Array.prototype.sort is stable (ES2019+), so catalogue order is preserved within each group.
      return sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
  }
}

export function isSortOption(value: string | null): value is SortOption {
  return value === 'featured' || value === 'name-asc' || value === 'name-desc' || value === 'category'
}
