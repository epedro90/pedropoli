import { createContext, useContext, ReactNode } from 'react'

export type Theme = 'ps5'

const ThemeCtx = createContext<{ theme: Theme }>({ theme: 'ps5' })

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeCtx.Provider value={{ theme: 'ps5' }}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
