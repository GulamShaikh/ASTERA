import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useAsyncData } from '../../hooks/useAsyncData'
import { detachEntityImage, listAllMedia } from '../../lib/api/admin'
import { storagePathFromUrl } from '../../lib/api/admin/media'
import type { MediaItem } from '../../types/admin'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from '../../components/admin/AdminStates'
import { AdminConfirmDialog } from '../../components/admin/AdminConfirmDialog'
import { adminInputClasses } from '../../components/admin/AdminFormField'

const OWNER_FILTERS = [
  { value: 'all', label: 'All media' },
  { value: 'product', label: 'Product images' },
  { value: 'brand', label: 'Brand logos' },
  { value: 'category', label: 'Category images' },
] as const

type OwnerFilter = (typeof OWNER_FILTERS)[number]['value']

const OWNER_LABELS: Record<MediaItem['ownerType'], string> = {
  product: 'Product',
  brand: 'Brand',
  category: 'Category',
}

export function AdminMedia() {
  usePageTitle('Media — ASTERA Admin')
  const { data: media, loading, error, refetch } = useAsyncData(() => listAllMedia(), [])

  const [query, setQuery] = useState('')
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>('all')
  const [pendingDelete, setPendingDelete] = useState<MediaItem | null>(null)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const visible = useMemo(() => {
    if (!media) return null
    const needle = query.trim().toLowerCase()
    return media.filter((item) => {
      const matchesQuery = needle === '' || [item.ownerName, item.alt].some((f) => f.toLowerCase().includes(needle))
      return matchesQuery && (ownerFilter === 'all' || item.ownerType === ownerFilter)
    })
  }, [media, query, ownerFilter])

  async function confirmDelete() {
    if (!pendingDelete) return
    setBusy(true)
    setActionError(null)
    try {
      await detachEntityImage(pendingDelete)
      setPendingDelete(null)
      refetch()
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Could not remove this image.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Media"
        description="Every image used by the catalogue, grouped by the product, brand, or category that owns it."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Media' }]}
      />

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor="media-search" className="sr-only">
            Search media
          </label>
          <input
            id="media-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by product, brand, or category name…"
            className={adminInputClasses}
          />
        </div>
        <div>
          <label htmlFor="media-owner" className="sr-only">
            Filter by type
          </label>
          <select
            id="media-owner"
            value={ownerFilter}
            onChange={(event) => setOwnerFilter(event.target.value as OwnerFilter)}
            className={adminInputClasses}
          >
            {OWNER_FILTERS.map((option) => (
              <option key={option.value} value={option.value} className="bg-space-black">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionError && (
        <p role="alert" className="rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-sm text-red-200">
          {actionError}
        </p>
      )}

      {loading ? (
        <AdminLoadingState label="Loading media" rows={4} />
      ) : error ? (
        <AdminErrorState onRetry={refetch} description="Could not load media." />
      ) : !visible || visible.length === 0 ? (
        <AdminEmptyState
          title="No media found"
          description={
            query || ownerFilter !== 'all'
              ? 'Try a different search or filter.'
              : 'Images uploaded to products, brands, and categories will appear here.'
          }
        />
      ) : (
        <>
          <p className="text-sm text-starlight/55">{visible.length} image{visible.length === 1 ? '' : 's'}</p>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => {
              const inStorage = storagePathFromUrl(item.url, item.bucket) !== null
              return (
                <li key={item.id} className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-white/[0.04]">
                    <img src={item.url} alt={item.alt} loading="lazy" className="h-full w-full object-cover" />
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md border border-white/15 px-2 py-0.5 text-[11px] font-medium text-starlight/60">
                        {OWNER_LABELS[item.ownerType]}
                      </span>
                      {!inStorage && (
                        <span
                          title="Bundled with the site build, not uploaded to Storage"
                          className="text-[11px] text-starlight/40"
                        >
                          Bundled asset
                        </span>
                      )}
                    </div>

                    <Link to={item.ownerHref} className="truncate text-sm font-medium text-white hover:underline">
                      {item.ownerName}
                    </Link>
                    <p className="line-clamp-2 text-xs text-starlight/50">{item.alt || 'No alt text set'}</p>

                    <button
                      type="button"
                      onClick={() => setPendingDelete(item)}
                      className="mt-auto w-fit rounded-md border border-red-500/30 px-2.5 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      )}

      <AdminConfirmDialog
        open={pendingDelete !== null}
        title="Remove this image?"
        description={
          pendingDelete ? (
            <>
              This removes the image from{' '}
              <span className="text-white">{pendingDelete.ownerName}</span> and deletes the stored file. The{' '}
              {OWNER_LABELS[pendingDelete.ownerType].toLowerCase()} itself is not deleted.
            </>
          ) : null
        }
        confirmLabel="Remove Image"
        tone="destructive"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
