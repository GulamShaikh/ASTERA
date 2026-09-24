import { useMemo, useState } from 'react'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useAsyncData } from '../../hooks/useAsyncData'
import {
  BRAND_LOGOS_BUCKET,
  archiveBrand,
  countProductsForBrand,
  createBrand,
  isBrandSlugTaken,
  listAdminBrands,
  updateBrand,
  updateBrandStatus,
} from '../../lib/api/admin'
import { isValidSlug, slugify } from '../../lib/slug'
import type { AdminBrand, AdminBrandInput } from '../../types/admin'
import type { ContentStatus } from '../../types/catalogue'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminTable, type AdminColumn } from '../../components/admin/AdminTable'
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from '../../components/admin/AdminStates'
import { AdminStatusBadge } from '../../components/admin/AdminStatusBadge'
import { AdminConfirmDialog } from '../../components/admin/AdminConfirmDialog'
import { AdminFormDialog } from '../../components/admin/AdminFormDialog'
import { AdminFormField, adminInputClasses } from '../../components/admin/AdminFormField'
import { SingleImageField } from '../../components/admin/SingleImageField'
import { BrandMonogram } from '../../components/brand/BrandCard'

type FormState = {
  name: string
  slug: string
  category: string
  description: string
  logoUrl: string | null
  status: ContentStatus
  featured: boolean
  local: boolean
  sortOrder: string
}

const EMPTY_FORM: FormState = {
  name: '',
  slug: '',
  category: '',
  description: '',
  logoUrl: null,
  status: 'draft',
  featured: false,
  local: false,
  sortOrder: '0',
}

