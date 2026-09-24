import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useAsyncData } from '../../hooks/useAsyncData'
import { archiveProduct, listAdminProducts, updateProductStatus } from '../../lib/api/admin'
import { formatPrice, stockStatusLabel } from '../../lib/format'
import type { AdminProductListItem } from '../../types/admin'
import type { ContentStatus } from '../../types/catalogue'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminTable, type AdminColumn } from '../../components/admin/AdminTable'
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from '../../components/admin/AdminStates'
import { AdminStatusBadge } from '../../components/admin/AdminStatusBadge'
import { AdminConfirmDialog } from '../../components/admin/AdminConfirmDialog'
import { adminInputClasses } from '../../components/admin/AdminFormField'

type SortKey = 'order' | 'name' | 'updated' | 'status'

const STATUS_FILTERS: { value: ContentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'order', label: 'Catalogue order' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'updated', label: 'Recently updated' },
  { value: 'status', label: 'Status' },
]

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function AdminProducts() {
  usePageTitle('Products — ASTERA Admin')
  const { data: products, loading, error, refetch } = useAsyncData(() => listAdminProducts(), [])

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<ContentStatus | 'all'>('all')
  const [categoryId, setCategoryId] = useState('all')
  const [brandId, setBrandId] = useState('all')
  const [sort, setSort] = useState<SortKey>('order')

  const [pendingArchive, setPendingArchive] = useState<AdminProductListItem | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const categoryOptions = useMemo(() => {
    const map = new Map<string, string>()
    for (const product of products ?? []) {
      if (product.categoryId && product.categoryName) map.set(product.categoryId, product.categoryName)
    }
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]))
  }, [products])

  const brandOptions = useMemo(() => {
    const map = new Map<string, string>()
    for (const product of products ?? []) {
      if (product.brandId && product.brandName) map.set(product.brandId, product.brandName)
    }
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]))
  }, [products])

  const visible = useMemo(() => {
    if (!products) return null
    const needle = query.trim().toLowerCase()

    const filtered = products.filter((product) => {
      const matchesQuery =
        needle === '' ||
        [product.name, product.slug, product.brandName ?? '', product.categoryName ?? '', product.sku ?? ''].some(
          (field) => field.toLowerCase().includes(needle),
        )
      const matchesStatus = status === 'all' || product.status === status
      const matchesCategory = categoryId === 'all' || product.categoryId === categoryId
      const matchesBrand = brandId === 'all' || product.brandId === brandId
      return matchesQuery && matchesStatus && matchesCategory && matchesBrand
    })

    const sorted = [...filtered]
    switch (sort) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'updated':
        sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        break
      case 'status':
        sorted.sort((a, b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name))
        break
      default:
        sorted.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
    }
    return sorted
  }, [products, query, status, categoryId, brandId, sort])

  const hasFilters = query !== '' || status !== 'all' || categoryId !== 'all' || brandId !== 'all' || sort !== 'order'

  function clearFilters() {
    setQuery('')
    setStatus('all')
    setCategoryId('all')
    setBrandId('all')
    setSort('order')
  }

  async function changeStatus(product: AdminProductListItem, next: ContentStatus) {
    setBusyId(product.id)
    setActionError(null)
    try {
      await updateProductStatus(product.id, next)
      refetch()
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Could not update this product.')
    } finally {
      setBusyId(null)
    }
  }

  async function confirmArchive() {
    if (!pendingArchive) return
    setBusyId(pendingArchive.id)
    setActionError(null)
    try {
      await archiveProduct(pendingArchive.id)
      setPendingArchive(null)
      refetch()
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Could not archive this product.')
    } finally {
      setBusyId(null)
    }
  }

  const columns: AdminColumn<AdminProductListItem>[] = [
    {
      key: 'product',
      header: 'Product',
      render: (product) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
            {product.primaryImageUrl ? (
              <img src={product.primaryImageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[10px] text-starlight/35">
                No image
              </span>
            )}
          </div>
          <div className="flex min-w-0 flex-col">
            <Link to={`/admin/products/${product.id}/edit`} className="truncate font-medium text-white hover:underline">
              {product.name}
            </Link>
            <span className="truncate text-xs text-starlight/45">/{product.slug}</span>
          </div>
        </div>
      ),
    },
    { key: 'brand', header: 'Brand', secondary: true, render: (p) => p.brandName ?? '—' },
    { key: 'category', header: 'Category', secondary: true, render: (p) => p.categoryName ?? '—' },
    {
      key: 'price',
      header: 'Price',
      align: 'right',
      render: (p) => (p.price === null ? <span className="text-starlight/40">—</span> : formatPrice(p.price)),
    },
    { key: 'stock', header: 'Stock', secondary: true, render: (p) => stockStatusLabel(p.stockStatus) },
    { key: 'status', header: 'Status', render: (p) => <AdminStatusBadge status={p.status} /> },
    { key: 'updated', header: 'Updated', secondary: true, render: (p) => formatDate(p.updatedAt) },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (product) => {
        const busy = busyId === product.id
        return (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Link
              to={`/admin/products/${product.id}/edit`}
              className="rounded-md border border-white/15 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/5"
            >
              Edit
            </Link>
            {product.status !== 'published' && (
              <button
                type="button"
                disabled={busy}
                onClick={() => changeStatus(product, 'published')}
                className="rounded-md border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50"
              >
                Publish
              </button>
            )}
            {product.status !== 'draft' && (
              <button
                type="button"
                disabled={busy}
                onClick={() => changeStatus(product, 'draft')}
                className="rounded-md border border-amber-500/30 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/10 disabled:opacity-50"
              >
                To Draft
              </button>
            )}
            {product.status !== 'archived' && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setPendingArchive(product)}
                className="rounded-md border border-white/15 px-2.5 py-1 text-xs font-semibold text-starlight/70 hover:bg-white/5 disabled:opacity-50"
              >
                Archive
              </button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <>
      <AdminPageHeader
        title="Products"
        description="Create, publish, and archive catalogue products. Archived and draft products stay hidden from the public site."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Products' }]}
        actions={
          <Link
            to="/admin/products/new"
            className="rounded-lg bg-cosmic-blue px-4 py-2 text-sm font-semibold text-white hover:bg-cosmic-blue/90"
          >
            Add Product
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-2">
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, slug, brand, category…"
            className={adminInputClasses}
          />
        </div>

        <div>
          <label htmlFor="product-status" className="sr-only">
            Filter by status
          </label>
          <select
            id="product-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as ContentStatus | 'all')}
            className={adminInputClasses}
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option.value} value={option.value} className="bg-space-black">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="product-category" className="sr-only">
            Filter by category
          </label>
          <select
            id="product-category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className={adminInputClasses}
          >
            <option value="all" className="bg-space-black">
              All categories
            </option>
            {categoryOptions.map(([id, name]) => (
              <option key={id} value={id} className="bg-space-black">
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="product-brand" className="sr-only">
            Filter by brand
          </label>
          <select
            id="product-brand"
            value={brandId}
            onChange={(event) => setBrandId(event.target.value)}
            className={adminInputClasses}
          >
            <option value="all" className="bg-space-black">
              All brands
            </option>
            {brandOptions.map(([id, name]) => (
              <option key={id} value={id} className="bg-space-black">
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-starlight/55">
          {loading ? 'Loading…' : `${visible?.length ?? 0} of ${products?.length ?? 0} products`}
        </p>
        <div className="flex items-center gap-3">
          <label htmlFor="product-sort" className="text-xs text-starlight/50">
            Sort
          </label>
          <select
            id="product-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className={`${adminInputClasses} w-auto py-1.5 text-xs`}
          >
            {SORTS.map((option) => (
              <option key={option.value} value={option.value} className="bg-space-black">
                {option.label}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="text-xs font-semibold text-white hover:underline">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {actionError && (
        <p role="alert" className="rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-sm text-red-200">
          {actionError}
        </p>
      )}

      {loading ? (
        <AdminLoadingState label="Loading products" />
      ) : error ? (
        <AdminErrorState onRetry={refetch} description="Could not load products." />
      ) : !visible || visible.length === 0 ? (
        <AdminEmptyState
          title={hasFilters ? 'No products match these filters' : 'No products yet'}
          description={
            hasFilters
              ? 'Try a different search term or clear the filters.'
              : 'Add your first product — it stays a draft until you publish it.'
          }
          action={
            hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/admin/products/new"
                className="rounded-lg bg-cosmic-blue px-4 py-2 text-sm font-semibold text-white hover:bg-cosmic-blue/90"
              >
                Add Product
              </Link>
            )
          }
        />
      ) : (
        <AdminTable columns={columns} rows={visible} rowKey={(product) => product.id} caption="Catalogue products" />
      )}

      <AdminConfirmDialog
        open={pendingArchive !== null}
        title="Archive this product?"
        description={
          <>
            <span className="text-white">{pendingArchive?.name}</span> will be hidden from the public site immediately.
            Nothing is deleted — you can publish it again at any time.
          </>
        }
        confirmLabel="Archive Product"
        tone="destructive"
        busy={busyId !== null && busyId === pendingArchive?.id}
        onConfirm={confirmArchive}
        onCancel={() => setPendingArchive(null)}
      />
    </>
  )
}
