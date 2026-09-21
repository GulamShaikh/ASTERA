import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowRight } from './icons'

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
  tone?: 'blue' | 'champagne'
  href: string
}

const TONE_CLASSES: Record<'blue' | 'champagne', string> = {
  blue: 'text-cosmic-blue hover:text-cosmic-blue/80',
  champagne: 'text-champagne hover:text-champagne/80',
}

/** Small "label + arrow" link used on cards (category/product/brand explore links). */
export function TextLink({ children, tone = 'blue', className = '', href, ...props }: TextLinkProps) {
  const classes = `group inline-flex items-center gap-1.5 text-sm font-semibold ${TONE_CLASSES[tone]} ${className}`
  const content = (
    <>
      {children}
      <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </>
  )

  // Internal routes (start with "/") get real SPA navigation via Link; anything else stays a plain anchor.
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <a href={href} className={classes} {...props}>
      {content}
    </a>
  )
}
