import { Hero } from '../components/home/Hero'
import { CategoryShowcase } from '../components/home/CategoryShowcase'
import { NewArrivals } from '../components/home/NewArrivals'
import { BrandDiscovery } from '../components/home/BrandDiscovery'
import { WhyAstera } from '../components/home/WhyAstera'
import { OnlineExperience } from '../components/home/OnlineExperience'
import { FinalCta } from '../components/home/FinalCta'

export function Home() {
  return (
    <main>
      <Hero />
      <CategoryShowcase />
      <NewArrivals />
      <BrandDiscovery />
      <WhyAstera />
      <OnlineExperience />
      <FinalCta />
    </main>
  )
}
