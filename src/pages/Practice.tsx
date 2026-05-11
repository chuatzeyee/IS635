import { useState, useMemo, useCallback } from 'react'
import { RotateCcw, Shuffle, Trophy, Target, Zap } from 'lucide-react'
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

function ProgressBar({ correct, attempted, total }: { readonly correct: number; readonly attempted: number; readonly total: number }) {
  const pct = total > 0 ? (attempted / total) * 100 : 0
  const correctPct = total > 0 ? (correct / total) * 100 : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-correct">
            <Trophy size={12} />
            {correct} correct
          </span>
          <span className="flex items-center gap-1.5 text-wrong">
            <Target size={12} />
            {attempted - correct} wrong
          </span>
        </div>
        <span className="text-ink-faint">
          {attempted} / {total} answered
        </span>
      </div>
      <div className="h-2 bg-raised rounded-full overflow-hidden border border-edge">
        <div className="h-full relative rounded-full transition-all duration-500 ease-out bg-edge-bright" style={{ width: `${pct}%` }}>
          <div
            className="absolute inset-y-0 left-0 bg-glow/80 rounded-full transition-all duration-500 ease-out"
            style={{ width: correctPct > 0 && pct > 0 ? `${(correctPct / pct) * 100}%` : '0%' }}
          />
        </div>
      </div>
      {attempted > 0 && (
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <Zap size={12} className="text-glow" />
          <span className="text-ink-secondary">
            Accuracy: <span className="text-glow font-semibold">{Math.round((correct / attempted) * 100)}%</span>
          </span>
        </div>
      )}
    </div>
  )
}

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

  const streak = useMemo(() => {
    let current = 0
    for (const q of filtered) {
      const ans = answers.get(q.id)
      if (ans?.revealed) {
        if (ans.selectedIndex === q.correctIndex) {
          current++
        } else {
          current = 0
        }
      }
    }
    return current
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-ink-secondary bg-surface border border-edge rounded-lg hover:bg-raised hover:text-ink hover:border-edge-bright transition-all duration-150 cursor-pointer"
          >
            <Shuffle size={14} />
            Shuffle
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-ink-secondary bg-surface border border-edge rounded-lg hover:bg-raised hover:text-ink hover:border-edge-bright transition-all duration-150 cursor-pointer"
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
            className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-150 cursor-pointer ${
              filter === value
                ? 'bg-glow-dim text-glow border border-glow/30 shadow-[0_0_12px_rgba(74,222,128,0.1)]'
                : 'bg-surface text-ink-secondary border border-edge hover:bg-raised hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-edge rounded-lg px-5 py-4 mb-6">
        <ProgressBar
          correct={score.correct}
          attempted={score.attempted}
          total={filtered.length}
        />
        {streak >= 3 && (
          <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-glow animate-scale-in">
            <Zap size={12} />
            {streak} streak!
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filtered.map((q, idx) => {
          const ans = answers.get(q.id)
          const selected = ans?.selectedIndex ?? null
          const revealed = ans?.revealed ?? false

          return (
            <div
              key={q.id}
              className="bg-surface border border-edge rounded-lg p-5 animate-fade-in"
              style={{ animationDelay: `${Math.min(idx * 40, 400)}ms`, animationFillMode: 'both' }}
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
                    style = 'border border-glow/50 bg-glow-dim text-glow shadow-[0_0_12px_rgba(74,222,128,0.08)]'
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
                      className={`px-4 py-2.5 rounded-lg text-sm text-left transition-all duration-150 cursor-pointer disabled:cursor-default ${style}`}
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
                  className="text-sm text-glow hover:text-glow-hover font-medium disabled:text-ink-faint disabled:cursor-default cursor-pointer transition-colors duration-150"
                >
                  Show Answer
                </button>
              )}

              {revealed && selected === q.correctIndex && (
                <p className="text-sm text-correct font-medium animate-scale-in">
                  Correct!
                </p>
              )}
              {revealed && selected !== q.correctIndex && (
                <p className="text-sm text-wrong font-medium animate-scale-in">
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
