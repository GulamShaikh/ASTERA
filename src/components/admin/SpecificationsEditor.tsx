import { adminInputClasses } from './AdminFormField'
import type { SpecRow } from '../../lib/specifications'

type SpecificationsEditorProps = {
  rows: SpecRow[]
  onChange: (rows: SpecRow[]) => void
  disabled?: boolean
}

/**
 * Flat label/value pairs, matching the `specifications` jsonb column. Blank
 * labels are dropped on save, so an empty row is just an unused slot.
 */
export function SpecificationsEditor({ rows, onChange, disabled = false }: SpecificationsEditorProps) {
  function update(id: string, patch: Partial<SpecRow>) {
    onChange(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  }

  function addRow() {
    onChange([...rows, { id: `spec-${crypto.randomUUID()}`, label: '', value: '' }])
  }

  function removeRow(id: string) {
    onChange(rows.filter((row) => row.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.length === 0 && (
        <p className="text-sm text-starlight/45">
          No specifications yet. Add rows like “Output” / “65 W” — they appear as a table on the product page.
        </p>
      )}

      {rows.map((row, index) => (
        <div key={row.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor={`spec-label-${row.id}`}>
            Specification {index + 1} label
          </label>
          <input
            id={`spec-label-${row.id}`}
            value={row.label}
            onChange={(event) => update(row.id, { label: event.target.value })}
            placeholder="Label (e.g. Output)"
            disabled={disabled}
            className={`${adminInputClasses} sm:w-1/3`}
          />

          <label className="sr-only" htmlFor={`spec-value-${row.id}`}>
            Specification {index + 1} value
          </label>
          <input
            id={`spec-value-${row.id}`}
            value={row.value}
            onChange={(event) => update(row.id, { value: event.target.value })}
            placeholder="Value (e.g. 65 W)"
            disabled={disabled}
            className={adminInputClasses}
          />

          <button
            type="button"
            onClick={() => removeRow(row.id)}
            disabled={disabled}
            className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-starlight/70 hover:bg-white/5 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        disabled={disabled}
        className="w-fit rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-50"
      >
        Add specification
      </button>
    </div>
  )
}
