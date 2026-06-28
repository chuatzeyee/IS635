export interface ExamAttempt {
  readonly correct: number
  readonly answered: number
  readonly total: number
  readonly at: number // epoch ms
}

const KEY_PREFIX = 'is635-cert-attempts:'
const MAX_KEPT = 20

function storageKey(examId: string): string {
  return `${KEY_PREFIX}${examId}`
}

export function loadAttempts(examId: string): ExamAttempt[] {
  try {
    const raw = localStorage.getItem(storageKey(examId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (a): a is ExamAttempt =>
        a && typeof a.correct === 'number' && typeof a.answered === 'number' && typeof a.total === 'number' && typeof a.at === 'number'
    )
  } catch {
    return []
  }
}

export function saveAttempt(examId: string, attempt: ExamAttempt): ExamAttempt[] {
  const next = [attempt, ...loadAttempts(examId)].slice(0, MAX_KEPT)
  try {
    localStorage.setItem(storageKey(examId), JSON.stringify(next))
  } catch {
    // ignore storage failures (private mode / quota)
  }
  return next
}

export function clearAttempts(examId: string): void {
  try {
    localStorage.removeItem(storageKey(examId))
  } catch {
    // ignore
  }
}
