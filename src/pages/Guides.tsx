import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { guides } from '../data/guides'

function AnimatedPanel({ isOpen, children }: { readonly isOpen: boolean; readonly children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(isOpen ? undefined : 0)

  useEffect(() => {
    if (!ref.current) return
    if (isOpen) {
      setHeight(ref.current.scrollHeight)
      const timer = setTimeout(() => setHeight(undefined), 250)
      return () => clearTimeout(timer)
    } else {
      setHeight(ref.current.scrollHeight)
      requestAnimationFrame(() => setHeight(0))
    }
  }, [isOpen])

  return (
    <div
      style={{ height: height === undefined ? 'auto' : height, overflow: 'hidden' }}
      className="transition-[height,opacity] duration-250 ease-in-out"
    >
      <div ref={ref} className={isOpen ? 'opacity-100' : 'opacity-0'} style={{ transition: 'opacity 0.2s ease-in-out' }}>
        {children}
      </div>
    </div>
  )
}

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
              className="bg-surface border border-edge rounded-lg overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
            >
              <button
                onClick={() => toggleGuide(guide.id)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-raised transition-colors duration-150 cursor-pointer"
              >
                <div className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}>
                  <ChevronDown size={18} className={isOpen ? 'text-glow' : 'text-ink-muted'} />
                </div>
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

              <AnimatedPanel isOpen={isOpen}>
                <div className="px-5 pb-5 border-t border-edge">
                  <ol className="mt-4 space-y-2">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-glow-dim text-glow text-xs font-semibold flex items-center justify-center mt-0.5 font-mono border border-glow/20">
                          {i + 1}
                        </span>
                        <span className="text-ink-secondary leading-relaxed">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </AnimatedPanel>
            </div>
          )
        })}
      </div>
    </div>
  )
}
