import { Link } from 'react-router-dom'
import { Logo } from './Logo'

/** Header/footer brand lockup: the approved mark beside the ASTERA wordmark as real text (see docs/DECISIONS.md). */
export function LogoLockup({ className = '' }: { className?: string }) {
  return (
    <Link to="/" aria-label="ASTERA home" className={`inline-flex w-fit shrink-0 items-center gap-2.5 ${className}`}>
      <Logo variant="mark" className="h-9 w-auto shrink-0" />
      <span className="font-heading whitespace-nowrap text-xl font-semibold tracking-wide text-white sm:text-2xl">
        ASTERA
      </span>
    </Link>
  )
}
