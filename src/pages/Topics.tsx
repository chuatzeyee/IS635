import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { sessions } from '../data/topics'

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
      <p className="text-ink-muted mb-8">
        Key concepts organized by session. Click a session header to
        expand or collapse.
      </p>

      <div className="space-y-3">
        {sessions.map((session) => {
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
              className={`bg-surface border border-edge rounded-lg overflow-hidden border-l-2 ${tabColor}`}
            >
              <button
                onClick={() => toggleSession(session.id)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-raised transition-colors cursor-pointer"
              >
                {isOpen ? (
                  <ChevronDown size={20} className="text-glow flex-shrink-0" />
                ) : (
                  <ChevronRight size={20} className="text-ink-muted flex-shrink-0" />
                )}
                <h2 className="text-lg font-semibold text-ink">
                  {session.title}
                </h2>
                <span className="ml-auto text-xs text-ink-faint font-mono">
                  {session.topics.length} topics
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-edge">
                  <div className="grid gap-4 mt-4">
                    {session.topics.map((topic) => (
                      <div key={topic.title} className="pl-3 border-l border-edge-bright">
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
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
