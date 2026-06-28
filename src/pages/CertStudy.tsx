import { useState } from 'react'
import { ChevronDown, Lightbulb, AlertTriangle } from 'lucide-react'
import { certNotes } from '../data/certNotes'
import type { CertNote, NoteBlock } from '../data/certNotes'

function renderBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-ink font-semibold font-mono text-[13px]">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="font-mono text-[12px] bg-base/70 text-glow border border-edge rounded px-1 py-0.5">
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

function Block({ block }: { readonly block: NoteBlock }) {
  switch (block.kind) {
    case 'text':
      return <p className="text-sm text-ink-secondary leading-relaxed">{renderBold(block.text ?? '')}</p>
    case 'bullets':
      return (
        <ul className="space-y-1.5">
          {block.items?.map((item, i) => (
            <li key={i} className="text-sm text-ink-secondary flex items-start gap-2 leading-relaxed">
              <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-glow/50" />
              <span>{renderBold(item)}</span>
            </li>
          ))}
        </ul>
      )
    case 'table':
      if (!block.table) return null
      return (
        <div className="overflow-x-auto rounded-lg border border-edge">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-raised">
                {block.table.headers.map((h, i) => (
                  <th key={i} className="text-left text-xs font-semibold text-ink px-3 py-2 border-b border-edge whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.table.rows.map((row, ri) => (
                <tr key={ri} className="even:bg-surface/40">
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-3 py-2 align-top border-b border-edge/50 leading-relaxed ${ci === 0 ? 'text-glow font-medium font-mono text-[13px] whitespace-nowrap' : 'text-ink-secondary'}`}>
                      {renderBold(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'tip':
      return (
        <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg bg-glow-dim/30 border border-glow/15">
          <Lightbulb size={14} className="text-glow flex-shrink-0 mt-0.5" />
          <p className="text-xs text-glow/90 leading-relaxed">{renderBold(block.text ?? '')}</p>
        </div>
      )
    case 'warn':
      return (
        <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg bg-[#422006]/40 border border-[#f59e0b]/15">
          <AlertTriangle size={14} className="text-[#fbbf24] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#fbbf24]/90 leading-relaxed">{renderBold(block.text ?? '')}</p>
        </div>
      )
    default:
      return null
  }
}

function NoteCard({ note, index }: { readonly note: CertNote; readonly index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0)

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
          <h3 className="text-sm font-semibold text-ink">{note.title}</h3>
          {!isOpen && <p className="text-xs text-ink-muted mt-0.5 truncate">{note.summary}</p>}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-4 border-t border-edge">
          <p className="text-sm text-ink-secondary mt-3 mb-4 leading-relaxed">{note.summary}</p>
          <div className="space-y-3">
            {note.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CertStudy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-ink mb-2 tracking-tight">Cert Study Notes</h1>
      <p className="text-ink-muted mb-6">
        Key concepts for the OutSystems Associate Reactive Developer exam — the explanations,
        tables, and gotchas worth memorizing.
      </p>

      <div className="space-y-3">
        {certNotes.map((note, idx) => (
          <NoteCard key={note.id} note={note} index={idx} />
        ))}
      </div>
    </div>
  )
}
