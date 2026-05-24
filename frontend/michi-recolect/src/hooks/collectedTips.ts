import { INFO_TIPS, type InfoTip } from '../constants/gameCopy'
import type { DecisionScenario } from '../constants/decisionScenarios'

export const MIN_COLLECTED_TIPS = 5

export function addUniqueTip(tips: InfoTip[], tip: InfoTip): InfoTip[] {
  if (tips.some((t) => t.text === tip.text)) return tips
  return [...tips, tip]
}

export function ensureMinimumTips(
  collected: InfoTip[],
  scenarios: DecisionScenario[],
  min = MIN_COLLECTED_TIPS,
): InfoTip[] {
  if (collected.length >= min) return collected

  const result = [...collected]
  const pool = [
    ...scenarios.flatMap((s) => s.relatedTips),
    ...INFO_TIPS,
  ]

  for (const tip of pool) {
    if (result.some((t) => t.text === tip.text)) continue
    result.push(tip)
    if (result.length >= min) break
  }

  return result
}

export interface TipPair {
  pregunta: string
  consejo: string
}

export function pairCollectedTips(tips: InfoTip[]): TipPair[] {
  const pairs: TipPair[] = []
  const used = new Set<string>()

  for (let i = 0; i < tips.length; i++) {
    const tip = tips[i]
    if (used.has(tip.text)) continue

    if (tip.kind === 'question') {
      const match = tips.find(
        (t, j) =>
          j > i &&
          t.kind === 'fact' &&
          !used.has(t.text),
      )
      if (match) {
        used.add(tip.text)
        used.add(match.text)
        pairs.push({ pregunta: tip.text, consejo: match.text })
        continue
      }
    }

    if (tip.kind === 'fact') {
      const match = tips.find(
        (t, j) =>
          j > i &&
          t.kind === 'question' &&
          !used.has(t.text),
      )
      if (match) {
        used.add(tip.text)
        used.add(match.text)
        pairs.push({ pregunta: match.text, consejo: tip.text })
        continue
      }
    }
  }

  for (const tip of tips) {
    if (used.has(tip.text)) continue
    if (tip.kind === 'question') {
      pairs.push({ pregunta: tip.text, consejo: 'Piensalo con tu michi y en casa.' })
    } else {
      pairs.push({ pregunta: 'Recuerdas este dato?', consejo: tip.text })
    }
    used.add(tip.text)
  }

  return pairs
}
