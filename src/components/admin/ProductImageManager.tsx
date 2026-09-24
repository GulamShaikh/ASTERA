import { useRef, useState } from 'react'
import {
  PRODUCT_IMAGES_BUCKET,
  addProductImage,
  deleteProductImage,
  listProductImages,
  reorderProductImages,
  updateProductImageAlt,
  uploadImage,
  validateImageFile,
} from '../../lib/api/admin'
import type { ProductImage } from '../../types/catalogue'
import { adminInputClasses } from './AdminFormField'

type ProductImageManagerProps = {
  productId: string
  productSlug: string
  images: ProductImage[]
  onChange: (images: ProductImage[]) => void
}

/**
 * Images are saved straight to Storage + product_images as you go, so this is
 * only rendered once a product exists (create saves the row first).
 * Order is the source of truth for which image is primary — index 0 wins.
 */
export function ProductImageManager({ productId, productSlug, images, onChange }: ProductImageManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    onChange(await listProductImages(productId))
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)
    setBusy(true)

    try {
      let nextSortOrder = images.length
      for (const file of Array.from(files)) {
        const invalid = validateImageFile(file)
        if (invalid) {
          setError(`${file.name}: ${invalid}`)
          continue
        }
        const url = await uploadImage(PRODUCT_IMAGES_BUCKET, productSlug, file)
        await addProductImage(productId, url, '', nextSortOrder)
        nextSortOrder += 1
      }
      await refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Upload failed.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= images.length) return

    const next = [...images]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)

    setBusy(true)
    setError(null)
    try {
      await reorderProductImages(next.map((image) => image.id))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save the new order.')
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  async function remove(image: ProductImage) {
    setBusy(true)
    setError(null)
    try {
      await deleteProductImage(image.id, image.url)
      const remaining = images.filter((candidate) => candidate.id !== image.id)
      await reorderProductImages(remaining.map((candidate) => candidate.id))
      await refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete this image.')
    } finally {
      setBusy(false)
    }
  }

  async function saveAlt(image: ProductImage, alt: string) {
    try {
      await updateProductImageAlt(image.id, alt)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save the alt text.')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          id="product-images-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
          multiple
          disabled={busy}
          onChange={(event) => handleFiles(event.target.files)}
          className="block w-full text-sm text-starlight/70 file:mr-3 file:rounded-lg file:border-0 file:bg-cosmic-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-cosmic-blue/90 disabled:opacity-50 sm:w-auto"
        />
        {busy && <span className="text-xs text-starlight/55">Working…</span>}
      </div>
      <p className="text-xs text-starlight/45">JPG, PNG, WebP, AVIF, or SVG. Up to 5 MB each. The first image is the one shown on cards.</p>

      {error && (
        <p role="alert" className="rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      {images.length === 0 ? (
        <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-6 text-center text-sm text-starlight/50">
          No images yet. The product will fall back to its category icon until one is added.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {images.map((image, index) => (
            <li
              key={image.id}
              className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3 sm:flex-row sm:items-center"
            >
              <img
                src={image.url}
                alt=""
                className="h-20 w-20 shrink-0 rounded-lg border border-white/10 object-cover"
              />

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-starlight/55">
                    {index === 0 ? 'Primary image' : `Image ${index + 1}`}
                  </span>
                </div>
                <label htmlFor={`alt-${image.id}`} className="sr-only">
                  Alt text for image {index + 1}
                </label>
                <input
                  id={`alt-${image.id}`}
                  defaultValue={image.alt}
                  placeholder="Alt text (describes the photo for screen readers)"
                  disabled={busy}
                  onBlur={(event) => saveAlt(image, event.target.value)}
                  className={adminInputClasses}
                />
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={busy || index === 0}
                  aria-label={`Move image ${index + 1} up`}
                  className="rounded-md border border-white/15 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/5 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={busy || index === images.length - 1}
                  aria-label={`Move image ${index + 1} down`}
                  className="rounded-md border border-white/15 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/5 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(image)}
                  disabled={busy}
                  className="rounded-md border border-red-500/30 px-2.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
