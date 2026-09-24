import type { ReactNode } from 'react'
import { Button } from './Button'
import { IconWhatsApp } from './icons'
import { buildWhatsAppLink } from '../../lib/whatsapp'

type WhatsAppButtonProps = {
  message: string
  children: ReactNode
  variant?: 'primary' | 'secondary-dark' | 'secondary-light'
  withArrow?: boolean
  className?: string
}

/**
 * Renders a real wa.me link when the client's number is configured
 * (src/content/site.ts), or a disabled-looking "coming soon" state when it
 * isn't — never a broken link with an invented number.
 */
export function WhatsAppButton({ message, children, variant = 'primary', withArrow, className = '' }: WhatsAppButtonProps) {
  const href = buildWhatsAppLink(message)

  if (!href) {
    return (
      <span
        title="WhatsApp enquiries aren't set up yet"
        className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-starlight/40 ${className}`}
      >
        <IconWhatsApp className="h-4 w-4" />
        WhatsApp Coming Soon
      </span>
    )
  }

  return (
    <Button
      href={href}
      variant={variant}
      withArrow={withArrow}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <IconWhatsApp className="h-4 w-4" />
      {children}
    </Button>
  )
}
