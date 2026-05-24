export const GAME_WIDTH = 480
export const GAME_HEIGHT = 640
export const PLAYER_WIDTH = 104
export const PLAYER_HEIGHT = 128
export const PLAYER_BOTTOM = 20
export const OBJECT_SIZE = 56
export const PLAYER_ACCELERATION = 0.00155
export const PLAYER_MAX_SPEED = 0.68
export const PLAYER_FRICTION = 0.86
export const SHIELD_DURATION_MS = 30000
export const SLOW_DURATION_MS = 10000
export const SLOW_MULTIPLIER = 0.72
export const SCORE_MULTIPLIER_VALUE = 2
export const MULTIPLIER_DURATION_MS = 15000
export const MAX_LIVES = 3

export const SCORE_GOAL = 500
export const DECISION_MILESTONES = [150, 300, 500] as const

/** Maximo de fichas verdes (info) que caen por partida */
export const MAX_INFO_SPAWNS_PER_GAME = 5

/** Maximo de estrellas por partida */
export const MAX_STAR_SPAWNS_PER_GAME = 2

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
    baseFallSpeed: 0.22,
    spawnIntervalMs: 750,
    minSpawnIntervalMs: 360,
    speedTierEvery: 90,
    speedBonusPerTier: 0.34,
    maxFallSpeedMultiplier: 3.1,
  },
  2: {
    baseFallSpeed: 0.27,
    spawnIntervalMs: 620,
    minSpawnIntervalMs: 290,
    speedTierEvery: 75,
    speedBonusPerTier: 0.4,
    maxFallSpeedMultiplier: 3.5,
  },
  3: {
    baseFallSpeed: 0.33,
    spawnIntervalMs: 520,
    minSpawnIntervalMs: 230,
    speedTierEvery: 55,
    speedBonusPerTier: 0.46,
    maxFallSpeedMultiplier: 3.9,
  },
}

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
