import type { ComponentType, SVGProps } from 'react'
import {
  IconBolt,
  IconCable,
  IconHeadphones,
  IconSpeaker,
  IconPhoneCase,
  IconShield,
  IconHub,
} from '../components/common/icons'

export type IconKey = 'bolt' | 'cable' | 'headphones' | 'speaker' | 'phone-case' | 'shield' | 'hub'

export const DEFAULT_ICON_KEY: IconKey = 'bolt'

/** The only icon values the admin may assign — a database never stores a component. */
export const ICON_KEY_OPTIONS: { value: IconKey; label: string }[] = [
  { value: 'bolt', label: 'Bolt (power)' },
  { value: 'cable', label: 'Cable' },
  { value: 'headphones', label: 'Headphones' },
  { value: 'speaker', label: 'Speaker' },
  { value: 'phone-case', label: 'Phone case' },
  { value: 'shield', label: 'Shield (protection)' },
  { value: 'hub', label: 'Hub (adapters)' },
]

const ICONS_BY_KEY: Record<IconKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  bolt: IconBolt,
  cable: IconCable,
  headphones: IconHeadphones,
  speaker: IconSpeaker,
  'phone-case': IconPhoneCase,
  shield: IconShield,
  hub: IconHub,
}

/** Maps a category's `icon_key` (a database column) to the fixed frontend icon set. */
export function resolveIcon(key: string | null | undefined): ComponentType<SVGProps<SVGSVGElement>> {
  return ICONS_BY_KEY[key as IconKey] ?? ICONS_BY_KEY[DEFAULT_ICON_KEY]
}
