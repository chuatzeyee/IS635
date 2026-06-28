import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { certNotes } from '../data/certNotes'
import type { CertNote } from '../data/certNotes'
import { NoteBlock } from '../components/NoteBlock'

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
              <NoteBlock key={i} block={block} />
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
