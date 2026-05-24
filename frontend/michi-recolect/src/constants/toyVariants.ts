import type { ToyVariantId } from '../types/game'

export interface ToyVariantConfig {
  id: ToyVariantId
  emoji: string
  title: string
  pointsPenalty: number
  loseLife: boolean
  spawnWeight: number
}

export const TOY_VARIANTS: Record<ToyVariantId, ToyVariantConfig> = {
  teddy: {
    id: 'teddy',
    emoji: '🧸',
    title: 'Oso de peluche',
    pointsPenalty: 10,
    loseLife: true,
    spawnWeight: 24,
  },
  yoyo: {
    id: 'yoyo',
    emoji: '🪀',
    title: 'Yoyo',
    pointsPenalty: 5,
    loseLife: false,
    spawnWeight: 22,
  },
  ball: {
    id: 'ball',
    emoji: '⚽',
    title: 'Pelota',
    pointsPenalty: 8,
    loseLife: false,
    spawnWeight: 22,
  },
  puzzle: {
    id: 'puzzle',
    emoji: '🧩',
    title: 'Rompecabezas',
    pointsPenalty: 12,
    loseLife: false,
    spawnWeight: 18,
  },
  car: {
    id: 'car',
    emoji: '🚗',
    title: 'Carrito',
    pointsPenalty: 18,
    loseLife: true,
    spawnWeight: 14,
  },
}

const TOY_VARIANT_LIST = Object.values(TOY_VARIANTS)

export function pickRandomToyVariant(): ToyVariantId {
  const total = TOY_VARIANT_LIST.reduce((sum, v) => sum + v.spawnWeight, 0)
  let roll = Math.random() * total
  for (const variant of TOY_VARIANT_LIST) {
    roll -= variant.spawnWeight
    if (roll <= 0) return variant.id
  }
  return 'teddy'
}

export function getToyVariant(id: ToyVariantId): ToyVariantConfig {
  return TOY_VARIANTS[id]
}
