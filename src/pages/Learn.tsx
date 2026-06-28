import { useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, List, FileCode2 } from 'lucide-react'
import Topics from './Topics'
import Definitions from './Definitions'
import Guides from './Guides'

type LearnTab = 'topics' | 'definitions' | 'guides'

const tabs: readonly { readonly key: LearnTab; readonly label: string; readonly path: string; readonly icon: typeof BookOpen }[] = [
  { key: 'topics', label: 'Topics', path: '/topics', icon: BookOpen },
  { key: 'definitions', label: 'Definitions', path: '/definitions', icon: List },
  { key: 'guides', label: 'Guides', path: '/guides', icon: FileCode2 },
]

function tabFromPath(pathname: string): LearnTab {
  if (pathname.startsWith('/definitions')) return 'definitions'
  if (pathname.startsWith('/guides')) return 'guides'
  return 'topics'
}

export default function Learn() {
  const location = useLocation()
  const navigate = useNavigate()
  const active = tabFromPath(location.pathname)

  return (
    <div>
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map(({ key, label, path, icon: Icon }) => (
            <button
              key={key}
              onClick={() => navigate(path)}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-150 cursor-pointer border ${
                active === key
                  ? 'bg-glow-dim text-glow border-glow/30 shadow-[0_0_12px_rgba(74,222,128,0.1)]'
                  : 'bg-surface text-ink-secondary border-edge hover:bg-raised hover:text-ink'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {active === 'topics' && <Topics />}
      {active === 'definitions' && <Definitions />}
      {active === 'guides' && <Guides />}
    </div>
  )
}
