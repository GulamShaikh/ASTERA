import type { SVGProps } from 'react'

/**
 * Hand-authored line-icon set (24x24, stroke-based) so the site ships without
 * an icon-library dependency. Keep new icons consistent: viewBox 0 0 24 24,
 * stroke="currentColor", strokeWidth 1.75, round caps/joins.
 */
type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function IconBolt(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" strokeLinejoin="round" />
    </svg>
  )
}

export function IconCable(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 4v3a4 4 0 0 0 4 4 4 4 0 0 1 4 4v3" />
      <circle cx="8" cy="4" r="1.75" />
      <circle cx="16" cy="18" r="1.75" />
    </svg>
  )
}

export function IconHeadphones(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="14" width="4" height="6" rx="1.5" />
      <rect x="17" y="14" width="4" height="6" rx="1.5" />
    </svg>
  )
}

export function IconSpeaker(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="3" width="12" height="18" rx="2.5" />
      <circle cx="12" cy="9" r="2.25" />
      <circle cx="12" cy="16" r="1" />
    </svg>
  )
}

export function IconPhoneCase(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10 5.5h4" />
    </svg>
  )
}

export function IconShield(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 5 6v5.5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6l-7-2.5Z" strokeLinejoin="round" />
    </svg>
  )
}

export function IconHub(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M12 8v4m0 0-4.5 4M12 12l4.5 4" />
    </svg>
  )
}

export function IconStar(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  )
}

export function IconLock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

/** Filled four-point sparkle — decorative accent (the one filled glyph in this set). */
export function IconSparkle(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M12 1.5c.7 5.6 3.4 8.6 9.5 10.5-6.1 1.9-8.8 4.9-9.5 10.5-.7-5.6-3.4-8.6-9.5-10.5 6.1-1.9 8.8-4.9 9.5-10.5Z" />
    </svg>
  )
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.6-3.6" />
    </svg>
  )
}

export function IconDevice(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="12" rx="1.5" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

export function IconBadgeCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m9 12 2 2 4-4" />
      <path d="M12 3.5 9.5 5H7v2.5L5 9.5V12l2 2v2.5h2.5L12 20.5 14.5 16.5H17V14l2-2V9.5l-2-2V5h-2.5L12 3.5Z" strokeLinejoin="round" />
    </svg>
  )
}

export function IconShoppingBag(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  )
}

export function IconInfo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 8v.01" />
    </svg>
  )
}

export function IconTruck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7.5" cy="18" r="1.5" />
      <circle cx="17.5" cy="18" r="1.5" />
    </svg>
  )
}

export function IconHeadset(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19v.5a3 3 0 0 1-3 3h-2.5" />
    </svg>
  )
}

export function IconMail(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

export function IconChevronDown(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function IconWhatsApp(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20.5 5.2 16A8.5 8.5 0 1 1 8 18.8Z" strokeLinejoin="round" />
      <path d="M9 9.6c0 3.2 2.6 5.8 5.8 5.8.5 0 .8-.5.6-1l-.5-1.2c-.2-.4-.6-.5-1-.4l-.7.3a4.4 4.4 0 0 1-2.3-2.3l.3-.7c.1-.4 0-.8-.4-1l-1.2-.5c-.5-.2-1 .1-1 .6-.1.1-.1.3-.1.4Z" />
    </svg>
  )
}

export function IconPackageSearch(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 8.5 12 4l8.5 4.5v7L12 20l-8.5-4.5v-7Z" strokeLinejoin="round" />
      <path d="M3.5 8.5 12 13l8.5-4.5M12 13v7" />
      <circle cx="18" cy="17.5" r="3" />
      <path d="m20.5 20 1.5 1.5" />
    </svg>
  )
}
