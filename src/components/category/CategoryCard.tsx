import { Link } from 'react-router-dom'
import type { Category } from '../../types/catalogue'
import { IconTile } from '../common/IconTile'
import { IconArrowRight } from '../common/icons'

type CategoryCardProps = {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/categories/${category.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-cosmic-blue/40 hover:shadow-lg hover:shadow-slate-200/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cosmic-blue"
    >
      <IconTile icon={category.icon} tone="light" />
      <div className="flex flex-col gap-1.5">
        <h3 className="font-heading text-lg font-semibold text-space-black">{category.name}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{category.description}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-cosmic-blue">
        Explore {category.name}
        <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
