import type { FallingObject, ObjectKind, SpawnableObject } from '../types/game'
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  OBJECT_SIZE,
  PLAYER_BOTTOM,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '../constants/gameConfig'

export function pickRandomKind(pool: SpawnableObject[]): ObjectKind {
  const total = pool.reduce((sum, item) => sum + item.weight, 0)
  let roll = Math.random() * total
  for (const item of pool) {
    roll -= item.weight
    if (roll <= 0) return item.kind
  }
  return pool[0]?.kind ?? 'coin'
}

export function createFallingObject(pool: SpawnableObject[]): FallingObject {
  const margin = 8
  const x =
    margin + Math.random() * (100 - margin * 2 - (OBJECT_SIZE / GAME_WIDTH) * 100)
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind: pickRandomKind(pool),
    x,
    y: -OBJECT_SIZE,
  }
}

export function boxesOverlap(
  playerXPercent: number,
  object: FallingObject,
): boolean {
  const playerLeft = (playerXPercent / 100) * GAME_WIDTH - PLAYER_WIDTH / 2
  const playerTop = GAME_HEIGHT - PLAYER_BOTTOM - PLAYER_HEIGHT
  const objectLeft = (object.x / 100) * GAME_WIDTH - OBJECT_SIZE / 2
  const objectTop = object.y
  const objectBottom = objectTop + OBJECT_SIZE

  if (objectBottom < playerTop + 12) return false
  if (objectTop > playerTop + PLAYER_HEIGHT) return false

  return !(
    objectLeft + OBJECT_SIZE < playerLeft ||
    objectLeft > playerLeft + PLAYER_WIDTH
  )
}

export function clampPlayerX(x: number): number {
  const half = (PLAYER_WIDTH / GAME_WIDTH) * 50
  return Math.min(100 - half, Math.max(half, x))
}
