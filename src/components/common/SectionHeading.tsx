import type { ReactNode } from 'react'

type Tone = 'dark' | 'light'
type Accent = 'blue' | 'champagne'

type SectionHeadingProps = {
  eyebrow: string
  heading: ReactNode
  description?: ReactNode
  tone?: Tone
  accent?: Accent
  align?: 'left' | 'center'
  action?: ReactNode
  /** Use 'h1' for a page's own top-level heading (e.g. a dedicated page like Shop). Defaults to 'h2' for a homepage section. */
  level?: 'h1' | 'h2'
}

const ACCENT_CLASSES: Record<Accent, string> = {
  blue: 'text-cosmic-blue',
  champagne: 'text-champagne',
}

export function SectionHeading({
  eyebrow,
  heading,
  description,
  tone = 'dark',
  accent = 'champagne',
  align = 'left',
  action,
  level = 'h2',
}: SectionHeadingProps) {
  const headingColor = tone === 'dark' ? 'text-white' : 'text-space-black'
  const descriptionColor = tone === 'dark' ? 'text-starlight/75' : 'text-slate-600'
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
  const Heading = level

  return (
    <div className={`flex flex-col gap-3 ${alignment} ${align === 'center' ? 'max-w-2xl' : 'max-w-2xl'}`}>
      <div className="flex w-full items-center justify-between gap-4">
        <span className={`text-xs font-semibold uppercase tracking-[0.14em] ${ACCENT_CLASSES[accent]}`}>
          {eyebrow}
        </span>
        {action && align === 'left' && <span className="hidden sm:block">{action}</span>}
      </div>
      <Heading className={`font-heading text-3xl font-semibold tracking-tight sm:text-4xl ${headingColor}`}>
        {heading}
      </Heading>
      {description && <p className={`text-base leading-relaxed ${descriptionColor}`}>{description}</p>}
    </div>
  )
}
