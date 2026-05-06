import { useCallback, useEffect, useMemo, useRef } from 'react'

export function useSafeTimeout() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const set = useCallback((callback: () => void, delay: number) => {
    clear()
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null
      callback()
    }, delay)
  }, [clear])

  useEffect(() => clear, [clear])

  return useMemo(() => ({ set, clear }), [clear, set])
}
