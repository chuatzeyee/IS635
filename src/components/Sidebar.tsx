import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  BookOpen,
  List,
  FileCode2,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const STORAGE_KEY = 'is635_layout_mode'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/topics', label: 'Topics', icon: BookOpen },
  { to: '/definitions', label: 'Definitions', icon: List },
  { to: '/guides', label: 'Guides', icon: FileCode2 },
  { to: '/practice', label: 'Practice', icon: FlaskConical },
] as const

export default function Sidebar() {
  const [expanded, setExpanded] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === null ? true : stored === 'expanded'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, expanded ? 'expanded' : 'compact')
  }, [expanded])

  return (
    <aside
      className={`${
        expanded ? 'w-56' : 'w-14'
      } flex-shrink-0 bg-base text-ink flex flex-col transition-all duration-300 ease-in-out h-screen sticky top-0 border-r border-edge`}
    >
      <div className="flex items-center gap-2 px-3 h-14 border-b border-edge">
        {expanded && (
          <span className="text-sm font-semibold text-glow truncate tracking-wide">
            IS635
          </span>
        )}
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="ml-auto p-1 rounded hover:bg-raised text-ink-muted hover:text-ink transition-colors cursor-pointer"
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="flex-1 py-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 mx-1 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-glow-dim text-glow border border-glow/20'
                  : 'text-ink-secondary hover:bg-raised hover:text-ink'
              }`
            }
          >
            <Icon size={20} className="flex-shrink-0" />
            {expanded && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {expanded && (
        <div className="px-3 py-3 border-t border-edge text-xs text-ink-faint font-mono">
          SMU IS635 Study Guide
        </div>
      )}
    </aside>
  )
}
