import { useRef } from 'react'
import { ITEM_SPRITES } from '../constants/assets'
import type { ObjectKind } from '../types/game'

interface FallingItemProps {
  kind: ObjectKind
}

export default function FallingItem({ kind }: FallingItemProps) {
  const sprite = ITEM_SPRITES[kind]
  const toyEmojiRef = useRef(
    ['🧸', '🪀', '🚗', '⚽', '🧩'][Math.floor(Math.random() * 5)],
  )

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
    return (
      <span className="michi-catch__object-emoji" title="Juguete">
        {toyEmojiRef.current}
      </span>
    )
  }

  return null
}
