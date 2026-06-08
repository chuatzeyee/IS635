import { NavLink } from 'react-router-dom'
import {
  Home,
  BookOpen,
  List,
  FileCode2,
  FlaskConical,
  Hammer,
  Rocket,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/topics', label: 'Topics', icon: BookOpen },
  { to: '/definitions', label: 'Defs', icon: List },
  { to: '/guides', label: 'Guides', icon: FileCode2 },
  { to: '/practice', label: 'Practice', icon: FlaskConical },
  { to: '/build', label: 'Build', icon: Hammer },
  { to: '/playbook', label: 'Playbook', icon: Rocket },
] as const

export default function NavPill() {
  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 px-2 py-2 bg-base/95 backdrop-blur-md border border-edge-bright rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-glow-dim text-glow shadow-[0_0_12px_rgba(74,222,128,0.12)]'
                  : 'text-ink-muted hover:text-ink hover:bg-raised'
              }`
            }
          >
            <Icon size={16} className="flex-shrink-0" />
            <span className="hidden sm:inline">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
