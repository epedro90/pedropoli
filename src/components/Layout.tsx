import { ReactNode } from 'react'
import styles from './Layout.module.css'
import { ThemeProvider, useTheme, Theme } from '../context/ThemeContext'

const THEME_OPTIONS: { value: Theme; icon: string; label: string }[] = [
  { value: 'arcade', icon: '🕹️', label: 'Arcade' },
  { value: 'modern', icon: '✨', label: 'Modern' },
  { value: 'ember', icon: '🔥', label: 'Ember' },
]

function ThemeSelect() {
  const { theme, setTheme } = useTheme()
  const current = THEME_OPTIONS.find(option => option.value === theme) ?? THEME_OPTIONS[0]

  return (
    <div className={styles.themeSelect}>
      <span className={styles.themeIcon}>{current.icon}</span>
      <select
        className={styles.themeDropdown}
        value={theme}
        onChange={event => setTheme(event.target.value as Theme)}
        aria-label="Seleziona tema"
      >
        {THEME_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.icon} {option.label}
          </option>
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
