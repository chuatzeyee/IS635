import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { certNotes } from '../data/certNotes'
import { NoteBlock } from '../components/NoteBlock'

export default function CertSlides() {
  const [index, setIndex] = useState(0)
  const total = certNotes.length

  const go = useCallback(
    (delta: number) => {
      setIndex((prev) => Math.min(total - 1, Math.max(0, prev + delta)))
    },
    [total]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const note = certNotes[index]

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-ink-muted font-mono">
          Use <kbd className="px-1.5 py-0.5 bg-raised border border-edge rounded text-ink-secondary">←</kbd>{' '}
          <kbd className="px-1.5 py-0.5 bg-raised border border-edge rounded text-ink-secondary">→</kbd> to navigate
        </p>
        <span className="text-xs text-ink-faint font-mono">
          {index + 1} / {total}
        </span>
      </div>

      <div className="h-1 bg-raised rounded-full overflow-hidden border border-edge mb-6">
        <div
          className="h-full bg-glow/70 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <div
        key={note.id}
        className="bg-surface border border-edge rounded-xl p-8 min-h-[60vh] animate-fade-in flex flex-col"
      >
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-xs font-mono text-glow">{String(index + 1).padStart(2, '0')}</span>
          <h1 className="text-2xl font-bold text-ink tracking-tight">{note.title}</h1>
        </div>
        <p className="text-sm text-ink-muted mb-6 leading-relaxed">{note.summary}</p>

        <div className="space-y-4 flex-1">
          {note.blocks.map((block, i) => (
            <NoteBlock key={i} block={block} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-ink-secondary bg-surface border border-edge rounded-lg hover:bg-raised hover:text-ink hover:border-edge-bright transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-default"
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        <div className="flex items-center gap-1.5">
          {certNotes.map((n, i) => (
            <button
              key={n.id}
              onClick={() => setIndex(i)}
              aria-label={n.title}
              className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                i === index ? 'w-6 bg-glow' : 'w-1.5 bg-edge hover:bg-edge-bright'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          disabled={index === total - 1}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-ink-secondary bg-surface border border-edge rounded-lg hover:bg-raised hover:text-ink hover:border-edge-bright transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-default"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
