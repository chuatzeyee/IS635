import { useState, useMemo, useCallback } from 'react'
import { RotateCcw, Shuffle } from 'lucide-react'
import { questions } from '../data/questions'

type SessionFilter = 'all' | 1 | 2 | 3 | 4 | 5

interface AnswerState {
  readonly selectedIndex: number | null
  readonly revealed: boolean
}

function shuffleArray<T>(arr: readonly T[]): readonly T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const sessionFilters: readonly { readonly label: string; readonly value: SessionFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Session 1', value: 1 },
  { label: 'Session 2', value: 2 },
  { label: 'Session 3', value: 3 },
  { label: 'Session 4', value: 4 },
  { label: 'Session 5', value: 5 },
]

export default function Practice() {
  const [filter, setFilter] = useState<SessionFilter>('all')
  const [order, setOrder] = useState<readonly number[]>([])
  const [answers, setAnswers] = useState<ReadonlyMap<number, AnswerState>>(
    () => new Map()
  )

  const filtered = useMemo(() => {
    const base =
      filter === 'all'
        ? questions
        : questions.filter((q) => q.session === filter)

    if (order.length > 0) {
      const idSet = new Set(base.map((q) => q.id))
      const validOrder = order.filter((id) => idSet.has(id))
      const lookup = new Map(base.map((q) => [q.id, q]))
      return validOrder.map((id) => lookup.get(id)!).filter(Boolean)
    }

    return base
  }, [filter, order])

  const score = useMemo(() => {
    let correct = 0
    let attempted = 0
    for (const q of filtered) {
      const ans = answers.get(q.id)
      if (ans?.revealed) {
        attempted++
        if (ans.selectedIndex === q.correctIndex) {
          correct++
        }
      }
    }
    return { correct, attempted }
  }, [filtered, answers])

  const handleSelect = useCallback((questionId: number, optionIndex: number) => {
    setAnswers((prev) => {
      const existing = prev.get(questionId)
      if (existing?.revealed) return prev
      const next = new Map(prev)
      next.set(questionId, { selectedIndex: optionIndex, revealed: false })
      return next
    })
  }, [])

  const handleReveal = useCallback((questionId: number) => {
    setAnswers((prev) => {
      const existing = prev.get(questionId)
      if (!existing || existing.selectedIndex === null) return prev
      const next = new Map(prev)
      next.set(questionId, { ...existing, revealed: true })
      return next
    })
  }, [])

  const handleReset = () => {
    setAnswers(new Map())
    setOrder([])
  }

  const handleShuffle = () => {
    const base =
      filter === 'all'
        ? questions
        : questions.filter((q) => q.session === filter)
    setOrder(shuffleArray(base.map((q) => q.id)))
    setAnswers(new Map())
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-ink tracking-tight">Practice</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-ink-secondary bg-surface border border-edge rounded-lg hover:bg-raised hover:text-ink transition-colors cursor-pointer"
          >
            <Shuffle size={14} />
            Shuffle
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-ink-secondary bg-surface border border-edge rounded-lg hover:bg-raised hover:text-ink transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      <p className="text-ink-muted mb-6">
        Test your knowledge with interactive questions. Select an answer,
        then reveal the correct one.
      </p>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {sessionFilters.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => {
              setFilter(value)
              setOrder([])
              setAnswers(new Map())
            }}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${
              filter === value
                ? 'bg-glow-dim text-glow border border-glow/30'
                : 'bg-surface text-ink-secondary border border-edge hover:bg-raised hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-edge rounded-lg px-5 py-3 mb-6 flex items-center justify-between">
        <span className="text-sm text-ink-secondary">
          Score:{' '}
          <span className="font-semibold text-glow font-mono">
            {score.correct}
          </span>{' '}
          / {score.attempted} answered
        </span>
        <span className="text-xs text-ink-faint font-mono">
          {filtered.length} questions
        </span>
      </div>

      <div className="space-y-4">
        {filtered.map((q, idx) => {
          const ans = answers.get(q.id)
          const selected = ans?.selectedIndex ?? null
          const revealed = ans?.revealed ?? false

          return (
            <div
              key={q.id}
              className="bg-surface border border-edge rounded-lg p-5"
            >
              <p className="text-sm font-semibold text-ink mb-3">
                <span className="text-ink-faint mr-2 font-mono">{idx + 1}.</span>
                {q.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {q.options.map((option, oi) => {
                  let style =
                    'border border-edge text-ink-secondary hover:border-glow/30 hover:bg-raised'

                  if (selected === oi && !revealed) {
                    style = 'border border-glow/50 bg-glow-dim text-glow'
                  } else if (revealed) {
                    if (oi === q.correctIndex) {
                      style =
                        'border border-correct/50 bg-correct-dim text-correct'
                    } else if (oi === selected && oi !== q.correctIndex) {
                      style =
                        'border border-wrong/50 bg-wrong-dim text-wrong'
                    } else {
                      style = 'border border-edge/50 text-ink-faint'
                    }
                  }

                  return (
                    <button
                      key={oi}
                      onClick={() => handleSelect(q.id, oi)}
                      disabled={revealed}
                      className={`px-4 py-2.5 rounded-lg text-sm text-left transition-colors cursor-pointer disabled:cursor-default ${style}`}
                    >
                      <span className="font-medium mr-2 font-mono">
                        {String.fromCharCode(65 + oi)}.
                      </span>
                      {option}
                    </button>
                  )
                })}
              </div>

              {!revealed && (
                <button
                  onClick={() => handleReveal(q.id)}
                  disabled={selected === null}
                  className="text-sm text-glow hover:text-glow-hover font-medium disabled:text-ink-faint disabled:cursor-default cursor-pointer"
                >
                  Show Answer
                </button>
              )}

              {revealed && selected === q.correctIndex && (
                <p className="text-sm text-correct font-medium">
                  Correct!
                </p>
              )}
              {revealed && selected !== q.correctIndex && (
                <p className="text-sm text-wrong font-medium">
                  Incorrect. The correct answer is{' '}
                  {String.fromCharCode(65 + q.correctIndex)}.{' '}
                  {q.options[q.correctIndex]}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
