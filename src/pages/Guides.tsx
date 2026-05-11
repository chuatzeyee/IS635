import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { guides } from '../data/guides'

export default function Guides() {
  const [openGuides, setOpenGuides] = useState<ReadonlySet<string>>(
    () => new Set<string>()
  )

  const toggleGuide = (id: string) => {
    setOpenGuides((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-ink mb-2 tracking-tight">Guides</h1>
      <p className="text-ink-muted mb-8">
        Step-by-step how-to guides for common OutSystems tasks.
      </p>

      <div className="space-y-3">
        {guides.map((guide, index) => {
          const isOpen = openGuides.has(guide.id)
          return (
            <div
              key={guide.id}
              className="bg-surface border border-edge rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleGuide(guide.id)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-raised transition-colors cursor-pointer"
              >
                {isOpen ? (
                  <ChevronDown size={18} className="text-glow flex-shrink-0" />
                ) : (
                  <ChevronRight size={18} className="text-ink-muted flex-shrink-0" />
                )}
                <span className="text-xs font-mono text-ink-faint w-5">
                  {index + 1}.
                </span>
                <h2 className="text-sm font-semibold text-ink">
                  {guide.title}
                </h2>
                <span className="ml-auto text-xs text-ink-faint font-mono">
                  {guide.steps.length} steps
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-edge">
                  <ol className="mt-4 space-y-2">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-glow-dim text-glow text-xs font-semibold flex items-center justify-center mt-0.5 font-mono">
                          {i + 1}
                        </span>
                        <span className="text-ink-secondary leading-relaxed">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
