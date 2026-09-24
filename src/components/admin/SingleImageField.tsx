import { useRef, useState } from 'react'
import { removeStorageObject, uploadImage, validateImageFile } from '../../lib/api/admin'

type SingleImageFieldProps = {
  bucket: string
  folder: string
  value: string | null
  onChange: (url: string | null) => void
  label: string
  disabled?: boolean
}

/** One optional image (brand logo / category image), uploaded straight to Storage. */
export function SingleImageField({
  bucket,
  folder,
  value,
  onChange,
  label,
  disabled = false,
}: SingleImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    const invalid = validateImageFile(file)
    if (invalid) {
      setError(invalid)
      return
    }

    setError(null)
    setBusy(true)
    try {
      const previous = value
      const url = await uploadImage(bucket, folder, file)
      onChange(url)
      // Replacing an image shouldn't leave the old file behind.
      if (previous) await removeStorageObject(bucket, previous)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Upload failed.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function clear() {
    setBusy(true)
    setError(null)
    try {
      if (value) await removeStorageObject(bucket, value)
      onChange(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
          {value ? (
            <img src={value} alt={label} className="h-full w-full object-contain p-1.5" />
          ) : (
            <span className="text-[10px] text-starlight/35">None</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
            disabled={disabled || busy}
            onChange={(event) => handleFile(event.target.files?.[0])}
            aria-label={label}
            className="block text-sm text-starlight/70 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/15 disabled:opacity-50"
          />
          {value && (
            <button
              type="button"
              onClick={clear}
              disabled={disabled || busy}
              className="w-fit text-xs font-semibold text-red-300 hover:underline disabled:opacity-50"
            >
              Remove image
            </button>
          )}
        </div>
      </div>

      {busy && <span className="text-xs text-starlight/55">Uploading…</span>}
      {error && (
        <p role="alert" className="text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}
