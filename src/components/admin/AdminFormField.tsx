import type { ReactNode } from 'react'

export const adminInputClasses =
  'w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-starlight/35 focus:border-cosmic-blue focus:outline-none focus:ring-2 focus:ring-cosmic-blue/30 disabled:opacity-50'

type AdminFormFieldProps = {
  label: string
  htmlFor: string
  children: ReactNode
  hint?: string
  error?: string | null
  required?: boolean
  className?: string
}

export function AdminFormField({
  label,
  htmlFor,
  children,
  hint,
  error,
  required = false,
  className = '',
}: AdminFormFieldProps) {
  const describedBy = [hint ? `${htmlFor}-hint` : null, error ? `${htmlFor}-error` : null].filter(Boolean).join(' ')

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-starlight/85">
        {label}
        {required && (
          <span className="ml-1 text-red-300" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {/* describedBy is applied by the caller's input via aria-describedby={...} where needed */}
      <div data-described-by={describedBy || undefined}>{children}</div>

      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-xs text-starlight/50">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}
