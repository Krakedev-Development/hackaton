const STORAGE_KEY = 'michi-recolect-completed-stages'

export function getCompletedStages(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((n): n is number => typeof n === 'number' && n >= 1)
  } catch {
    return []
  }
}

export function isStageUnlocked(stageId: number, completed: number[]): boolean {
  if (stageId === 1) return true
  if (stageId === 2) return completed.includes(1)
  if (stageId === 3) return completed.includes(2)
  return false
}

export function getStageLockHint(stageId: number): string | null {
  if (stageId === 2) return 'Supera el nivel 1 para desbloquear'
  if (stageId === 3) return 'Supera el nivel 2 para desbloquear'
  return null
}

export function markStageCompleted(stageId: number): number[] {
  const completed = getCompletedStages()
  if (completed.includes(stageId)) return completed
  const next = [...completed, stageId].sort((a, b) => a - b)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}
