type LogoVariant = 'mark' | 'dark-bg' | 'light-bg'

const SOURCES: Record<LogoVariant, string> = {
  mark: '/brand/astera-logo-mark.svg',
  'dark-bg': '/brand/astera-logo-dark-bg.svg',
  'light-bg': '/brand/astera-logo-light-bg.svg',
}

type LogoProps = {
  /** Which approved SVG variant to render — match it to the surface it sits on. */
  variant?: LogoVariant
  className?: string
}

export function Logo({ variant = 'dark-bg', className }: LogoProps) {
  return <img src={SOURCES[variant]} alt="ASTERA" className={className} />
}
