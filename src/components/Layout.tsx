import { ReactNode } from 'react'
import styles from './Layout.module.css'
import { ThemeProvider, useTheme, Theme } from '../context/ThemeContext'

const THEME_OPTIONS: { value: Theme; icon: string; label: string }[] = [
  { value: 'arcade', icon: '🕹️', label: 'Arcade' },
  { value: 'modern', icon: '✨', label: 'Modern' },
  { value: 'ember',  icon: '🔥', label: 'Ember'  },
]

function ThemeSelect() {
  const { theme, setTheme } = useTheme()
  const current = THEME_OPTIONS.find(o => o.value === theme)!
  return (
    <div className={styles.themeSelect}>
      <span className={styles.themeIcon}>{current.icon}</span>
      <select
        className={styles.themeDropdown}
        value={theme}
        onChange={e => setTheme(e.target.value as Theme)}
        aria-label="Seleziona tema"
      >
        {THEME_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.icon} {o.label}</option>
        ))}
      </select>
    </div>
  )
}

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <ThemeProvider>
      <div className={styles.layout}>
        <ThemeSelect />
        <main className={styles.main}>{children}</main>
      </div>
    </ThemeProvider>
  )
}
