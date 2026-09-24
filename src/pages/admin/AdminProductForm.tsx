import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useAsyncData } from '../../hooks/useAsyncData'
import { useUnsavedChangesWarning } from '../../hooks/useUnsavedChangesWarning'
import {
  createProduct,
  getProductById,
  isProductSlugTaken,
  listAdminBrands,
  listAdminCategories,
  updateProduct,
} from '../../lib/api/admin'
import { slugify, isValidSlug } from '../../lib/slug'
import type { AdminProductInput } from '../../types/admin'
import type { ContentStatus, ProductImage, StockStatus } from '../../types/catalogue'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminFormField, adminInputClasses } from '../../components/admin/AdminFormField'
import { AdminErrorState, AdminLoadingState } from '../../components/admin/AdminStates'
import { SpecificationsEditor } from '../../components/admin/SpecificationsEditor'
import { objectToSpecRows, specRowsToObject, type SpecRow } from '../../lib/specifications'
import { ProductImageManager } from '../../components/admin/ProductImageManager'

const STOCK_OPTIONS: { value: StockStatus; label: string }[] = [
  { value: 'in_stock', label: 'In stock' },
  { value: 'out_of_stock', label: 'Out of stock' },
  { value: 'preorder', label: 'Pre-order' },
]

const STATUS_OPTIONS: { value: ContentStatus; label: string; hint: string }[] = [
  { value: 'draft', label: 'Draft', hint: 'Hidden from the public site' },
  { value: 'published', label: 'Published', hint: 'Live on the public site' },
  { value: 'archived', label: 'Archived', hint: 'Hidden, kept for reference' },
]

type FormState = {
  name: string
  slug: string
  brandId: string
  categoryId: string
  description: string
  compatibility: string
  price: string
  compareAtPrice: string
  sku: string
  stockStatus: StockStatus
  featured: boolean
  status: ContentStatus
  sortOrder: string
}

const EMPTY_FORM: FormState = {
  name: '',
  slug: '',
  brandId: '',
  categoryId: '',
  description: '',
  compatibility: '',
  price: '',
  compareAtPrice: '',
  sku: '',
  stockStatus: 'in_stock',
  featured: false,
  status: 'draft',
  sortOrder: '0',
}

type FieldErrors = Partial<Record<keyof FormState, string>>

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim()
  if (trimmed === '') return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

