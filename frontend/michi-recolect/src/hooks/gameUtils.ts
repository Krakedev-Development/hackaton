import { pickRandomToyVariant } from '../constants/toyVariants'
import type { FallingObject, ObjectKind, SpawnableObject } from '../types/game'
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  OBJECT_SIZE,
  PLAYER_BOTTOM,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '../constants/gameConfig'

export function pickRandomKind(
  pool: SpawnableObject[],
  excludeKinds: ObjectKind[] = [],
): ObjectKind {
  const filtered =
    excludeKinds.length > 0
      ? pool.filter((item) => !excludeKinds.includes(item.kind))
      : pool
  const active = filtered.length > 0 ? filtered : pool
  const total = active.reduce((sum, item) => sum + item.weight, 0)
  let roll = Math.random() * total
  for (const item of active) {
    roll -= item.weight
    if (roll <= 0) return item.kind
  }
  return active[0]?.kind ?? 'coin'
}

export function createFallingObject(
  pool: SpawnableObject[],
  excludeKinds: ObjectKind[] = [],
): FallingObject {
  const margin = 8
  const x =
    margin + Math.random() * (100 - margin * 2 - (OBJECT_SIZE / GAME_WIDTH) * 100)
  const kind = pickRandomKind(pool, excludeKinds)
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    x,
    y: -OBJECT_SIZE,
    toyVariant: kind === 'toy' ? pickRandomToyVariant() : undefined,
  }
}

const KIND_HITBOX_SCALE: Partial<Record<FallingObject['kind'], number>> = {
  info: 0.5,
  star: 0.46,
}

export function boxesOverlap(
  playerXPercent: number,
  object: FallingObject,
): boolean {
  const playerLeft = (playerXPercent / 100) * GAME_WIDTH - PLAYER_WIDTH / 2
  const playerTop = GAME_HEIGHT - PLAYER_BOTTOM - PLAYER_HEIGHT

  const scale = KIND_HITBOX_SCALE[object.kind] ?? 1
  const hitSize = OBJECT_SIZE * scale
  const inset = (OBJECT_SIZE - hitSize) / 2
  const objectLeft =
    (object.x / 100) * GAME_WIDTH - OBJECT_SIZE / 2 + inset
  const objectTop = object.y + inset
  const objectBottom = objectTop + hitSize

  if (objectBottom < playerTop + 12) return false
  if (objectTop > playerTop + PLAYER_HEIGHT) return false

  return !(
    objectLeft + hitSize < playerLeft ||
    objectLeft > playerLeft + PLAYER_WIDTH
  )
}

export function clampPlayerX(x: number): number {
  const half = (PLAYER_WIDTH / GAME_WIDTH) * 50
  return Math.min(100 - half, Math.max(half, x))
}
