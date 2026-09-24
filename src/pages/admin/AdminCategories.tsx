import { useMemo, useState } from 'react'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useAsyncData } from '../../hooks/useAsyncData'
import {
  CATEGORY_IMAGES_BUCKET,
  archiveCategory,
  countProductsInCategory,
  createCategory,
  isCategorySlugTaken,
  listAdminCategories,
  updateCategory,
  updateCategoryStatus,
} from '../../lib/api/admin'
import { isValidSlug, slugify } from '../../lib/slug'
import { ICON_KEY_OPTIONS, resolveIcon } from '../../lib/iconKeys'
import type { AdminCategory, AdminCategoryInput } from '../../types/admin'
import type { ContentStatus } from '../../types/catalogue'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminTable, type AdminColumn } from '../../components/admin/AdminTable'
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from '../../components/admin/AdminStates'
import { AdminStatusBadge } from '../../components/admin/AdminStatusBadge'
import { AdminConfirmDialog } from '../../components/admin/AdminConfirmDialog'
import { AdminFormDialog } from '../../components/admin/AdminFormDialog'
import { AdminFormField, adminInputClasses } from '../../components/admin/AdminFormField'
import { SingleImageField } from '../../components/admin/SingleImageField'

type FormState = {
  name: string
  slug: string
  description: string
  iconKey: string
  imageUrl: string | null
  status: ContentStatus
  sortOrder: string
}

const EMPTY_FORM: FormState = {
  name: '',
  slug: '',
  description: '',
  iconKey: 'bolt',
  imageUrl: null,
  status: 'draft',
  sortOrder: '0',
}

