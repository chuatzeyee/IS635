import { useState, useEffect, useCallback, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { certQuestions, certDomains } from '../data/certQuestions'

const domainLabel = new Map(certDomains.map((d) => [d.key, d.label]))

type DomainFilter = 'all' | string

const filters: readonly { readonly label: string; readonly value: DomainFilter }[] = [
  { label: 'All', value: 'all' },
  ...certDomains.map((d) => ({ label: d.label, value: d.key })),
]

const AUTO_ADVANCE_MS = 5000

export default function CertCards() {
  const [filter, setFilter] = useState<DomainFilter>('all')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [autoAdvance, setAutoAdvance] = useState(true)

  const cards = useMemo(
    () => (filter === 'all' ? certQuestions : certQuestions.filter((c) => c.domain === filter)),
    [filter]
  )
  const total = cards.length
  const safeIndex = Math.min(index, Math.max(0, total - 1))
  const q = cards[safeIndex]

  const go = useCallback(
    (delta: number) => {
      setIndex((prev) => {
        const next = Math.min(total - 1, Math.max(0, prev + delta))
        if (next !== prev) {
          setSelected(null)
          setRevealed(false)
        }
        return next
      })
    },
    [total]
  )

  const pick = useCallback(
    (optionIndex: number) => {
      if (!q || optionIndex < 0 || optionIndex >= q.options.length) return
      setSelected(optionIndex)
      setRevealed(true)
    },
    [q]
  )

  const handleFilter = (value: DomainFilter) => {
    setFilter(value)
    setIndex(0)
    setSelected(null)
    setRevealed(false)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key >= '1' && e.key <= '4') pick(Number(e.key) - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, pick])

  // Auto-advance 8s AFTER the card is answered; stops on the last card.
  useEffect(() => {
    if (!autoAdvance || !revealed || total === 0 || safeIndex >= total - 1) return
    const timer = setTimeout(() => go(1), AUTO_ADVANCE_MS)
    return () => clearTimeout(timer)
  }, [autoAdvance, revealed, safeIndex, total, go])

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {filters.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => handleFilter(value)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-150 cursor-pointer ${
              filter === value
                ? 'bg-glow-dim text-glow border border-glow/30 shadow-[0_0_12px_rgba(74,222,128,0.1)]'
                : 'bg-surface text-ink-secondary border border-edge hover:bg-raised hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-ink-muted font-mono">
          <kbd className="px-1.5 py-0.5 bg-raised border border-edge rounded text-ink-secondary">1</kbd>–
          <kbd className="px-1.5 py-0.5 bg-raised border border-edge rounded text-ink-secondary">4</kbd> answer ·{' '}
          <kbd className="px-1.5 py-0.5 bg-raised border border-edge rounded text-ink-secondary">←</kbd>
          <kbd className="px-1.5 py-0.5 bg-raised border border-edge rounded text-ink-secondary">→</kbd> navigate
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoAdvance((p) => !p)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-all duration-150 cursor-pointer ${
              autoAdvance
                ? 'bg-glow-dim text-glow border-glow/30'
                : 'bg-surface text-ink-secondary border-edge hover:bg-raised hover:text-ink'
            }`}
            title="Auto-advance every 5 seconds"
          >
            {autoAdvance ? <Pause size={12} /> : <Play size={12} />}
            Auto 5s
          </button>
          <span className="text-xs text-ink-faint font-mono">
            {total === 0 ? '0 / 0' : `${safeIndex + 1} / ${total}`}
          </span>
        </div>
      </div>

      <div className="h-1 bg-raised rounded-full overflow-hidden border border-edge mb-6">
        <div
          className="h-full bg-glow/70 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${total === 0 ? 0 : ((safeIndex + 1) / total) * 100}%` }}
        />
      </div>

      {!q ? (
        <div className="bg-surface border border-edge rounded-xl p-8 min-h-[40vh] flex items-center justify-center">
          <p className="text-sm text-ink-muted">No questions in this category.</p>
        </div>
      ) : (
      <div
        key={q.id}
        className="bg-surface border border-edge rounded-xl p-8 min-h-[60vh] animate-fade-in flex flex-col"
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

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => go(-1)}
          disabled={safeIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-ink-secondary bg-surface border border-edge rounded-lg hover:bg-raised hover:text-ink hover:border-edge-bright transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-default"
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="text-sm text-glow hover:text-glow-hover font-medium cursor-pointer transition-colors duration-150"
          >
            Reveal answer
          </button>
        ) : (
          <span className="text-xs text-ink-faint font-mono">answered</span>
        )}

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
