import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { definitions } from '../data/definitions'

export default function Definitions() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const lower = query.toLowerCase().trim()
    if (!lower) return definitions
    return definitions.filter(
      (d) =>
        d.term.toLowerCase().includes(lower) ||
        d.description.toLowerCase().includes(lower)
    )
  }, [query])

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-ink mb-2 tracking-tight">Definitions</h1>
      <p className="text-ink-muted mb-6">
        Searchable glossary of OutSystems terms and concepts.
      </p>

      <div className="relative mb-8">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="text"
          placeholder="Search terms..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-raised border border-edge rounded-lg text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-glow/50 focus:border-glow/50"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-ink-muted py-12">
          No matching terms found.
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((def) => (
            <div
              key={def.term}
              className="bg-surface border border-edge rounded-lg px-5 py-4 hover:border-edge-bright transition-colors"
            >
              <dt className="text-sm font-semibold text-glow mb-1 font-mono">
                {def.term}
              </dt>
              <dd className="text-sm text-ink-secondary leading-relaxed">
                {def.description}
              </dd>
            </div>
          ))}
          <p className="text-center text-xs text-ink-faint pt-2 font-mono">
            {filtered.length} of {definitions.length} terms
          </p>
        </div>
      )}
    </div>
  )
}
