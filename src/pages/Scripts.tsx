import { useState, useRef, useEffect } from 'react'
import { ChevronDown, User, Clock } from 'lucide-react'
import { scripts } from '../data/scripts'

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

export default function Scripts() {
  const [openDoc, setOpenDoc] = useState<string>(scripts[0]?.id ?? '')

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-ink mb-2 tracking-tight">Presentation Scripts</h1>
      <p className="text-ink-muted mb-8">
        Speaker scripts for the CareConnect term-project presentation. Speak the why, point at the diagram.
      </p>

      <div className="flex gap-2 mb-6">
        {scripts.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setOpenDoc(doc.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer border ${
              openDoc === doc.id
                ? 'bg-glow-dim text-glow border-glow/30'
                : 'bg-surface text-ink-muted border-edge hover:bg-raised'
            }`}
          >
            {doc.title}
          </button>
        ))}
      </div>

      {scripts
        .filter((doc) => doc.id === openDoc)
        .map((doc) => (
          <div key={doc.id}>
            <p className="text-xs font-mono text-ink-faint mb-5">{doc.subtitle}</p>
            <div className="space-y-3">
              {doc.slides.map((s, index) => (
                <SlideCard key={s.slide} slide={s} index={index} />
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}

function SlideCard({
  slide,
  index,
}: {
  readonly slide: (typeof scripts)[number]['slides'][number]
  readonly index: number
}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div
      className="bg-surface border border-edge rounded-lg overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
    >
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-raised transition-colors duration-150 cursor-pointer"
      >
        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}>
          <ChevronDown size={18} className={isOpen ? 'text-glow' : 'text-ink-muted'} />
        </div>
        <h2 className="text-sm font-semibold text-ink">{slide.slide}</h2>
        <span className="ml-auto flex items-center gap-3">
          {slide.speaker && (
            <span className="flex items-center gap-1 text-xs text-ink-faint font-mono">
              <User size={12} /> {slide.speaker}
            </span>
          )}
          {slide.time && (
            <span className="flex items-center gap-1 text-xs text-ink-faint font-mono">
              <Clock size={12} /> {slide.time}
            </span>
          )}
        </span>
      </button>

      <AnimatedPanel isOpen={isOpen}>
        <div className="px-5 pb-5 border-t border-edge">
          <ul className="mt-4 space-y-3">
            {slide.lines.map((line, i) => (
              <li key={i} className="text-sm text-ink-secondary leading-relaxed pl-4 border-l-2 border-edge">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </AnimatedPanel>
    </div>
  )
}
