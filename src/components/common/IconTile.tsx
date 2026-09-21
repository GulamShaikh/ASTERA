import type { ComponentType, SVGProps } from 'react'

type Tone = 'dark' | 'light'

type IconTileProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  tone?: Tone
  className?: string
}

const TONE_CLASSES: Record<Tone, string> = {
  light: 'bg-cosmic-blue/10 text-cosmic-blue',
  dark: 'bg-cosmic-blue/20 text-cosmic-blue',
}

export function IconTile({ icon: Icon, tone = 'light', className = '' }: IconTileProps) {
  return (
    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${TONE_CLASSES[tone]} ${className}`}>
      <Icon className="h-5 w-5" />
    </div>
  )
}
