import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

type AdminFormDialogProps = {
  open: boolean
  title: string
  description?: string
  submitLabel: string
  busy?: boolean
  error?: string | null
  onSubmit: () => void
  onCancel: () => void
  children: ReactNode
}

/** Modal shell for the category/brand create+edit forms, which live on their list pages. */
export function AdminFormDialog({
  open,
  title,
  description,
  submitLabel,
  busy = false,
  error,
  onSubmit,
  onCancel,
  children,
}: AdminFormDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>('input, select, textarea')?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !busy) onCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, busy, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 py-10">
      <div className="fixed inset-0 bg-space-black/80" onClick={busy ? undefined : onCancel} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-dialog-title"
        className="relative w-full max-w-2xl rounded-xl border border-white/15 bg-midnight p-6 shadow-2xl"
      >
        <div className="flex flex-col gap-1">
          <h2 id="form-dialog-title" className="font-heading text-lg font-semibold text-white">
            {title}
          </h2>
          {description && <p className="text-sm text-starlight/60">{description}</p>}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
          className="mt-6 flex flex-col gap-5"
        >
          {children}

          {error && (
            <p role="alert" className="rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-cosmic-blue px-4 py-2 text-sm font-semibold text-white hover:bg-cosmic-blue/90 disabled:opacity-60"
            >
              {busy ? 'Saving…' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
