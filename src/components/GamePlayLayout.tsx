import { ReactNode } from 'react'
import { GameDefinition } from '../types/game'
import styles from './GamePlayLayout.module.css'

interface Props {
  game: GameDefinition
  onBack: () => void
  currentLabel?: string   // nome squadra o giocatore corrente
  progress?: number       // 0–100, opzionale barra progresso in cima
  children: ReactNode
}

export default function GamePlayLayout({ game, onBack, currentLabel, progress, children }: Props) {
  return (
    <div className={styles.page} style={{ '--game-accent': game.accentColor } as React.CSSProperties}>
      <div className={styles.orb} />

      {/* Top bar */}
      <header className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>← Home</button>

        <div className={styles.gameTag}>
          <span className={styles.gameEmoji}>{game.emoji}</span>
          <span className={styles.gameName}>{game.title}</span>
        </div>

        {currentLabel && (
          <div className={styles.currentBadge}>
            {currentLabel}
          </div>
        )}
      </header>

      {/* Optional progress bar */}
      {progress !== undefined && (
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Game content */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}
