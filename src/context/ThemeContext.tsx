import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Theme = 'arcade' | 'modern' | 'ember'

const STORAGE_KEY = 'pedropoli-theme'
const THEMES: Theme[] = ['arcade', 'modern', 'ember']

function isTheme(value: string | null): value is Theme {
  return value !== null && THEMES.includes(value as Theme)
}

const ThemeCtx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: 'arcade',
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem(STORAGE_KEY)
      return isTheme(storedTheme) ? storedTheme : 'arcade'
    } catch {
      return 'arcade'
    }
  })

  const setTheme = (t: Theme) => setThemeState(t)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Ignore storage failures and keep the UI working.
    }
  }, [theme])

  return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
