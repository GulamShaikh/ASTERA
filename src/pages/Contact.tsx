import { usePageTitle } from '../hooks/usePageTitle'
import { generalEnquiryMessage } from '../lib/whatsapp'
import { CONTACT_CHANNELS } from '../content/site'
import { Container } from '../components/common/Container'
import { Button } from '../components/common/Button'
import { WhatsAppButton } from '../components/common/WhatsAppButton'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { IconWhatsApp, IconStar } from '../components/common/icons'

function ChannelValue({ value, toHref }: { value: string | null; toHref?: (value: string) => string }) {
  if (!value) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="text-sm text-starlight/45">To be confirmed</span>
        <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-starlight/45">
          Pending
        </span>
      </span>
    )
  }

  if (toHref) {
    return (
      <a href={toHref(value)} className="text-sm font-medium text-white hover:text-starlight">
        {value}
      </a>
    )
  }

  return <span className="text-sm font-medium text-white">{value}</span>
}

export function Contact() {
  usePageTitle('Contact — ASTERA')

  return (
    <main className="bg-space-black">
      <section className="py-12 lg:py-16">
        <Container className="flex flex-col gap-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />

          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-champagne/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-champagne">
              <IconStar className="h-3.5 w-3.5" />
              Get in Touch
            </span>

            <h1 className="font-heading max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Questions About a Product or a Brand?
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-starlight/75">
              The quickest way to reach ASTERA is WhatsApp — message us about ports, wattage, compatibility, or
              which accessory suits your device.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-cosmic-blue/25 bg-cosmic-blue/[0.06] p-6">
              <IconWhatsApp className="h-7 w-7 text-cosmic-blue" />
              <div className="flex flex-col gap-1">
                <h2 className="font-heading text-lg font-semibold text-white">Message Us on WhatsApp</h2>
                <p className="text-sm leading-relaxed text-starlight/70">
                  ASTERA&apos;s primary enquiry channel — usually the fastest way to get a reply.
                </p>
              </div>
              <WhatsAppButton message={generalEnquiryMessage()} className="w-fit">
                Chat on WhatsApp
              </WhatsAppButton>
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="font-heading text-xl font-semibold text-white">Contact Details</h2>
            </div>

            <dl className="flex flex-col divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
              {CONTACT_CHANNELS.map((channel) => (
                <div key={channel.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-starlight/55">{channel.label}</dt>
                  <dd>
                    <ChannelValue value={channel.value} toHref={channel.toHref} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-heading text-lg font-semibold text-white">While You&apos;re Here</h2>
            <p className="text-sm leading-relaxed text-starlight/70">
              The full catalogue and every brand ASTERA curates are already browsable — product pages list the
              specifications and compatibility details that answer most questions.
            </p>
            <div className="mt-2 flex flex-col gap-3">
              <Button href="/shop" variant="primary" withArrow>
                Browse Products
              </Button>
              <Button href="/brands" variant="secondary-dark">
                Explore Brands
              </Button>
            </div>
          </aside>
        </Container>
      </section>
    </main>
  )
}
