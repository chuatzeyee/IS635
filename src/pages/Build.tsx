import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Lightbulb, AlertTriangle, Clock } from 'lucide-react'
import { buildPhases } from '../data/buildGuide'
import type { BuildSection, BuildStep } from '../data/buildGuide'

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

function StepCard({ step, stepIndex }: { readonly step: BuildStep; readonly stepIndex: number }) {
  return (
    <div className="pl-4 border-l-2 border-edge">
      <h4 className="text-sm font-medium text-ink flex items-center gap-2 mb-2">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-glow-dim text-glow text-[10px] font-mono font-bold border border-glow/20 flex-shrink-0">
          {stepIndex + 1}
        </span>
        {step.title}
      </h4>
      <ul className="space-y-1 ml-7">
        {step.instructions.map((inst, i) => (
          <li key={i} className="text-sm text-ink-secondary flex items-start gap-2">
            <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-ink-muted" />
            {inst}
          </li>
        ))}
      </ul>
      {step.tip && (
        <div className="mt-2 ml-7 flex items-start gap-2 px-3 py-2 rounded-lg bg-glow-dim/30 border border-glow/15">
          <Lightbulb size={12} className="text-glow flex-shrink-0 mt-0.5" />
          <p className="text-xs text-glow/90 leading-relaxed">{step.tip}</p>
        </div>
      )}
      {step.important && (
        <div className="mt-2 ml-7 flex items-start gap-2 px-3 py-2 rounded-lg bg-[#422006]/40 border border-[#f59e0b]/15">
          <AlertTriangle size={12} className="text-[#fbbf24] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#fbbf24]/90 leading-relaxed">{step.important}</p>
        </div>
      )}
    </div>
  )
}

function SectionCard({ section, index }: { readonly section: BuildSection; readonly index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="bg-surface border border-edge rounded-lg overflow-hidden animate-fade-in"
      style={{ animationDelay: `${Math.min(index * 40, 300)}ms`, animationFillMode: 'both' }}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-raised transition-colors duration-150 cursor-pointer"
      >
        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}>
          <ChevronDown size={16} className={isOpen ? 'text-glow' : 'text-ink-muted'} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-ink">
            <span className="text-glow font-mono mr-2">{section.id}</span>
            {section.title}
          </h3>
          {!isOpen && (
            <p className="text-xs text-ink-muted mt-0.5 truncate">{section.summary}</p>
          )}
        </div>
        <span className="text-xs text-ink-faint font-mono flex-shrink-0">
          {section.steps.length} {section.steps.length === 1 ? 'step' : 'steps'}
        </span>
      </button>

      <AnimatedPanel isOpen={isOpen}>
        <div className="px-5 pb-4 border-t border-edge">
          <p className="text-sm text-ink-secondary mt-3 mb-4 leading-relaxed">
            {section.summary}
          </p>
          <div className="space-y-4">
            {section.steps.map((step, i) => (
              <StepCard key={i} step={step} stepIndex={i} />
            ))}
          </div>
        </div>
      </AnimatedPanel>
    </div>
  )
}

export default function Build() {
  const [activePhase, setActivePhase] = useState(1)

  const phase = buildPhases.find((p) => p.id === activePhase)!

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-ink mb-2 tracking-tight">Build Guide</h1>
      <p className="text-ink-muted mb-6">
        Step-by-step backend build reference for CareConnect on OutSystems.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {buildPhases.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePhase(p.id)}
            className={`px-3.5 py-2 text-sm rounded-lg transition-all duration-150 cursor-pointer border ${
              activePhase === p.id
                ? 'bg-glow-dim text-glow border-glow/25'
                : 'bg-surface text-ink-muted border-edge hover:bg-raised hover:text-ink'
            }`}
          >
            <span className="font-mono text-xs mr-1.5">P{p.id}</span>
            {p.title}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-ink">
          Phase {phase.id}: {phase.title}
        </h2>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-ink-faint font-mono">
            <Clock size={12} />
            {phase.timeEstimate}
          </span>
          <span className="text-xs text-ink-faint font-mono">
            {phase.sections.length} sections
          </span>
        </div>
      </div>

      <p className="text-sm text-ink-secondary mb-6 leading-relaxed">
        {phase.description}
      </p>

      <div className="space-y-3">
        {phase.sections.map((section, idx) => (
          <SectionCard key={section.id} section={section} index={idx} />
        ))}
      </div>
    </div>
  )
}
