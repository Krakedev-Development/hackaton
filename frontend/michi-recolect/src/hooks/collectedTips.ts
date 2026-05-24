import { getConsejosPool, onlyConsejos } from '../constants/consejos'
import type { InfoTip } from '../constants/gameCopy'
import type { DecisionScenario } from '../constants/decisionScenarios'

export const MIN_COLLECTED_TIPS = 5
export const MAX_COLLECTED_TIPS = 5

export function addUniqueTip(tips: InfoTip[], tip: InfoTip): InfoTip[] {
  if (tips.length >= MAX_COLLECTED_TIPS) return tips
  if (tip.kind !== 'fact') return tips
  if (tips.some((t) => t.text === tip.text)) return tips
  return [...tips, tip]
}

/** Exactamente 5 consejos (solo datos, sin preguntas) */
export function finalizeCollectedTips(
  collected: InfoTip[],
  scenarios: DecisionScenario[],
  stageId: number,
): InfoTip[] {
  const result = [...onlyConsejos(collected)]
  const pool = [
    ...scenarios.flatMap((s) => onlyConsejos(s.relatedTips)),
    ...getConsejosPool(stageId),
  ]

  for (const tip of pool) {
    if (result.length >= MAX_COLLECTED_TIPS) break
    if (result.some((t) => t.text === tip.text)) continue
    result.push(tip)
  }

  return result.slice(0, MAX_COLLECTED_TIPS)
}

export interface TipPair {
  pregunta: string
  consejo: string
}

export function pairCollectedTips(tips: InfoTip[]): TipPair[] {
  const limited = tips.slice(0, MAX_COLLECTED_TIPS)
  const pairs: TipPair[] = []
  const used = new Set<string>()

  for (let i = 0; i < limited.length; i++) {
    const tip = limited[i]
    if (used.has(tip.text)) continue

    if (tip.kind === 'question') {
      const match = limited.find(
        (t, j) => j > i && t.kind === 'fact' && !used.has(t.text),
      )
      if (match) {
        used.add(tip.text)
        used.add(match.text)
        pairs.push({ pregunta: tip.text, consejo: match.text })
        continue
      }
    }

    if (tip.kind === 'fact') {
      const match = limited.find(
        (t, j) => j > i && t.kind === 'question' && !used.has(t.text),
      )
      if (match) {
        used.add(tip.text)
        used.add(match.text)
        pairs.push({ pregunta: match.text, consejo: tip.text })
        continue
      }
    }
  }

  for (const tip of limited) {
    if (used.has(tip.text)) continue
    if (tip.kind === 'question') {
      pairs.push({ pregunta: tip.text, consejo: 'Piensalo con tu michi.' })
    } else {
      pairs.push({ pregunta: 'Dato util', consejo: tip.text })
    }
    used.add(tip.text)
  }

  return pairs.slice(0, MAX_COLLECTED_TIPS)
}

/** @deprecated use finalizeCollectedTips */
export function ensureMinimumTips(
  collected: InfoTip[],
  scenarios: DecisionScenario[],
  stageId = 1,
): InfoTip[] {
  return finalizeCollectedTips(collected, scenarios, stageId)
}
