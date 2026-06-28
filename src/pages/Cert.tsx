import { useLocation, useNavigate } from 'react-router-dom'
import { GraduationCap, NotebookPen, Presentation, Layers } from 'lucide-react'
import CertExam from './CertExam'
import CertStudy from './CertStudy'
import CertSlides from './CertSlides'
import CertCards from './CertCards'
import { certQuestions2 } from '../data/certQuestions2'
import { useFocusMode } from '../components/FocusMode'

type CertTab = 'exam' | 'cards' | 'exam2' | 'cards2' | 'study' | 'slides'

const tabs: readonly { readonly key: CertTab; readonly label: string; readonly path: string; readonly icon: typeof GraduationCap }[] = [
  { key: 'exam', label: 'Exam 1', path: '/cert-exam', icon: GraduationCap },
  { key: 'cards', label: 'Exam 1 Cards', path: '/cert-cards', icon: Layers },
  { key: 'exam2', label: 'Exam 2', path: '/cert-exam-2', icon: GraduationCap },
  { key: 'cards2', label: 'Exam 2 Cards', path: '/cert-cards-2', icon: Layers },
  { key: 'study', label: 'Study Notes', path: '/cert-study', icon: NotebookPen },
  { key: 'slides', label: 'Study Slides', path: '/cert-slides', icon: Presentation },
]

function tabFromPath(pathname: string): CertTab {
  if (pathname.startsWith('/cert-study')) return 'study'
  if (pathname.startsWith('/cert-slides')) return 'slides'
  if (pathname.startsWith('/cert-cards-2')) return 'cards2'
  if (pathname.startsWith('/cert-exam-2')) return 'exam2'
  if (pathname.startsWith('/cert-cards')) return 'cards'
  return 'exam'
}

export default function Cert() {
  const location = useLocation()
  const navigate = useNavigate()
  const active = tabFromPath(location.pathname)
  const { chromeVisible } = useFocusMode()

  // Only the card-based modes auto-hide chrome.
  const isCardMode = active === 'cards' || active === 'cards2'
  const hideTabs = isCardMode && !chromeVisible

  return (
    <div>
      <div
        className={`max-w-4xl mx-auto px-6 pt-10 transition-opacity duration-500 ${
          hideTabs ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
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
      {active === 'cards' && <CertCards />}
      {active === 'exam2' && <CertExam questions={certQuestions2} />}
      {active === 'cards2' && <CertCards questions={certQuestions2} />}
      {active === 'study' && <CertStudy />}
      {active === 'slides' && <CertSlides />}
    </div>
  )
}