export function AdminBrands() {
  usePageTitle('Brands — ASTERA Admin')
  const { data: brands, loading, error, refetch } = useAsyncData(() => listAdminBrands(), [])

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all')

  const [editing, setEditing] = useState<AdminBrand | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [slugTouched, setSlugTouched] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [pendingArchive, setPendingArchive] = useState<{ brand: AdminBrand; published: number; total: number } | null>(
    null,
  )
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const visible = useMemo(() => {
    if (!brands) return null
    const needle = query.trim().toLowerCase()
    return brands.filter((brand) => {
      const matchesQuery =
        needle === '' ||
        [brand.name, brand.slug, brand.category, brand.description].some((f) => f.toLowerCase().includes(needle))
      return matchesQuery && (statusFilter === 'all' || brand.status === statusFilter)
    })
  }, [brands, query, statusFilter])

  function openCreate() {
    setForm({ ...EMPTY_FORM, sortOrder: String(brands?.length ?? 0) })
    setSlugTouched(false)
    setFormError(null)
    setEditing(null)
    setCreating(true)
  }

  function openEdit(brand: AdminBrand) {
    setForm({
      name: brand.name,
      slug: brand.slug,
      category: brand.category,
      description: brand.description,
      logoUrl: brand.logoUrl,
      status: brand.status,
      featured: brand.featured,
      local: brand.local,
      sortOrder: String(brand.sortOrder),
    })
    setSlugTouched(true)
    setFormError(null)
    setCreating(false)
    setEditing(brand)
  }

  function closeForm() {
    setCreating(false)
    setEditing(null)
    setFormError(null)
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value }
      if (key === 'name' && !slugTouched) next.slug = slugify(String(value))
      return next
    })
  }

  async function submitForm() {
    setFormError(null)

    const name = form.name.trim()
    const slug = form.slug.trim()
    const sortOrder = Number(form.sortOrder)

    if (name === '') return setFormError('Name is required.')
    if (!isValidSlug(slug)) return setFormError('Slug must be lowercase letters, numbers, and single hyphens.')
    if (!Number.isInteger(sortOrder) || sortOrder < 0) return setFormError('Sort order must be a whole number.')

    setSaving(true)
    try {
      if (await isBrandSlugTaken(slug, editing?.id)) {
        setFormError('Another brand already uses this slug.')
        return
      }

      const input: AdminBrandInput = {
        name,
        slug,
        category: form.category.trim(),
        description: form.description.trim(),
        logoUrl: form.logoUrl,
        status: form.status,
        featured: form.featured,
        local: form.local,
        sortOrder,
      }

      if (editing) await updateBrand(editing.id, input)
      else await createBrand(input)

      closeForm()
      refetch()
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : 'Could not save this brand.')
    } finally {
      setSaving(false)
    }
  }

  async function changeStatus(brand: AdminBrand, status: ContentStatus) {
    setBusyId(brand.id)
    setActionError(null)
    try {
      await updateBrandStatus(brand.id, status)
      refetch()
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Could not update this brand.')
    } finally {
      setBusyId(null)
    }
  }

  async function requestArchive(brand: AdminBrand) {
    setBusyId(brand.id)
    setActionError(null)
    try {
      const counts = await countProductsForBrand(brand.id)
      setPendingArchive({ brand, ...counts })
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Could not check this brand.')
    } finally {
      setBusyId(null)
    }
  }

  async function confirmArchive() {
    if (!pendingArchive) return
    setBusyId(pendingArchive.brand.id)
    try {
      await archiveBrand(pendingArchive.brand.id)
      setPendingArchive(null)
      refetch()
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Could not archive this brand.')
    } finally {
      setBusyId(null)
    }
  }

  const columns: AdminColumn<AdminBrand>[] = [
    {
      key: 'brand',
      header: 'Brand',
      render: (brand) => (
        <div className="flex items-center gap-3">
          {brand.logoUrl ? (
            <img
              src={brand.logoUrl}
              alt=""
              className="h-9 w-9 shrink-0 rounded-lg border border-white/10 object-contain p-1"
            />
          ) : (
            <BrandMonogram name={brand.name} className="h-9 w-9 shrink-0 text-xs" />
          )}
          <div className="flex min-w-0 flex-col">
            <button
              type="button"
              onClick={() => openEdit(brand)}
              className="truncate text-left font-medium text-white hover:underline"
            >
              {brand.name}
            </button>
            <span className="truncate text-xs text-starlight/45">/{brand.slug}</span>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Focus', secondary: true, render: (b) => b.category || '—' },
    {
      key: 'flags',
      header: 'Flags',
      secondary: true,
      render: (brand) => (
        <span className="text-xs text-starlight/60">
          {[brand.featured ? 'Featured' : null, brand.local ? 'Local' : null].filter(Boolean).join(' · ') || '—'}
        </span>
      ),
    },
    { key: 'order', header: 'Order', align: 'right', secondary: true, render: (b) => b.sortOrder },
    { key: 'status', header: 'Status', render: (b) => <AdminStatusBadge status={b.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (brand) => {
        const busy = busyId === brand.id
        return (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => openEdit(brand)}
              className="rounded-md border border-white/15 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/5"
            >
              Edit
            </button>
            {brand.status !== 'published' && (
              <button
                type="button"
                disabled={busy}
                onClick={() => changeStatus(brand, 'published')}
                className="rounded-md border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50"
              >
                Publish
              </button>
            )}
            {brand.status !== 'draft' && (
              <button
                type="button"
                disabled={busy}
                onClick={() => changeStatus(brand, 'draft')}
                className="rounded-md border border-amber-500/30 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/10 disabled:opacity-50"
              >
                To Draft
              </button>
            )}
            {brand.status !== 'archived' && (
              <button
                type="button"
                disabled={busy}
                onClick={() => requestArchive(brand)}
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
        title="Brands"
        description="The emerging and independent makers ASTERA curates. Published brands appear on the public site."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Brands' }]}
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-cosmic-blue px-4 py-2 text-sm font-semibold text-white hover:bg-cosmic-blue/90"
          >
            Add Brand
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor="brand-search" className="sr-only">
            Search brands
          </label>
          <input
            id="brand-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search brands…"
            className={adminInputClasses}
          />
        </div>
        <div>
          <label htmlFor="brand-status" className="sr-only">
            Filter by status
          </label>
          <select
            id="brand-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as ContentStatus | 'all')}
            className={adminInputClasses}
          >
            <option value="all" className="bg-space-black">All statuses</option>
            <option value="published" className="bg-space-black">Published</option>
            <option value="draft" className="bg-space-black">Draft</option>
            <option value="archived" className="bg-space-black">Archived</option>
          </select>
        </div>
      </div>

      {actionError && (
        <p role="alert" className="rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-sm text-red-200">
          {actionError}
        </p>
      )}

      {loading ? (
        <AdminLoadingState label="Loading brands" />
      ) : error ? (
        <AdminErrorState onRetry={refetch} description="Could not load brands." />
      ) : !visible || visible.length === 0 ? (
        <AdminEmptyState
          title="No brands found"
          description={query || statusFilter !== 'all' ? 'Try a different search or filter.' : 'Add your first brand.'}
        />
      ) : (
        <AdminTable columns={columns} rows={visible} rowKey={(brand) => brand.id} caption="Catalogue brands" />
      )}

      <AdminFormDialog
        open={creating || editing !== null}
        title={editing ? `Edit ${editing.name}` : 'New Brand'}
        description="Published brands appear on the public site immediately."
        submitLabel={editing ? 'Save Brand' : 'Create Brand'}
        busy={saving}
        error={formError}
        onSubmit={submitForm}
        onCancel={closeForm}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminFormField label="Name" htmlFor="brand-name" required>
            <input
              id="brand-name"
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              disabled={saving}
              className={adminInputClasses}
            />
          </AdminFormField>

          <AdminFormField label="Slug" htmlFor="brand-slug" required hint="URL: /brands/your-slug">
            <input
              id="brand-slug"
              value={form.slug}
              onChange={(event) => {
                setSlugTouched(true)
                update('slug', event.target.value)
              }}
              disabled={saving}
              className={adminInputClasses}
            />
          </AdminFormField>
        </div>

        <AdminFormField label="Focus" htmlFor="brand-category" hint="Short descriptor, e.g. “Audio & Sound”.">
          <input
            id="brand-category"
            value={form.category}
            onChange={(event) => update('category', event.target.value)}
            disabled={saving}
            className={adminInputClasses}
          />
        </AdminFormField>

        <AdminFormField label="Description" htmlFor="brand-description">
          <textarea
            id="brand-description"
            rows={3}
            value={form.description}
            onChange={(event) => update('description', event.target.value)}
            disabled={saving}
            className={adminInputClasses}
          />
        </AdminFormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <AdminFormField label="Status" htmlFor="brand-form-status">
            <select
              id="brand-form-status"
              value={form.status}
              onChange={(event) => update('status', event.target.value as ContentStatus)}
              disabled={saving}
              className={adminInputClasses}
            >
              <option value="draft" className="bg-space-black">Draft</option>
              <option value="published" className="bg-space-black">Published</option>
              <option value="archived" className="bg-space-black">Archived</option>
            </select>
          </AdminFormField>

          <AdminFormField label="Sort order" htmlFor="brand-sort" hint="Lower first.">
            <input
              id="brand-sort"
              inputMode="numeric"
              value={form.sortOrder}
              onChange={(event) => update('sortOrder', event.target.value)}
              disabled={saving}
              className={adminInputClasses}
            />
          </AdminFormField>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2.5 text-sm text-starlight/85">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => update('featured', event.target.checked)}
              disabled={saving}
              className="h-4 w-4 rounded border-white/25 bg-white/5 text-cosmic-blue focus:ring-cosmic-blue/40"
            />
            Featured brand
          </label>
          <label className="flex items-center gap-2.5 text-sm text-starlight/85">
            <input
              type="checkbox"
              checked={form.local}
              onChange={(event) => update('local', event.target.checked)}
              disabled={saving}
              className="h-4 w-4 rounded border-white/25 bg-white/5 text-cosmic-blue focus:ring-cosmic-blue/40"
            />
            Local brand
          </label>
        </div>

        <AdminFormField label="Logo" htmlFor="brand-logo" hint="Optional. Initials are shown where no logo exists.">
          <SingleImageField
            bucket={BRAND_LOGOS_BUCKET}
            folder={form.slug || 'unsorted'}
            value={form.logoUrl}
            onChange={(url) => update('logoUrl', url)}
            label="Brand logo"
            disabled={saving}
          />
        </AdminFormField>
      </AdminFormDialog>

      <AdminConfirmDialog
        open={pendingArchive !== null}
        title="Archive this brand?"
        description={
          pendingArchive ? (
            <>
              <span className="text-white">{pendingArchive.brand.name}</span> will be hidden from the public site.
              {pendingArchive.published > 0 ? (
                <>
                  {' '}
                  <span className="text-amber-300">
                    {pendingArchive.published} published product
                    {pendingArchive.published === 1 ? '' : 's'} still reference
                    {pendingArchive.published === 1 ? 's' : ''} it
                  </span>{' '}
                  — those products stay live, but their brand link will point at a hidden page.
                </>
              ) : pendingArchive.total > 0 ? (
                <> {pendingArchive.total} unpublished product(s) reference it. Nothing public will break.</>
              ) : (
                ' No products reference it.'
              )}
            </>
          ) : null
        }
        confirmLabel="Archive Brand"
        tone="destructive"
        busy={busyId === pendingArchive?.brand.id}
        onConfirm={confirmArchive}
        onCancel={() => setPendingArchive(null)}
      />
    </>
  )
}
