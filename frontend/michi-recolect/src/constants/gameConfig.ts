export const GAME_WIDTH = 480
export const GAME_HEIGHT = 640
export const PLAYER_WIDTH = 104
export const PLAYER_HEIGHT = 128
export const PLAYER_BOTTOM = 20
export const OBJECT_SIZE = 56
export const PLAYER_ACCELERATION = 0.00135
export const PLAYER_MAX_SPEED = 0.62
export const PLAYER_FRICTION = 0.86
export const SHIELD_DURATION_MS = 20000
export const SLOW_DURATION_MS = 10000
export const SLOW_MULTIPLIER = 0.72
export const SCORE_MULTIPLIER_VALUE = 2
export const MULTIPLIER_DURATION_MS = 15000
export const MAX_LIVES = 3

export const SCORE_GOAL = 500
export const DECISION_MILESTONES = [150, 300, 500] as const

export interface StageTuning {
  baseFallSpeed: number
  spawnIntervalMs: number
  minSpawnIntervalMs: number
  speedTierEvery: number
  speedBonusPerTier: number
  maxFallSpeedMultiplier: number
}

export const STAGE_TUNINGS: Record<number, StageTuning> = {
  1: {
    baseFallSpeed: 0.17,
    spawnIntervalMs: 1000,
    minSpawnIntervalMs: 480,
    speedTierEvery: 100,
    speedBonusPerTier: 0.28,
    maxFallSpeedMultiplier: 2.5,
  },
  2: {
    baseFallSpeed: 0.22,
    spawnIntervalMs: 820,
    minSpawnIntervalMs: 380,
    speedTierEvery: 80,
    speedBonusPerTier: 0.34,
    maxFallSpeedMultiplier: 2.9,
  },
  3: {
    baseFallSpeed: 0.28,
    spawnIntervalMs: 680,
    minSpawnIntervalMs: 300,
    speedTierEvery: 60,
    speedBonusPerTier: 0.4,
    maxFallSpeedMultiplier: 3.4,
  },
}

/** Valores por defecto nivel 1 (compat) */
export const BASE_FALL_SPEED = STAGE_TUNINGS[1].baseFallSpeed
export const SPAWN_INTERVAL_MS = STAGE_TUNINGS[1].spawnIntervalMs
export const MAX_FALL_SPEED_MULTIPLIER = STAGE_TUNINGS[1].maxFallSpeedMultiplier
export const MIN_SPAWN_INTERVAL_MS = STAGE_TUNINGS[1].minSpawnIntervalMs
export const SPEED_TIER_EVERY = STAGE_TUNINGS[1].speedTierEvery
export const SPEED_BONUS_PER_TIER = STAGE_TUNINGS[1].speedBonusPerTier

export function getStageTuning(stageId: number): StageTuning {
  return STAGE_TUNINGS[stageId] ?? STAGE_TUNINGS[1]
}

export function getScorePressureMultiplier(
  score: number,
  tuning: StageTuning = STAGE_TUNINGS[1],
): number {
  const tiers = Math.floor(Math.max(0, score) / tuning.speedTierEvery)
  return Math.min(
    1 + tiers * tuning.speedBonusPerTier,
    tuning.maxFallSpeedMultiplier,
  )
}

export function getSpeedTier(
  score: number,
  tuning: StageTuning = STAGE_TUNINGS[1],
): number {
  return Math.floor(Math.max(0, score) / tuning.speedTierEvery)
}

export function getSpawnInterval(
  score: number,
  tuning: StageTuning = STAGE_TUNINGS[1],
): number {
  const pressure = getScorePressureMultiplier(score, tuning)
  return Math.max(tuning.minSpawnIntervalMs, tuning.spawnIntervalMs / pressure)
}

export function getMilestoneIndex(milestone: number): number {
  return DECISION_MILESTONES.indexOf(
    milestone as (typeof DECISION_MILESTONES)[number],
  )
}
