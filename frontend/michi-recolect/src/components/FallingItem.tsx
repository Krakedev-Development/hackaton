import { ITEM_SPRITES } from '../constants/assets'
import { getToyVariant } from '../constants/toyVariants'
import type { ObjectKind, ToyVariantId } from '../types/game'

interface FallingItemProps {
  kind: ObjectKind
  toyVariant?: ToyVariantId
}

export default function FallingItem({ kind, toyVariant }: FallingItemProps) {
  const sprite = ITEM_SPRITES[kind]

  if (sprite) {
    return (
      <img
        src={sprite}
        alt=""
        className="michi-catch__item-img"
        draggable={false}
      />
    )
  }

  if (kind === 'tuna') {
    return (
      <span className="michi-catch__object-emoji" title="Atun">
        🐟
      </span>
    )
  }

  if (kind === 'toy') {
    const variant = getToyVariant(toyVariant ?? 'teddy')
    return (
      <span className="michi-catch__object-emoji" title={variant.title}>
        {variant.emoji}
      </span>
    )
  }

  return null
}
