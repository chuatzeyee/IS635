import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, ChevronDown, Check, Trophy, RotateCcw, Flag, History } from 'lucide-react'
import { certQuestions, certDomains } from '../data/certQuestions'
import type { CertQuestion } from '../data/certQuestions'
import { shuffleAllOptions } from '../data/shuffleOptions'
import { useFocusMode } from '../components/FocusMode'
import { loadAttempts, saveAttempt, clearAttempts } from '../data/examScores'
import type { ExamAttempt } from '../data/examScores'

const domainLabel = new Map(certDomains.map((d) => [d.key, d.label]))

const AUTO_ADVANCE_MS = 5000

function formatWhen(ms: number): string {
  const d = new Date(ms)
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function CertCards({
  questions = certQuestions,
  examId = 'cert-1',
}: {
  readonly questions?: readonly CertQuestion[]
  readonly examId?: string
}) {
  const [selectedDomains, setSelectedDomains] = useState<ReadonlySet<string>>(() => new Set())
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<ReadonlyMap<number, number>>(() => new Map())
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [showSummary, setShowSummary] = useState(false)
  const [attempts, setAttempts] = useState<readonly ExamAttempt[]>(() => loadAttempts(examId))
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { chromeVisible, activate } = useFocusMode()

  // Activate auto-hide chrome while this view is mounted.
  useEffect(() => activate(), [activate])

  // Shuffle option order once per page load.
  const pool = useMemo(() => shuffleAllOptions(questions), [questions])
  const cards = useMemo(
    () => (selectedDomains.size === 0 ? pool : pool.filter((c) => selectedDomains.has(c.domain))),
    [selectedDomains, pool]
  )
  const total = cards.length
  const safeIndex = Math.min(index, Math.max(0, total - 1))
  const q = cards[safeIndex]

  const selected = q ? answers.get(q.id) ?? null : null
  const revealed = selected !== null

  // Live score over the current (filtered) card set.
  const score = useMemo(() => {
    let correct = 0
    let answered = 0
    for (const c of cards) {
      const a = answers.get(c.id)
      if (a !== undefined) {
        answered++
        if (a === c.correctIndex) correct++
      }
    }
    return { correct, answered }
  }, [cards, answers])

  const wrongCards = useMemo(
    () => cards.filter((c) => { const a = answers.get(c.id); return a !== undefined && a !== c.correctIndex }),
    [cards, answers]
  )

  const finish = useCallback(() => {
    if (score.answered > 0) {
      const attempt: ExamAttempt = { correct: score.correct, answered: score.answered, total, at: Date.now() }
      setAttempts(saveAttempt(examId, attempt))
    }
    setShowSummary(true)
  }, [score, total, examId])

  const restart = useCallback(() => {
    setAnswers(new Map())
    setIndex(0)
    setShowSummary(false)
  }, [])

  const go = useCallback(
    (delta: number) => {
      setIndex((prev) => Math.min(total - 1, Math.max(0, prev + delta)))
    },
    [total]
  )

  const pick = useCallback(
    (optionIndex: number) => {
      if (!q || optionIndex < 0 || optionIndex >= q.options.length) return
      setAnswers((prev) => {
        if (prev.has(q.id)) return prev
        const next = new Map(prev)
        next.set(q.id, optionIndex)
        return next
      })
    },
    [q]
  )

  const toggleDomain = (key: string) => {
    setSelectedDomains((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
    setIndex(0)
  }

  const clearDomains = () => {
    setSelectedDomains(new Set())
    setIndex(0)
  }

  // Close dropdown on outside click.
  useEffect(() => {
    if (!dropdownOpen) return
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [dropdownOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key >= '1' && e.key <= '4') pick(Number(e.key) - 1)
      else if (e.key === ' ') {
        e.preventDefault()
        setAutoAdvance((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, pick])

  // Auto-advance AFTER the card is answered; stops on the last card.
  useEffect(() => {
    if (!autoAdvance || !revealed || total === 0 || safeIndex >= total - 1) return
    const timer = setTimeout(() => go(1), AUTO_ADVANCE_MS)
    return () => clearTimeout(timer)
  }, [autoAdvance, revealed, safeIndex, total, go])

  const filterLabel =
    selectedDomains.size === 0
      ? 'All categories'
      : selectedDomains.size === 1
        ? domainLabel.get([...selectedDomains][0]) ?? '1 category'
        : `${selectedDomains.size} categories`

  const chromeCls = `transition-opacity duration-500 ${chromeVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`
  const countingDown = autoAdvance && revealed && total > 0 && safeIndex < total - 1

  if (showSummary) {
    const pct = score.answered > 0 ? Math.round((score.correct / score.answered) * 100) : 0
    const hasAttempt = score.answered > 0
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-surface border border-edge rounded-xl p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={22} className="text-glow" />
            <h1 className="text-2xl font-bold text-ink tracking-tight">{hasAttempt ? 'Results' : 'History'}</h1>
          </div>
          <p className="text-ink-muted mb-6">
            {filterLabel} · {examId === 'cert-2' ? 'Exam 2' : 'Exam 1'}
          </p>

          {hasAttempt && (
            <>
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-raised border border-edge rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-glow">{pct}%</div>
                  <div className="text-xs text-ink-muted mt-1 font-mono">accuracy</div>
                </div>
                <div className="bg-raised border border-edge rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-correct">{score.correct}</div>
                  <div className="text-xs text-ink-muted mt-1 font-mono">correct</div>
                </div>
                <div className="bg-raised border border-edge rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-wrong">{score.answered - score.correct}</div>
                  <div className="text-xs text-ink-muted mt-1 font-mono">wrong</div>
                </div>
              </div>
              <p className="text-xs text-ink-faint font-mono mb-8">
                Answered {score.answered} of {total} · {total - score.answered} skipped
              </p>
            </>
          )}

          <div className="flex items-center gap-2 mb-8">
            <button
              onClick={restart}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-glow-dim text-glow border border-glow/30 hover:bg-glow-dim/70 transition-all duration-150 cursor-pointer"
            >
              <RotateCcw size={15} />
              {hasAttempt ? 'Retake' : 'Start'}
            </button>
            <button
              onClick={() => setShowSummary(false)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-surface text-ink-secondary border border-edge hover:bg-raised hover:text-ink transition-all duration-150 cursor-pointer"
            >
              Back to cards
            </button>
          </div>

          {/* Wrong questions for quick review */}
          {wrongCards.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
                Review — {wrongCards.length} wrong
              </h2>
              <div className="space-y-3">
                {wrongCards.map((c) => {
                  const yourPick = answers.get(c.id)
                  return (
                    <div key={c.id} className="bg-raised border border-wrong/30 rounded-lg p-4">
                      <div className="mb-2">
                        <span className="inline-block px-2 py-0.5 text-[11px] font-mono rounded bg-glow-dim/40 text-glow border border-glow/15">
                          {domainLabel.get(c.domain) ?? c.domain}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-ink mb-2">{c.question}</p>
                      <p className="text-xs text-wrong mb-1">
                        Your answer: {yourPick !== undefined ? `${yourPick + 1}. ${c.options[yourPick]}` : '—'}
                      </p>
                      <p className="text-xs text-correct mb-2">
                        Correct: {c.correctIndex + 1}. {c.options[c.correctIndex]}
                      </p>
                      {c.explanation && (
                        <p className="text-xs text-ink-secondary bg-base/60 border border-edge rounded px-2.5 py-1.5">
                          <span className="font-semibold text-ink">Why: </span>
                          {c.explanation}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            score.answered > 0 && (
              <p className="text-sm text-correct mb-8">Perfect — no wrong answers in this set!</p>
            )
          )}

          {/* Past attempts */}
          {attempts.length === 0 ? (
            <p className="text-sm text-ink-muted">No saved attempts yet. Finish a run to record your score here.</p>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-ink">Past attempts</h2>
                <button
                  onClick={() => { clearAttempts(examId); setAttempts([]) }}
                  className="text-xs text-ink-faint hover:text-wrong transition-colors cursor-pointer"
                >
                  Clear history
                </button>
              </div>
              <div className="space-y-1.5">
                {attempts.map((a, i) => {
                  const apct = a.answered > 0 ? Math.round((a.correct / a.answered) * 100) : 0
                  return (
                    <div key={i} className="flex items-center justify-between text-xs font-mono bg-raised border border-edge rounded-lg px-3 py-2">
                      <span className="text-ink-muted">{formatWhen(a.at)}</span>
                      <span className="text-ink-secondary">
                        <span className="text-correct">{a.correct}</span>/{a.answered}
                        <span className="text-glow ml-2">{apct}%</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className={`flex items-center justify-between gap-3 mb-4 flex-wrap ${chromeCls}`}>
        {/* Multi-select category dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-surface text-ink-secondary border border-edge hover:bg-raised hover:text-ink transition-all duration-150 cursor-pointer"
          >
            {filterLabel}
            <ChevronDown size={13} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 mt-1 w-56 z-20 bg-base border border-edge-bright rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.4)] p-1 animate-scale-in">
              <button
                onClick={clearDomains}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md text-ink-secondary hover:bg-raised hover:text-ink transition-colors cursor-pointer"
              >
                <span className={`w-3.5 h-3.5 flex items-center justify-center rounded border ${selectedDomains.size === 0 ? 'bg-glow border-glow text-base' : 'border-edge'}`}>
                  {selectedDomains.size === 0 && <Check size={10} />}
                </span>
                All categories
              </button>
              <div className="h-px bg-edge my-1" />
              {certDomains.map((d) => {
                const on = selectedDomains.has(d.key)
                return (
                  <button
                    key={d.key}
                    onClick={() => toggleDomain(d.key)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md text-ink-secondary hover:bg-raised hover:text-ink transition-colors cursor-pointer"
                  >
                    <span className={`w-3.5 h-3.5 flex items-center justify-center rounded border ${on ? 'bg-glow border-glow text-base' : 'border-edge'}`}>
                      {on && <Check size={10} />}
                    </span>
                    {d.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoAdvance((p) => !p)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-all duration-150 cursor-pointer ${
              autoAdvance
                ? 'bg-glow-dim text-glow border-glow/30'
                : 'bg-surface text-ink-secondary border-edge hover:bg-raised hover:text-ink'
            }`}
            title="Auto-advance every 5 seconds after answering"
          >
            {autoAdvance ? <Pause size={12} /> : <Play size={12} />}
            Auto 5s
          </button>
          <span className="text-xs font-mono text-ink-secondary">
            <span className="text-correct">{score.correct}</span>
            <span className="text-ink-faint">/</span>
            <span className="text-ink-secondary">{score.answered}</span>
            {score.answered > 0 && (
              <span className="text-glow ml-1">({Math.round((score.correct / score.answered) * 100)}%)</span>
            )}
          </span>
          <span className="text-xs text-ink-faint font-mono">
            {total === 0 ? '0 / 0' : `${safeIndex + 1} / ${total}`}
          </span>
          <button
            onClick={finish}
            disabled={score.answered === 0}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-edge bg-surface text-ink-secondary hover:bg-raised hover:text-ink transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-default"
            title="Finish and review score"
          >
            <Flag size={12} />
            Finish
          </button>
          <button
            onClick={() => setShowSummary(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-edge bg-surface text-ink-secondary hover:bg-raised hover:text-ink transition-all duration-150 cursor-pointer"
            title="View attempt history"
          >
            <History size={12} />
            History
          </button>
        </div>
      </div>

      <div className={`mb-4 ${chromeCls}`}>
        <p className="text-xs text-ink-muted font-mono">
          <kbd className="px-1.5 py-0.5 bg-raised border border-edge rounded text-ink-secondary">1</kbd>–
          <kbd className="px-1.5 py-0.5 bg-raised border border-edge rounded text-ink-secondary">4</kbd> answer ·{' '}
          <kbd className="px-1.5 py-0.5 bg-raised border border-edge rounded text-ink-secondary">←</kbd>
          <kbd className="px-1.5 py-0.5 bg-raised border border-edge rounded text-ink-secondary">→</kbd> navigate ·{' '}
          <kbd className="px-1.5 py-0.5 bg-raised border border-edge rounded text-ink-secondary">Enter</kbd> next ·{' '}
          <kbd className="px-1.5 py-0.5 bg-raised border border-edge rounded text-ink-secondary">Space</kbd> pause
        </p>
      </div>

      {/* Progress: animated countdown bar when auto-advancing, else position bar */}
      <div className="h-1 bg-raised rounded-full overflow-hidden border border-edge mb-6">
        {countingDown ? (
          <div
            key={q ? `countdown-${q.id}` : 'countdown'}
            className="h-full bg-glow rounded-full animate-progress-fill"
          />
        ) : (
          <div
            className="h-full bg-glow/70 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${total === 0 ? 0 : ((safeIndex + 1) / total) * 100}%` }}
          />
        )}
      </div>

      {!q ? (
        <div className="bg-surface border border-edge rounded-xl p-8 min-h-[40vh] flex items-center justify-center">
          <p className="text-sm text-ink-muted">No questions in this category.</p>
        </div>
      ) : (
      <div
        key={q.id}
        className={`border rounded-xl p-8 min-h-[60vh] animate-fade-in flex flex-col transition-colors duration-300 ${
          !revealed
            ? 'bg-surface border-edge'
            : selected === q.correctIndex
              ? 'bg-correct-dim border-correct/40'
              : 'bg-wrong-dim border-wrong/40'
        }`}
      >
        <div className="mb-4">
          <span className="inline-block px-2.5 py-1 text-xs font-mono rounded-md bg-glow-dim/50 text-glow border border-glow/15">
            {domainLabel.get(q.domain) ?? q.domain}
          </span>
        </div>

        <h1 className="text-xl font-semibold text-ink leading-snug mb-6">{q.question}</h1>

        <div className="grid grid-cols-1 gap-2.5 flex-1 content-start">
          {q.options.map((option, oi) => {
            let style = 'border-edge text-ink-secondary hover:border-glow/30 hover:bg-raised'
            if (revealed) {
              if (oi === q.correctIndex) {
                style = 'border-correct/50 bg-correct-dim text-correct'
              } else if (oi === selected) {
                style = 'border-wrong/50 bg-wrong-dim text-wrong'
              } else {
                style = 'border-edge/50 text-ink-faint'
              }
            } else if (selected === oi) {
              style = 'border-glow/50 bg-glow-dim text-glow'
            }

            return (
              <button
                key={oi}
                onClick={() => pick(oi)}
                disabled={revealed}
                className={`flex items-start gap-3 px-4 py-3 rounded-lg text-left text-sm border transition-all duration-150 cursor-pointer disabled:cursor-default ${style}`}
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-md bg-base/60 border border-edge text-xs font-mono font-bold flex items-center justify-center">
                  {oi + 1}
                </span>
                <span className="pt-0.5">{option}</span>
              </button>
            )
          })}
        </div>

        {revealed && (
          <div className="mt-5 animate-scale-in">
            {selected === q.correctIndex ? (
              <p className="text-sm text-correct font-medium mb-2">Correct!</p>
            ) : (
              <p className="text-sm text-wrong font-medium mb-2">
                Incorrect — correct answer is {q.correctIndex + 1}. {q.options[q.correctIndex]}
              </p>
            )}
            {q.explanation && (
              <p className="text-sm text-ink-secondary bg-raised border border-edge rounded-lg px-3 py-2">
                <span className="font-semibold text-ink">Why: </span>
                {q.explanation}
              </p>
            )}
          </div>
        )}
      </div>
      )}

      <div className={`flex items-center justify-between mt-6 ${chromeCls}`}>
        <button
          onClick={() => go(-1)}
          disabled={safeIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-ink-secondary bg-surface border border-edge rounded-lg hover:bg-raised hover:text-ink hover:border-edge-bright transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-default"
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        <span className="text-xs text-ink-faint font-mono">
          {revealed ? 'answered' : 'pick 1–4'}
        </span>

        <button
          onClick={() => go(1)}
          disabled={total === 0 || safeIndex === total - 1}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-ink-secondary bg-surface border border-edge rounded-lg hover:bg-raised hover:text-ink hover:border-edge-bright transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-default"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
