import { Container } from '../common/Container'
import { SectionHeading } from '../common/SectionHeading'
import { IconTile } from '../common/IconTile'
import { IconSearch, IconDevice, IconBadgeCheck, IconShoppingBag } from '../common/icons'

const PILLARS = [
  {
    icon: IconSearch,
    title: 'Product Discovery',
    description: 'Uncovering thoughtful accessory brands focused on fresh design and reliable utility.',
  },
  {
    icon: IconDevice,
    title: 'Everyday Usefulness',
    description: 'Carefully chosen accessories built for daily utility, durable materials, and practical convenience.',
  },
  {
    icon: IconBadgeCheck,
    title: 'Quality-Focused Selection',
    description: 'Every product is evaluated for tactile feel, solid connector fit, and lasting durability.',
  },
  {
    icon: IconShoppingBag,
    title: 'Easy Online Shopping',
    description: 'Streamlined online browsing, straightforward checkout, and responsive support.',
  },
]

export function WhyAstera() {
  return (
    <section id="why-astera" className="bg-white py-20 lg:py-24">
      <Container className="flex flex-col items-center gap-10">
        <SectionHeading
          eyebrow="The ASTERA Standard"
          heading="Thoughtfully Selected for Real Life"
          description="Our standards are rooted in functional excellence, transparent build details, and dependable online shopping."
          tone="light"
          accent="blue"
          align="center"
        />

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">
              <IconTile icon={pillar.icon} tone="light" />
              <h3 className="font-heading text-base font-semibold text-space-black">{pillar.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{pillar.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
