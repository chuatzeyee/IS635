import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react'

interface FocusModeValue {
  readonly chromeVisible: boolean
  readonly activate: () => () => void
}

const FocusModeContext = createContext<FocusModeValue>({
  chromeVisible: true,
  activate: () => () => {},
})

export function useFocusMode(): FocusModeValue {
  return useContext(FocusModeContext)
}

const HIDE_AFTER_MS = 3000

export function FocusModeProvider({ children }: { readonly children: React.ReactNode }) {
  const [activeCount, setActiveCount] = useState(0)
  const [chromeVisible, setChromeVisible] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const active = activeCount > 0

  const activate = useCallback(() => {
    setActiveCount((c) => c + 1)
    return () => setActiveCount((c) => Math.max(0, c - 1))
  }, [])

  useEffect(() => {
    if (!active) {
      setChromeVisible(true)
      return
    }
    const reveal = () => {
      setChromeVisible(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setChromeVisible(false), HIDE_AFTER_MS)
    }
    reveal()
    window.addEventListener('mousemove', reveal)
    window.addEventListener('keydown', reveal)
    window.addEventListener('touchstart', reveal)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      window.removeEventListener('mousemove', reveal)
      window.removeEventListener('keydown', reveal)
      window.removeEventListener('touchstart', reveal)
    }
  }, [active])

  return (
    <FocusModeContext.Provider value={{ chromeVisible, activate }}>
      {children}
    </FocusModeContext.Provider>
  )
}
