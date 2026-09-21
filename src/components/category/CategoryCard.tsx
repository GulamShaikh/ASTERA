import type { Category } from '../../data/categories'
import { IconTile } from '../common/IconTile'
import { TextLink } from '../common/TextLink'

type CategoryCardProps = {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-cosmic-blue/40 hover:shadow-lg hover:shadow-slate-200/60">
      <IconTile icon={category.icon} tone="light" />
      <div className="flex flex-col gap-1.5">
        <h3 className="font-heading text-lg font-semibold text-space-black">{category.name}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{category.description}</p>
      </div>
      <TextLink href={`/shop?category=${encodeURIComponent(category.name)}`} className="mt-auto">
        Explore {category.name}
      </TextLink>
    </div>
  )
}
