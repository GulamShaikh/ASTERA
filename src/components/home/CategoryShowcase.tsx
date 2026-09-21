import { categories } from '../../data/categories'
import { Container } from '../common/Container'
import { SectionHeading } from '../common/SectionHeading'
import { CategoryCard } from '../category/CategoryCard'

export function CategoryShowcase() {
  return (
    <section id="categories" className="bg-slate-50 py-20 lg:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Discovery Grid"
          heading="Curated for Your Daily Essentials"
          description="Browse accessories across fast charging, acoustics, everyday protection, and workspace connectivity."
          tone="light"
          accent="blue"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  )
}
