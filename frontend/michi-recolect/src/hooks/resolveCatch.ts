import {
  CATCH_MESSAGES,
  pickRandomInfoTip,
  type InfoTip,
} from '../constants/gameCopy'
import { pickRelatedInfoTip } from '../constants/decisionScenarios'
import type { DecisionScenario } from '../constants/decisionScenarios'
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

export function resolveCatch(
  kind: FallingObject['kind'],
  stage: StageConfig,
  modifiers: GameModifiers,
  now: number,
  activeDecision?: DecisionScenario | null,
): CatchResult {
  const def = stage.objects.find((o) => o.kind === kind)
  if (!def) {
    return { scoreDelta: 0, label: '' }
  }

  if (def.effect === 'info') {
    const tip: InfoTip = activeDecision
      ? Math.random() < 0.75
        ? pickRelatedInfoTip(activeDecision)
        : pickRandomInfoTip()
      : pickRandomInfoTip()
    return {
      scoreDelta: 0,
      label: CATCH_MESSAGES.info,
      infoMessage: tip.text,
      infoIsQuestion: tip.kind === 'question',
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

  if (kind === 'toy' && now < modifiers.shieldUntil) {
    return {
      scoreDelta: 0,
      label: CATCH_MESSAGES.toyShield,
      tone: 'celebrate',
    }
  }

  if (kind === 'toy') {
    const penalty = Math.abs(def.points ?? 10)
    return {
      scoreDelta: -penalty,
      label: `!Cuidado! -${penalty} pts y -1 corazon`,
      loseLife: true,
      tone: 'careful',
    }
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
      : scoreDelta > 0
        ? baseLabel
        : baseLabel

  return {
    scoreDelta,
    label,
    tone: 'celebrate',
  }
}
