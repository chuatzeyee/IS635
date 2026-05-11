import { useState, useEffect, useRef } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const scrollRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = document.getElementById('main-content')
    scrollRef.current = el

    if (!el) return

    const handleScroll = () => {
      setVisible(el.scrollTop > 300)
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 p-3 bg-glow-dim hover:bg-glow/20 text-glow rounded-full border border-glow/30 transition-colors z-50 cursor-pointer"
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  )
}
