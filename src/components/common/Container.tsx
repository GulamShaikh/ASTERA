import type { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  className?: string
}

/** Shared inner-content width for full-bleed homepage sections (matches the approved 1440px design grid). */
export function Container({ children, className = '' }: ContainerProps) {
  return <div className={`mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 ${className}`}>{children}</div>
}
