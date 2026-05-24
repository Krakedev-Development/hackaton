export type GamePhase = 'playing' | 'frozen' | 'ended' | 'gameover'

export type ObjectKind =
  | 'coin'
  | 'tuna'
  | 'toy'
  | 'chest'
  | 'star'
  | 'info'

export type ToyVariantId = 'teddy' | 'yoyo' | 'car' | 'ball' | 'puzzle'

export type ItemEffect = 'points' | 'multiplier' | 'info'

export type CrashChoice = 'need' | 'desire'

export interface FallingObject {
  id: string
  kind: ObjectKind
  x: number
  y: number
  toyVariant?: ToyVariantId
}

export interface SpawnableObject {
  kind: ObjectKind
  label: string
  weight: number
  effect: ItemEffect
  points?: number
  multiplier?: number
  multiplierDurationMs?: number
}

export interface StageConfig {
  id: number
  title: string
  subtitle: string
  ageRange: string
  enabled: boolean
  scoreGoal: number
  decisionMilestones: number[]
  objects: SpawnableObject[]
}

export interface GameModifiers {
  shieldUntil: number
  slowUntil: number
  scoreMultiplier: number
  multiplierUntil: number
}

export type FeedbackTone = 'celebrate' | 'learn' | 'careful' | 'neutral'

export interface CatchResult {
  scoreDelta: number
  label: string
  infoMessage?: string
  infoIsQuestion?: boolean
  collectedTip?: { kind: 'fact' | 'question'; text: string }
  loseLife?: boolean
  tone?: FeedbackTone
}
