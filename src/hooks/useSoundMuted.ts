import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'pedropoli-muted'
const EVENT_NAME = 'pedropoli-muted-change'

export function isMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function useSoundMuted(): [boolean, () => void] {
  const [muted, setMuted] = useState<boolean>(() => isMuted())

  useEffect(() => {
    const handler = () => setMuted(isMuted())
    window.addEventListener(EVENT_NAME, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(EVENT_NAME, handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const toggle = useCallback(() => {
    const next = !isMuted()
    try {
      localStorage.setItem(STORAGE_KEY, String(next))
    } catch {
      // ignore
    }
    setMuted(next)
    window.dispatchEvent(new Event(EVENT_NAME))
  }, [])

  return [muted, toggle]
}
