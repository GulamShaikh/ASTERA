import type { ReactNode } from 'react'

export type AdminColumn<T> = {
  key: string
  header: string
  render: (row: T) => ReactNode
  /** Hidden below lg — use for secondary columns so narrow screens stay readable. */
  secondary?: boolean
  align?: 'left' | 'right'
}

type AdminTableProps<T> = {
  columns: AdminColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  caption?: string
}

export function AdminTable<T>({ columns, rows, rowKey, caption }: AdminTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[720px] border-collapse text-left">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-starlight/55 ${
                  column.align === 'right' ? 'text-right' : ''
                } ${column.secondary ? 'hidden lg:table-cell' : ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-4 py-3 align-middle text-sm text-starlight/80 ${
                    column.align === 'right' ? 'text-right' : ''
                  } ${column.secondary ? 'hidden lg:table-cell' : ''}`}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
