import { Container } from '../common/Container'
import { SectionHeading } from '../common/SectionHeading'
import { Button } from '../common/Button'
import { WhatsAppButton } from '../common/WhatsAppButton'
import { generalEnquiryMessage } from '../../lib/whatsapp'
import { IconSearch, IconInfo, IconWhatsApp, IconHeadset } from '../common/icons'

const FEATURES = [
  {
    icon: IconSearch,
    title: 'Easy Product Discovery',
    description: 'Curated selections organized by device and daily use case.',
  },
  {
    icon: IconInfo,
    title: 'Clear Product Information',
    description: 'Transparent specifications and compatibility details before you buy.',
  },
  {
    icon: IconWhatsApp,
    title: 'Direct WhatsApp Enquiry',
    description: 'Ask about availability and details straight from any product page.',
  },
  {
    icon: IconHeadset,
    title: 'Customer Support',
    description: 'Digital support ready to help with product questions.',
  },
]

export function OnlineExperience() {
  return (
    <section className="bg-space-black py-20 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Online Discovery"
            heading="Curated Online Experience, Delivered to You."
            description="ASTERA brings you curated everyday gear with clear specifications and responsive digital assistance."
            tone="dark"
            accent="champagne"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-white/10 p-4">
                <feature.icon className="h-5 w-5 text-cosmic-blue" />
                <h3 className="mt-3 text-sm font-semibold text-white">{feature.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-starlight/65">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/shop" variant="primary" withArrow>
              Start Shopping
            </Button>
            <Button href="/categories" variant="secondary-dark">
              Browse Categories
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <img
              src="/images/hero/astera-spotlight-kit.png"
              alt="ASTERA accessory kit packaged and ready to ship: cable, charger, and earbuds"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-semibold text-white">Thoughtful Packaging</p>
                <p className="text-xs text-starlight/60">Presented with care</p>
              </div>
              <span className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium text-starlight/70">
                ASTERA Standard
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 p-4">
            <div>
              <p className="text-sm font-semibold text-white">Have a Question Before You Order?</p>
              <p className="mt-1 text-sm text-starlight/65">Get guidance on ports, wattage, and compatibility before you buy.</p>
            </div>
            <WhatsAppButton
              message={generalEnquiryMessage()}
              variant="secondary-dark"
              className="shrink-0 px-4 py-2 text-xs"
            >
              Ask on WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </Container>
    </section>
  )
}
