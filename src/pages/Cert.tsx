import { useLocation, useNavigate } from 'react-router-dom'
import { GraduationCap, NotebookPen } from 'lucide-react'
import CertExam from './CertExam'
import CertStudy from './CertStudy'

type CertTab = 'exam' | 'study'

const tabs: readonly { readonly key: CertTab; readonly label: string; readonly path: string; readonly icon: typeof GraduationCap }[] = [
  { key: 'exam', label: 'Practice Exam', path: '/cert-exam', icon: GraduationCap },
  { key: 'study', label: 'Study Notes', path: '/cert-study', icon: NotebookPen },
]

function tabFromPath(pathname: string): CertTab {
  if (pathname.startsWith('/cert-study')) return 'study'
  return 'exam'
}

export default function Cert() {
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

      {active === 'exam' && <CertExam />}
      {active === 'study' && <CertStudy />}
    </div>
  )
}
