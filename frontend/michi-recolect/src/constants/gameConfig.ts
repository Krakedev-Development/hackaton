export const GAME_WIDTH = 480
export const GAME_HEIGHT = 640
export const PLAYER_WIDTH = 104
export const PLAYER_HEIGHT = 128
export const PLAYER_BOTTOM = 20
export const OBJECT_SIZE = 56
export const PLAYER_ACCELERATION = 0.00135
export const PLAYER_MAX_SPEED = 0.62
export const PLAYER_FRICTION = 0.86
export const BASE_FALL_SPEED = 0.17
export const SPAWN_INTERVAL_MS = 1000
export const SHIELD_DURATION_MS = 20000
export const SLOW_DURATION_MS = 10000
export const SLOW_MULTIPLIER = 0.72
export const SCORE_MULTIPLIER_VALUE = 2
export const MULTIPLIER_DURATION_MS = 15000
export const MAX_FALL_SPEED_MULTIPLIER = 2.5
export const MIN_SPAWN_INTERVAL_MS = 480
export const MAX_LIVES = 3

export const SCORE_GOAL = 500
export const DECISION_MILESTONES = [150, 300, 500] as const

/** Cada 100 puntos sube un escalon de velocidad */
export const SPEED_TIER_EVERY = 100
export const SPEED_BONUS_PER_TIER = 0.28

export function getScorePressureMultiplier(score: number): number {
  const tiers = Math.floor(Math.max(0, score) / SPEED_TIER_EVERY)
  return Math.min(1 + tiers * SPEED_BONUS_PER_TIER, MAX_FALL_SPEED_MULTIPLIER)
}

export function getSpeedTier(score: number): number {
  return Math.floor(Math.max(0, score) / SPEED_TIER_EVERY)
}

export function getSpawnInterval(score: number): number {
  const pressure = getScorePressureMultiplier(score)
  return Math.max(MIN_SPAWN_INTERVAL_MS, SPAWN_INTERVAL_MS / pressure)
}

export function getMilestoneIndex(milestone: number): number {
  return DECISION_MILESTONES.indexOf(
    milestone as (typeof DECISION_MILESTONES)[number],
  )
}
