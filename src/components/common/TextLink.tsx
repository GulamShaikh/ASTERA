import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { IconArrowRight } from './icons'

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
  tone?: 'blue' | 'champagne'
}

const TONE_CLASSES: Record<'blue' | 'champagne', string> = {
  blue: 'text-cosmic-blue hover:text-cosmic-blue/80',
  champagne: 'text-champagne hover:text-champagne/80',
}

/** Small "label + arrow" link used on cards (category/product/brand explore links). */
export function TextLink({ children, tone = 'blue', className = '', ...props }: TextLinkProps) {
  return (
    <a
      className={`group inline-flex items-center gap-1.5 text-sm font-semibold ${TONE_CLASSES[tone]} ${className}`}
      {...props}
    >
      {children}
      <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </a>
  )
}