export function AdminCategories() {
  usePageTitle('Categories — ASTERA Admin')
  const { data: categories, loading, error, refetch } = useAsyncData(() => listAdminCategories(), [])

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all')

  const [editing, setEditing] = useState<AdminCategory | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [slugTouched, setSlugTouched] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [pendingArchive, setPendingArchive] = useState<{ category: AdminCategory; published: number; total: number } | null>(
    null,
  )
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const visible = useMemo(() => {
    if (!categories) return null
    const needle = query.trim().toLowerCase()
    return categories.filter((category) => {
      const matchesQuery =
        needle === '' || [category.name, category.slug, category.description].some((f) => f.toLowerCase().includes(needle))
      return matchesQuery && (statusFilter === 'all' || category.status === statusFilter)
    })
  }, [categories, query, statusFilter])

  function openCreate() {
    setForm({ ...EMPTY_FORM, sortOrder: String(categories?.length ?? 0) })
    setSlugTouched(false)
    setFormError(null)
    setEditing(null)
    setCreating(true)
  }

  function openEdit(category: AdminCategory) {
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      iconKey: category.iconKey,
      imageUrl: category.imageUrl,
      status: category.status,
      sortOrder: String(category.sortOrder),
    })
    setSlugTouched(true)
    setFormError(null)
    setCreating(false)
    setEditing(category)
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
      if (await isCategorySlugTaken(slug, editing?.id)) {
        setFormError('Another category already uses this slug.')
        return
      }

      const input: AdminCategoryInput = {
        name,
        slug,
        description: form.description.trim(),
        iconKey: form.iconKey,
        imageUrl: form.imageUrl,
        status: form.status,
        sortOrder,
      }

      if (editing) await updateCategory(editing.id, input)
      else await createCategory(input)

      closeForm()
      refetch()
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : 'Could not save this category.')
    } finally {
      setSaving(false)
    }
  }

  async function changeStatus(category: AdminCategory, status: ContentStatus) {
    setBusyId(category.id)
    setActionError(null)
    try {
      await updateCategoryStatus(category.id, status)
      refetch()
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Could not update this category.')
    } finally {
      setBusyId(null)
    }
  }

  /** Counts referencing products first so the confirmation can say what breaks. */
  async function requestArchive(category: AdminCategory) {
    setBusyId(category.id)
    setActionError(null)
    try {
      const counts = await countProductsInCategory(category.id)
      setPendingArchive({ category, ...counts })
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Could not check this category.')
    } finally {
      setBusyId(null)
    }
  }

  async function confirmArchive() {
    if (!pendingArchive) return
    setBusyId(pendingArchive.category.id)
    try {
      await archiveCategory(pendingArchive.category.id)
      setPendingArchive(null)
      refetch()
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Could not archive this category.')
    } finally {
      setBusyId(null)
    }
  }

  const columns: AdminColumn<AdminCategory>[] = [
    {
      key: 'category',
      header: 'Category',
      render: (category) => {
        const Icon = resolveIcon(category.iconKey)
        return (
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cosmic-blue/15 text-cosmic-blue">
              <Icon className="h-4 w-4" />
            </span>
            <div className="flex min-w-0 flex-col">
              <button
                type="button"
                onClick={() => openEdit(category)}
                className="truncate text-left font-medium text-white hover:underline"
              >
                {category.name}
              </button>
              <span className="truncate text-xs text-starlight/45">/{category.slug}</span>
            </div>
          </div>
        )
      },
    },
    {
      key: 'description',
      header: 'Description',
      secondary: true,
      render: (category) => <span className="line-clamp-2 text-starlight/60">{category.description || '—'}</span>,
    },
    { key: 'order', header: 'Order', align: 'right', secondary: true, render: (c) => c.sortOrder },
    { key: 'status', header: 'Status', render: (c) => <AdminStatusBadge status={c.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (category) => {
        const busy = busyId === category.id
        return (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => openEdit(category)}
              className="rounded-md border border-white/15 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/5"
            >
              Edit
            </button>
            {category.status !== 'published' && (
              <button
                type="button"
                disabled={busy}
                onClick={() => changeStatus(category, 'published')}
                className="rounded-md border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50"
              >
                Publish
              </button>
            )}
            {category.status !== 'draft' && (
              <button
                type="button"
                disabled={busy}
                onClick={() => changeStatus(category, 'draft')}
                className="rounded-md border border-amber-500/30 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/10 disabled:opacity-50"
              >
                To Draft
              </button>
            )}
            {category.status !== 'archived' && (
              <button
                type="button"
                disabled={busy}
                onClick={() => requestArchive(category)}
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

  const formOpen = creating || editing !== null

  return (
    <>
      <AdminPageHeader
        title="Categories"
        description="Categories group the catalogue on the public site. Icons come from a fixed ASTERA set."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Categories' }]}
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-cosmic-blue px-4 py-2 text-sm font-semibold text-white hover:bg-cosmic-blue/90"
          >
            Add Category
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor="category-search" className="sr-only">
            Search categories
          </label>
          <input
            id="category-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search categories…"
            className={adminInputClasses}
          />
        </div>
        <div>
          <label htmlFor="category-status" className="sr-only">
            Filter by status
          </label>
          <select
            id="category-status"
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
        <AdminLoadingState label="Loading categories" />
      ) : error ? (
        <AdminErrorState onRetry={refetch} description="Could not load categories." />
      ) : !visible || visible.length === 0 ? (
        <AdminEmptyState
          title="No categories found"
          description={query || statusFilter !== 'all' ? 'Try a different search or filter.' : 'Add your first category.'}
        />
      ) : (
        <AdminTable columns={columns} rows={visible} rowKey={(category) => category.id} caption="Catalogue categories" />
      )}

      <AdminFormDialog
        open={formOpen}
        title={editing ? `Edit ${editing.name}` : 'New Category'}
        description="Published categories appear on the public site immediately."
        submitLabel={editing ? 'Save Category' : 'Create Category'}
        busy={saving}
        error={formError}
        onSubmit={submitForm}
        onCancel={closeForm}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminFormField label="Name" htmlFor="category-name" required>
            <input
              id="category-name"
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              disabled={saving}
              className={adminInputClasses}
            />
          </AdminFormField>

          <AdminFormField label="Slug" htmlFor="category-slug" required hint="URL: /categories/your-slug">
            <input
              id="category-slug"
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

        <AdminFormField label="Description" htmlFor="category-description">
          <textarea
            id="category-description"
            rows={2}
            value={form.description}
            onChange={(event) => update('description', event.target.value)}
            disabled={saving}
            className={adminInputClasses}
          />
        </AdminFormField>

        <div className="grid gap-5 sm:grid-cols-3">
          <AdminFormField label="Icon" htmlFor="category-icon" hint="From the fixed ASTERA icon set.">
            <select
              id="category-icon"
              value={form.iconKey}
              onChange={(event) => update('iconKey', event.target.value)}
              disabled={saving}
              className={adminInputClasses}
            >
              {ICON_KEY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-space-black">
                  {option.label}
                </option>
              ))}
            </select>
          </AdminFormField>

          <AdminFormField label="Status" htmlFor="category-form-status">
            <select
              id="category-form-status"
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

          <AdminFormField label="Sort order" htmlFor="category-sort" hint="Lower first.">
            <input
              id="category-sort"
              inputMode="numeric"
              value={form.sortOrder}
              onChange={(event) => update('sortOrder', event.target.value)}
              disabled={saving}
              className={adminInputClasses}
            />
          </AdminFormField>
        </div>

        <AdminFormField label="Category image" htmlFor="category-image" hint="Optional. The icon is used where no image exists.">
          <SingleImageField
            bucket={CATEGORY_IMAGES_BUCKET}
            folder={form.slug || 'unsorted'}
            value={form.imageUrl}
            onChange={(url) => update('imageUrl', url)}
            label="Category image"
            disabled={saving}
          />
        </AdminFormField>
      </AdminFormDialog>

      <AdminConfirmDialog
        open={pendingArchive !== null}
        title="Archive this category?"
        description={
          pendingArchive ? (
            <>
              <span className="text-white">{pendingArchive.category.name}</span> will be hidden from the public site.
              {pendingArchive.published > 0 ? (
                <>
                  {' '}
                  <span className="text-amber-300">
                    {pendingArchive.published} published product
                    {pendingArchive.published === 1 ? '' : 's'} still use{pendingArchive.published === 1 ? 's' : ''} it
                  </span>{' '}
                  — those products stay live, but their category link will point at a hidden page. Reassign them first if
                  that matters.
                </>
              ) : pendingArchive.total > 0 ? (
                <> {pendingArchive.total} unpublished product(s) reference it. Nothing public will break.</>
              ) : (
                ' No products reference it.'
              )}
            </>
          ) : null
        }
        confirmLabel="Archive Category"
        tone="destructive"
        busy={busyId === pendingArchive?.category.id}
        onConfirm={confirmArchive}
        onCancel={() => setPendingArchive(null)}
      />
    </>
  )
}
