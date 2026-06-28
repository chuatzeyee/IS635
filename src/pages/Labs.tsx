import { useLocation, useNavigate } from 'react-router-dom'
import { Hammer, Target } from 'lucide-react'
import Build from './Build'
import HomeTest from './HomeTest'

type LabsTab = 'build' | 'home-test'

const tabs: readonly { readonly key: LabsTab; readonly label: string; readonly path: string; readonly icon: typeof Hammer }[] = [
  { key: 'build', label: 'Build Guide', path: '/build', icon: Hammer },
  { key: 'home-test', label: 'Lab Test', path: '/home-test', icon: Target },
]

function tabFromPath(pathname: string): LabsTab {
  if (pathname.startsWith('/home-test')) return 'home-test'
  return 'build'
}

export default function Labs() {
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

      {active === 'build' && <Build />}
      {active === 'home-test' && <HomeTest />}
    </div>
  )
}
