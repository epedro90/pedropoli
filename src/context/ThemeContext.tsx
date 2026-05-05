import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Theme = 'arcade' | 'modern' | 'ember'

const ThemeCtx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: 'arcade',
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem('pedropoli-theme') as Theme) || 'arcade'
  )

  const setTheme = (t: Theme) => setThemeState(t)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('pedropoli-theme', theme)
  }, [theme])

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
