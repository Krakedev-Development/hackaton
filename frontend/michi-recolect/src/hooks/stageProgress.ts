const BEAT_KEY = 'michi-recolect-beat-stages'
const QUIZ_KEY = 'michi-recolect-quiz-passed'

const QUIZ_PASS_MIN_SCORE = 6
const QUIZ_TOTAL = 10

function readIds(key: string): number[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((n): n is number => typeof n === 'number' && n >= 1)
  } catch {
    return []
  }
}

function writeIds(key: string, ids: number[]): void {
  localStorage.setItem(key, JSON.stringify([...new Set(ids)].sort((a, b) => a - b)))
}

export function getBeatStages(): number[] {
  return readIds(BEAT_KEY)
}

export function getQuizPassedStages(): number[] {
  return readIds(QUIZ_KEY)
}

/** Nivel desbloqueado para jugar (requiere quiz del nivel anterior) */
export function isStageUnlocked(stageId: number): boolean {
  if (stageId === 1) return true
  if (stageId === 2) return getQuizPassedStages().includes(1)
  if (stageId === 3) return getQuizPassedStages().includes(2)
  return false
}

export function hasBeatStage(stageId: number): boolean {
  return getBeatStages().includes(stageId)
}

export function hasQuizPassed(stageId: number): boolean {
  return getQuizPassedStages().includes(stageId)
}

export function isStageFullyComplete(stageId: number): boolean {
  return hasBeatStage(stageId) && hasQuizPassed(stageId)
}

export function getStageLockHint(stageId: number): string | null {
  if (stageId === 2 && !getQuizPassedStages().includes(1)) {
    return 'Pasa el quiz del nivel 1 para desbloquear'
  }
  if (stageId === 3 && !getQuizPassedStages().includes(2)) {
    return 'Pasa el quiz del nivel 2 para desbloquear'
  }
  return null
}

export function markStageBeaten(stageId: number): number[] {
  const beat = getBeatStages()
  if (beat.includes(stageId)) return beat
  const next = [...beat, stageId].sort((a, b) => a - b)
  writeIds(BEAT_KEY, next)
  return next
}

export function markQuizPassed(stageId: number, score: number): boolean {
  if (score < QUIZ_PASS_MIN_SCORE) return false
  const passed = getQuizPassedStages()
  if (!passed.includes(stageId)) {
    writeIds(QUIZ_KEY, [...passed, stageId])
  }
  return true
}

export function getQuizPassRequirement(): { min: number; total: number } {
  return { min: QUIZ_PASS_MIN_SCORE, total: QUIZ_TOTAL }
}

/** Compat: progreso que desbloquea siguiente nivel */
export function getCompletedStages(): number[] {
  return getQuizPassedStages()
}

export function markStageCompleted(stageId: number): number[] {
  return markQuizPassed(stageId, QUIZ_PASS_MIN_SCORE) ? getQuizPassedStages() : getQuizPassedStages()
}
