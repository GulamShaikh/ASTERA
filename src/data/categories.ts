import {
  IconBolt,
  IconCable,
  IconHeadphones,
  IconSpeaker,
  IconPhoneCase,
  IconShield,
  IconHub,
} from '../components/common/icons'
import type { ComponentType, SVGProps } from 'react'

export type Category = {
  id: string
  name: string
  description: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

export const categories: Category[] = [
  {
    id: 'chargers',
    name: 'Chargers',
    description: 'High-efficiency GaN wall blocks and slimline daily battery packs.',
    icon: IconBolt,
  },
  {
    id: 'cables',
    name: 'Cables',
    description: 'Reinforced braided USB-C and tangle-resistant everyday cords.',
    icon: IconCable,
  },
  {
    id: 'earphones',
    name: 'Earphones & Earbuds',
    description: 'Ergonomic wireless in-ears and balanced daily acoustic gear.',
    icon: IconHeadphones,
  },
  {
    id: 'speakers',
    name: 'Speakers',
    description: 'Compact desktop audio and portable balanced room sound.',
    icon: IconSpeaker,
  },
  {
    id: 'cases',
    name: 'Mobile Cases',
    description: 'Precision-fit protective composite frames with a matte finish.',
    icon: IconPhoneCase,
  },
  {
    id: 'screen-protectors',
    name: 'Screen Protectors',
    description: 'Tempered optical glass and clean anti-reflective overlays.',
    icon: IconShield,
  },
  {
    id: 'adapters',
    name: 'Adapters & Accessories',
    description: 'Multi-port USB-C hubs, audio dongles, and connectivity adapters.',
    icon: IconHub,
  },
]
