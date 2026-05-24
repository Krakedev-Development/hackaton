import { pickRandomConsejo } from '../constants/consejos'
import { CATCH_MESSAGES, type InfoTip } from '../constants/gameCopy'
import type { DecisionScenario } from '../constants/decisionScenarios'
import { pickRelatedConsejo } from '../constants/decisionScenarios'
import { getToyVariant } from '../constants/toyVariants'
import {
  MULTIPLIER_DURATION_MS,
  SCORE_MULTIPLIER_VALUE,
} from '../constants/gameConfig'
import type {
  CatchResult,
  FallingObject,
  GameModifiers,
  StageConfig,
} from '../types/game'

function resolveToyCatch(
  object: FallingObject,
  modifiers: GameModifiers,
  now: number,
): CatchResult {
  if (now < modifiers.shieldUntil) {
    return {
      scoreDelta: 0,
      label: CATCH_MESSAGES.toyShield,
      tone: 'celebrate',
    }
  }

  const variant = getToyVariant(object.toyVariant ?? 'teddy')
  const penalty = variant.pointsPenalty
  const parts: string[] = []
  if (penalty > 0) parts.push(`-${penalty} pts`)
  if (variant.loseLife) parts.push('-1 corazon')

  return {
    scoreDelta: penalty > 0 ? -penalty : 0,
    label: `!${variant.title}! ${parts.join(' y ')}`,
    loseLife: variant.loseLife,
    tone: 'careful',
  }
}

export function resolveCatch(
  object: FallingObject,
  stage: StageConfig,
  modifiers: GameModifiers,
  now: number,
  activeDecision?: DecisionScenario | null,
): CatchResult {
  const { kind } = object
  const def = stage.objects.find((o) => o.kind === kind)
  if (!def) {
    return { scoreDelta: 0, label: '' }
  }

  if (def.effect === 'info') {
    const tip: InfoTip = activeDecision
      ? Math.random() < 0.75
        ? pickRelatedConsejo(activeDecision, stage.id)
        : pickRandomConsejo(stage.id)
      : pickRandomConsejo(stage.id)
    return {
      scoreDelta: 0,
      label: CATCH_MESSAGES.info,
      infoMessage: tip.text,
      infoIsQuestion: false,
      collectedTip: tip,
      tone: 'learn',
    }
  }

  if (def.effect === 'multiplier') {
    const mult = def.multiplier ?? SCORE_MULTIPLIER_VALUE
    modifiers.scoreMultiplier = mult
    modifiers.multiplierUntil =
      now + (def.multiplierDurationMs ?? MULTIPLIER_DURATION_MS)
    return {
      scoreDelta: 0,
      label: CATCH_MESSAGES.star,
      tone: 'celebrate',
    }
  }

  if (kind === 'toy') {
    return resolveToyCatch(object, modifiers, now)
  }

  const basePoints = def.points ?? 0
  const mult =
    now < modifiers.multiplierUntil ? modifiers.scoreMultiplier : 1
  const scoreDelta = Math.round(basePoints * mult)

  const labelMap: Partial<Record<FallingObject['kind'], string>> = {
    coin: CATCH_MESSAGES.coin,
    chest: CATCH_MESSAGES.chest,
  }

  const baseLabel = labelMap[kind] ?? `!Bien! +${scoreDelta}`
  const label =
    mult > 1 && scoreDelta > 0
      ? `${baseLabel} (x${mult})`
      : baseLabel

  return {
    scoreDelta,
    label,
    tone: 'celebrate',
  }
}
