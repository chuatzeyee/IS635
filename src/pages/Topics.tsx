import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { sessions } from '../data/topics'

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

export default function Topics() {
  const [openSessions, setOpenSessions] = useState<ReadonlySet<number>>(
    () => new Set(sessions.map((s) => s.id))
  )

  const toggleSession = (id: number) => {
    setOpenSessions((prev) => {
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
      <h1 className="text-3xl font-bold text-ink mb-2 tracking-tight">Topics</h1>
      <p className="text-ink-muted mb-4">
        Key concepts organized by session. Click a session header to
        expand or collapse.
      </p>

      <div className="flex gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setOpenSessions(new Set(sessions.map((s) => s.id)))}
          className="px-3 py-1.5 text-xs font-mono rounded-lg bg-surface border border-edge text-ink-secondary hover:bg-raised hover:text-ink transition-colors cursor-pointer"
        >
          Expand All
        </button>
        <button
          onClick={() => setOpenSessions(new Set())}
          className="px-3 py-1.5 text-xs font-mono rounded-lg bg-surface border border-edge text-ink-secondary hover:bg-raised hover:text-ink transition-colors cursor-pointer"
        >
          Collapse All
        </button>
      </div>

      <div className="space-y-3">
        {sessions.map((session, idx) => {
          const isOpen = openSessions.has(session.id)
          const tabColor = [
            'border-l-s1',
            'border-l-s2',
            'border-l-s3',
            'border-l-s4',
            'border-l-s5',
          ][session.id - 1] ?? 'border-l-glow'

          return (
            <div
              key={session.id}
              className={`bg-surface border border-edge rounded-lg overflow-hidden border-l-2 ${tabColor} animate-fade-in`}
              style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
            >
              <button
                onClick={() => toggleSession(session.id)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-raised transition-colors duration-150 cursor-pointer"
              >
                <div className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}>
                  <ChevronDown size={20} className={isOpen ? 'text-glow' : 'text-ink-muted'} />
                </div>
                <h2 className="text-lg font-semibold text-ink">
                  {session.title}
                </h2>
                <span className="ml-auto text-xs text-ink-faint font-mono">
                  {session.topics.length} topics
                </span>
              </button>

              <AnimatedPanel isOpen={isOpen}>
                <div className="px-5 pb-5 border-t border-edge">
                  <div className="grid gap-4 mt-4">
                    {session.topics.map((topic, ti) => (
                      <div
                        key={topic.title}
                        className="pl-3 border-l border-edge-bright hover:border-glow/40 transition-colors duration-150"
                        style={{ animationDelay: `${ti * 30}ms` }}
                      >
                        <h3 className="text-sm font-semibold text-ink mb-1">
                          {topic.title}
                        </h3>
                        <ul className="space-y-0.5">
                          {topic.points.map((point, i) => (
                            <li
                              key={i}
                              className="text-sm text-ink-secondary flex items-start gap-2"
                            >
                              <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-glow/50" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedPanel>
            </div>
          )
        })}
      </div>
    </div>
  )
}
