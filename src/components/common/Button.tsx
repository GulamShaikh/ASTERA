import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowRight } from './icons'

type Variant = 'primary' | 'secondary-dark' | 'secondary-light'

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-cosmic-blue text-white hover:bg-cosmic-blue/90 focus-visible:outline-white',
  'secondary-dark': 'border border-white/20 text-white hover:border-white/40 hover:bg-white/5',
  'secondary-light': 'border border-slate-300 text-space-black hover:border-space-black hover:bg-slate-50',
}

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

type CommonProps = {
  variant?: Variant
  withArrow?: boolean
  children: ReactNode
  className?: string
}

type ButtonProps = CommonProps &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>)
  )

/** Renders an `<a>` when `href` is given (real, navigable destination), otherwise a `<button>`. */
export function Button({ variant = 'primary', withArrow = false, children, className = '', href, ...rest }: ButtonProps) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`

  if (href) {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>
    // Internal routes (start with "/") get real SPA navigation via Link; anything else (e.g. "#" placeholders) stays a plain anchor.
    if (href.startsWith('/')) {
      return (
        <Link to={href} className={classes} {...anchorProps}>
          {children}
          {withArrow && <IconArrowRight className="h-4 w-4" />}
        </Link>
      )
    }
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
        {withArrow && <IconArrowRight className="h-4 w-4" />}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
      {withArrow && <IconArrowRight className="h-4 w-4" />}
    </button>
  )
}