export function AdminProductForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  usePageTitle(isEdit ? 'Edit Product — ASTERA Admin' : 'New Product — ASTERA Admin')

  const categoriesState = useAsyncData(() => listAdminCategories(), [])
  const brandsState = useAsyncData(() => listAdminBrands(), [])
  const productState = useAsyncData(() => (id ? getProductById(id) : Promise.resolve(null)), [id])

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [specRows, setSpecRows] = useState<SpecRow[]>([])
  const [images, setImages] = useState<ProductImage[]>([])
  const [slugTouched, setSlugTouched] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedNotice, setSavedNotice] = useState<string | null>(null)

  // Hydrate once the existing product arrives.
  useEffect(() => {
    const product = productState.data
    if (!product) return
    // eslint-disable-next-line react/set-state-in-effect
    setForm({
      name: product.name,
      slug: product.slug,
      brandId: product.brandId ?? '',
      categoryId: product.categoryId ?? '',
      description: product.description,
      compatibility: product.compatibility ?? '',
      price: product.price === null ? '' : String(product.price),
      compareAtPrice: product.compareAtPrice === null ? '' : String(product.compareAtPrice),
      sku: product.sku ?? '',
      stockStatus: product.stockStatus,
      featured: product.featured,
      status: product.status,
      sortOrder: String(product.sortOrder),
    })
    setSpecRows(objectToSpecRows(product.specifications))
    setImages(product.images)
    setSlugTouched(true)
    setDirty(false)
  }, [productState.data])

  useUnsavedChangesWarning(dirty && !saving)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setDirty(true)
    setSavedNotice(null)
    setForm((current) => {
      const next = { ...current, [key]: value }
      // Keep the slug in step with the name until it's edited by hand.
      if (key === 'name' && !slugTouched) next.slug = slugify(String(value))
      return next
    })
  }

  const priceValue = useMemo(() => parseOptionalNumber(form.price), [form.price])
  const compareValue = useMemo(() => parseOptionalNumber(form.compareAtPrice), [form.compareAtPrice])

  async function validate(): Promise<FieldErrors> {
    const next: FieldErrors = {}

    if (form.name.trim() === '') next.name = 'Name is required.'
    if (form.slug.trim() === '') {
      next.slug = 'Slug is required.'
    } else if (!isValidSlug(form.slug.trim())) {
      next.slug = 'Use lowercase letters, numbers, and single hyphens.'
    } else if (await isProductSlugTaken(form.slug.trim(), id)) {
      next.slug = 'Another product already uses this slug.'
    }

    if (form.description.trim() === '') next.description = 'Description is required.'
    if (form.categoryId === '') next.categoryId = 'Choose a category.'

    if (Number.isNaN(priceValue)) next.price = 'Enter a number, or leave blank.'
    else if (priceValue !== null && priceValue < 0) next.price = 'Price cannot be negative.'

    if (Number.isNaN(compareValue)) next.compareAtPrice = 'Enter a number, or leave blank.'
    else if (compareValue !== null && compareValue < 0) next.compareAtPrice = 'Compare-at price cannot be negative.'
    else if (compareValue !== null && priceValue === null)
      next.compareAtPrice = 'Set a price before adding a compare-at price.'
    else if (compareValue !== null && priceValue !== null && compareValue <= priceValue)
      next.compareAtPrice = 'Compare-at price must be higher than the price to show a discount.'

    const sortOrder = Number(form.sortOrder)
    if (!Number.isInteger(sortOrder) || sortOrder < 0) next.sortOrder = 'Enter a whole number (0 or higher).'

    return next
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaveError(null)
    setSavedNotice(null)

    const found = await validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const input: AdminProductInput = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      brandId: form.brandId === '' ? null : form.brandId,
      categoryId: form.categoryId === '' ? null : form.categoryId,
      description: form.description.trim(),
      specifications: specRowsToObject(specRows),
      compatibility: form.compatibility.trim() === '' ? null : form.compatibility.trim(),
      price: priceValue,
      compareAtPrice: compareValue,
      sku: form.sku.trim() === '' ? null : form.sku.trim(),
      stockStatus: form.stockStatus,
      featured: form.featured,
      status: form.status,
      sortOrder: Number(form.sortOrder),
    }

    setSaving(true)
    try {
      if (isEdit && id) {
        await updateProduct(id, input)
        setDirty(false)
        setSavedNotice('Changes saved.')
        navigate('/admin/products')
      } else {
        const newId = await createProduct(input)
        setDirty(false)
        // Images need a product row to attach to, so creation lands on the edit page.
        navigate(`/admin/products/${newId}/edit`, { replace: true })
      }
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'Could not save this product.')
    } finally {
      setSaving(false)
    }
  }

  const loading = productState.loading || categoriesState.loading || brandsState.loading
  const loadError = productState.error || categoriesState.error || brandsState.error
  const notFound = isEdit && !productState.loading && !productState.error && !productState.data

  if (loading) return <AdminLoadingState label="Loading product" rows={6} />

  if (loadError) {
    return (
      <AdminErrorState
        onRetry={() => {
          productState.refetch()
          categoriesState.refetch()
          brandsState.refetch()
        }}
        description="Could not load this product form."
      />
    )
  }

  if (notFound) {
    return (
      <AdminErrorState
        title="Product not found"
        description="This product may have been removed. Return to the product list to continue."
      />
    )
  }

  return (
    <>
      <AdminPageHeader
        title={isEdit ? `Edit: ${form.name || 'Product'}` : 'New Product'}
        description={
          isEdit
            ? 'Changes go live on the public site as soon as the product is published.'
            : 'The product is saved first, then you can add images on the next step.'
        }
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Products', href: '/admin/products' },
          { label: isEdit ? 'Edit' : 'New' },
        ]}
        actions={
          <Link
            to="/admin/products"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
          >
            Back to Products
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <section className="flex flex-col gap-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-starlight/55">Basics</h2>

          <div className="grid gap-5 lg:grid-cols-2">
            <AdminFormField label="Product name" htmlFor="product-name" required error={errors.name}>
              <input
                id="product-name"
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                disabled={saving}
                className={adminInputClasses}
              />
            </AdminFormField>

            <AdminFormField
              label="Slug"
              htmlFor="product-slug"
              required
              error={errors.slug}
              hint="Used in the public URL: /product/your-slug"
            >
              <input
                id="product-slug"
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true)
                  update('slug', event.target.value)
                }}
                disabled={saving}
                className={adminInputClasses}
              />
            </AdminFormField>

            <AdminFormField label="Category" htmlFor="product-category" required error={errors.categoryId}>
              <select
                id="product-category"
                value={form.categoryId}
                onChange={(event) => update('categoryId', event.target.value)}
                disabled={saving}
                className={adminInputClasses}
              >
                <option value="" className="bg-space-black">
                  Select a category…
                </option>
                {(categoriesState.data ?? []).map((category) => (
                  <option key={category.id} value={category.id} className="bg-space-black">
                    {category.name}
                    {category.status !== 'published' ? ` (${category.status})` : ''}
                  </option>
                ))}
              </select>
            </AdminFormField>

            <AdminFormField label="Brand" htmlFor="product-brand" hint="Optional, but recommended.">
              <select
                id="product-brand"
                value={form.brandId}
                onChange={(event) => update('brandId', event.target.value)}
                disabled={saving}
                className={adminInputClasses}
              >
                <option value="" className="bg-space-black">
                  No brand
                </option>
                {(brandsState.data ?? []).map((brand) => (
                  <option key={brand.id} value={brand.id} className="bg-space-black">
                    {brand.name}
                    {brand.status !== 'published' ? ` (${brand.status})` : ''}
                  </option>
                ))}
              </select>
            </AdminFormField>
          </div>

          <AdminFormField label="Description" htmlFor="product-description" required error={errors.description}>
            <textarea
              id="product-description"
              rows={3}
              value={form.description}
              onChange={(event) => update('description', event.target.value)}
              disabled={saving}
              className={adminInputClasses}
            />
          </AdminFormField>
        </section>

        <section className="flex flex-col gap-5 border-t border-white/10 pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-starlight/55">Pricing &amp; Stock</h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <AdminFormField label="Price (₹)" htmlFor="product-price" error={errors.price} hint="Leave blank for “Price on enquiry”.">
              <input
                id="product-price"
                inputMode="decimal"
                value={form.price}
                onChange={(event) => update('price', event.target.value)}
                disabled={saving}
                className={adminInputClasses}
              />
            </AdminFormField>

            <AdminFormField
              label="Compare-at price (₹)"
              htmlFor="product-compare"
              error={errors.compareAtPrice}
              hint="Shown struck through."
            >
              <input
                id="product-compare"
                inputMode="decimal"
                value={form.compareAtPrice}
                onChange={(event) => update('compareAtPrice', event.target.value)}
                disabled={saving}
                className={adminInputClasses}
              />
            </AdminFormField>

            <AdminFormField label="SKU" htmlFor="product-sku" hint="Optional.">
              <input
                id="product-sku"
                value={form.sku}
                onChange={(event) => update('sku', event.target.value)}
                disabled={saving}
                className={adminInputClasses}
              />
            </AdminFormField>

            <AdminFormField label="Stock status" htmlFor="product-stock">
              <select
                id="product-stock"
                value={form.stockStatus}
                onChange={(event) => update('stockStatus', event.target.value as StockStatus)}
                disabled={saving}
                className={adminInputClasses}
              >
                {STOCK_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-space-black">
                    {option.label}
                  </option>
                ))}
              </select>
            </AdminFormField>
          </div>
        </section>

        <section className="flex flex-col gap-5 border-t border-white/10 pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-starlight/55">Details</h2>

          <AdminFormField label="Specifications" htmlFor="product-specs">
            <SpecificationsEditor
              rows={specRows}
              disabled={saving}
              onChange={(rows) => {
                setSpecRows(rows)
                setDirty(true)
              }}
            />
          </AdminFormField>

          <AdminFormField
            label="Compatibility"
            htmlFor="product-compatibility"
            hint="Free text, e.g. which devices or ports this fits."
          >
            <textarea
              id="product-compatibility"
              rows={2}
              value={form.compatibility}
              onChange={(event) => update('compatibility', event.target.value)}
              disabled={saving}
              className={adminInputClasses}
            />
          </AdminFormField>
        </section>

        <section className="flex flex-col gap-5 border-t border-white/10 pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-starlight/55">Visibility</h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AdminFormField
              label="Status"
              htmlFor="product-status"
              hint={STATUS_OPTIONS.find((option) => option.value === form.status)?.hint}
            >
              <select
                id="product-status"
                value={form.status}
                onChange={(event) => update('status', event.target.value as ContentStatus)}
                disabled={saving}
                className={adminInputClasses}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-space-black">
                    {option.label}
                  </option>
                ))}
              </select>
            </AdminFormField>

            <AdminFormField
              label="Sort order"
              htmlFor="product-sort"
              error={errors.sortOrder}
              hint="Lower numbers appear first."
            >
              <input
                id="product-sort"
                inputMode="numeric"
                value={form.sortOrder}
                onChange={(event) => update('sortOrder', event.target.value)}
                disabled={saving}
                className={adminInputClasses}
              />
            </AdminFormField>

            <div className="flex items-end">
              <label className="flex items-center gap-2.5 text-sm text-starlight/85">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => update('featured', event.target.checked)}
                  disabled={saving}
                  className="h-4 w-4 rounded border-white/25 bg-white/5 text-cosmic-blue focus:ring-cosmic-blue/40"
                />
                Feature this product
              </label>
            </div>
          </div>
        </section>

        {saveError && (
          <p role="alert" className="rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-sm text-red-200">
            {saveError}
          </p>
        )}
        {savedNotice && (
          <p role="status" className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.08] px-3 py-2 text-sm text-emerald-200">
            {savedNotice}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-cosmic-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-cosmic-blue/90 disabled:opacity-60"
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
          <Link
            to="/admin/products"
            className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
          >
            Cancel
          </Link>
          {dirty && <span className="text-xs text-starlight/50">Unsaved changes</span>}
        </div>
      </form>

      <section className="flex flex-col gap-5 border-t border-white/10 pt-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-starlight/55">Images</h2>
          <p className="text-xs text-starlight/45">
            {isEdit
              ? 'Image changes save immediately — they don’t need the Save button.'
              : 'Images attach to a saved product, so this unlocks once the product is created.'}
          </p>
        </div>

        {isEdit && id ? (
          <ProductImageManager productId={id} productSlug={form.slug} images={images} onChange={setImages} />
        ) : (
          <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.02] px-4 py-8 text-center">
            <p className="text-sm text-starlight/60">
              Click <span className="font-semibold text-white">Create Product</span> above — you&apos;ll land on the
              edit page with the image uploader ready.
            </p>
            <p className="mt-1.5 text-xs text-starlight/40">
              Until then the product shows its category icon as a placeholder.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
