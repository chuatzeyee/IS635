import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { definitions } from '../data/definitions'

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="highlight-match">{part}</mark>
    ) : (
      part
    )
  )
}

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

      <div className="relative mb-8 group">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-glow transition-colors"
        />
        <input
          type="text"
          placeholder="Search terms..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-raised border border-edge rounded-lg text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-glow/50 focus:border-glow/50 transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-ink-faint font-mono">
          {filtered.length} of {definitions.length} terms
          {query && ` matching "${query}"`}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <p className="text-ink-muted mb-2">No matching terms found.</p>
          <button
            onClick={() => setQuery('')}
            className="text-sm text-glow hover:text-glow-hover cursor-pointer transition-colors"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((def, i) => (
            <div
              key={def.term}
              className="bg-surface border border-edge rounded-lg px-5 py-4 hover:border-edge-bright hover:bg-raised/50 transition-all duration-150 animate-fade-in"
              style={{ animationDelay: `${Math.min(i * 30, 300)}ms`, animationFillMode: 'both' }}
            >
              <dt className="text-sm font-semibold text-glow mb-1 font-mono">
                {highlightText(def.term, query)}
              </dt>
              <dd className="text-sm text-ink-secondary leading-relaxed">
                {highlightText(def.description, query)}
              </dd>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
