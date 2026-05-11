import { ReactNode } from 'react'
import styles from './Layout.module.css'
import { ThemeProvider } from '../context/ThemeContext'
import MuteToggle from './MuteToggle'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <ThemeProvider>
      <div className={styles.layout}>
        <MuteToggle />
        <main className={styles.main}>{children}</main>
      </div>
    </ThemeProvider>
  )
}
