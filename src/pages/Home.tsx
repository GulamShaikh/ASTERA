import { usePageTitle } from '../hooks/usePageTitle'
import { useAsyncData } from '../hooks/useAsyncData'
import { fetchPublishedBrands, fetchPublishedCategories, fetchPublishedProducts } from '../lib/api'
import { Hero } from '../components/home/Hero'
import { CategoryShowcase } from '../components/home/CategoryShowcase'
import { NewArrivals } from '../components/home/NewArrivals'
import { BrandDiscovery } from '../components/home/BrandDiscovery'
import { WhyAstera } from '../components/home/WhyAstera'
import { OnlineExperience } from '../components/home/OnlineExperience'
import { FinalCta } from '../components/home/FinalCta'

export function Home() {
  usePageTitle('ASTERA — Exploring New Brands. Delivering Quality.')

  const productsState = useAsyncData(() => fetchPublishedProducts(), [])
  const categoriesState = useAsyncData(() => fetchPublishedCategories(), [])
  const brandsState = useAsyncData(() => fetchPublishedBrands(), [])

  return (
    <main>
      <Hero products={productsState.data} />
      <CategoryShowcase state={categoriesState} />
      <NewArrivals state={productsState} />
      <BrandDiscovery state={brandsState} />
      <WhyAstera />
      <OnlineExperience />
      <FinalCta />
    </main>
  )
}
