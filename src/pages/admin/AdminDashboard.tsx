import { Link } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useAsyncData } from '../../hooks/useAsyncData'
import { fetchCatalogueCounts } from '../../lib/api/admin'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminErrorState, AdminLoadingState } from '../../components/admin/AdminStates'

const QUICK_ACTIONS = [
  { label: 'Add Product', href: '/admin/products/new', primary: true },
  { label: 'Manage Products', href: '/admin/products', primary: false },
  { label: 'Manage Categories', href: '/admin/categories', primary: false },
  { label: 'Manage Brands', href: '/admin/brands', primary: false },
]

function StatCard({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <span className="text-xs font-semibold uppercase tracking-wide text-starlight/50">{label}</span>
      <span className="font-heading text-3xl font-semibold text-white">{value}</span>
      {hint && <span className="text-xs text-starlight/45">{hint}</span>}
    </div>
  )
}

export function AdminDashboard() {
  usePageTitle('Dashboard — ASTERA Admin')
  const { data: counts, loading, error, refetch } = useAsyncData(() => fetchCatalogueCounts(), [])

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Everything published here appears on the public ASTERA site immediately."
        actions={QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            to={action.href}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              action.primary
                ? 'bg-cosmic-blue text-white hover:bg-cosmic-blue/90'
                : 'border border-white/20 text-white hover:bg-white/5'
            }`}
          >
            {action.label}
          </Link>
        ))}
      />

      {loading ? (
        <AdminLoadingState label="Loading catalogue counts" rows={3} />
      ) : error ? (
        <AdminErrorState onRetry={refetch} description="Could not load catalogue counts." />
      ) : (
        counts && (
          <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-starlight/55">Products</h2>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard label="Published" value={counts.productsPublished} hint="Live on the public site" />
                <StatCard label="Draft" value={counts.productsDraft} hint="Hidden from the public site" />
                <StatCard label="Archived" value={counts.productsArchived} hint="Hidden, kept for reference" />
                <StatCard label="Featured" value={counts.productsFeatured} hint="Highlighted on the homepage" />
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-starlight/55">Catalogue Structure</h2>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                  label="Categories Published"
                  value={counts.categoriesPublished}
                  hint={`${counts.categoriesTotal} total`}
                />
                <StatCard label="Brands Published" value={counts.brandsPublished} hint={`${counts.brandsTotal} total`} />
              </div>
            </section>
          </div>
        )
      )}
    </>
  )
}
