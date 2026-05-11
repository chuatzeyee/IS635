import { Link } from 'react-router-dom'
import { BookOpen, List, FileCode2, FlaskConical } from 'lucide-react'
import { sessions } from '../data/topics'
import { definitions } from '../data/definitions'
import { guides } from '../data/guides'
import { questions } from '../data/questions'

const cards = [
  {
    to: '/topics',
    icon: BookOpen,
    title: 'Topics',
    description: 'Key concepts organized by session with collapsible sections',
    count: sessions.reduce((sum, s) => sum + s.topics.length, 0),
    unit: 'topics',
  },
  {
    to: '/definitions',
    icon: List,
    title: 'Definitions',
    description: 'Searchable glossary of OutSystems terms and concepts',
    count: definitions.length,
    unit: 'terms',
  },
  {
    to: '/guides',
    icon: FileCode2,
    title: 'Guides',
    description: 'Step-by-step how-to guides for common OutSystems tasks',
    count: guides.length,
    unit: 'guides',
  },
  {
    to: '/practice',
    icon: FlaskConical,
    title: 'Practice',
    description: 'Interactive quiz with score tracking and session filters',
    count: questions.length,
    unit: 'questions',
  },
] as const

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-ink mb-2 tracking-tight">
          IS635 Low Code App Dev
        </h1>
        <p className="text-lg text-glow font-medium mb-6 font-mono tracking-wide">
          Cheat Sheet & Study Guide
        </p>
        <p className="text-ink-secondary max-w-2xl mx-auto leading-relaxed">
          A comprehensive study resource for SMU IS635 covering OutSystems
          low-code application development. Explore key topics from each
          session, review definitions, follow step-by-step guides, and test
          your knowledge with interactive practice quizzes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map(({ to, icon: Icon, title, description, count, unit }) => (
          <Link
            key={to}
            to={to}
            className="group bg-surface border border-edge rounded-lg p-6 hover:border-glow/30 hover:bg-raised transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-glow-dim rounded-lg text-glow group-hover:bg-glow/15 transition-colors">
                <Icon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-ink mb-1">
                  {title}
                </h2>
                <p className="text-sm text-ink-secondary mb-3">{description}</p>
                <span className="text-xs font-medium text-glow bg-glow-dim px-2.5 py-1 rounded-full font-mono">
                  {count} {unit}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
