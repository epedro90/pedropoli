import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { GameDefinition } from '../types/game'
import styles from './GameSetupLayout.module.css'

interface Props {
  game: GameDefinition
  children: ReactNode
}

export default function GameSetupLayout({ game, children }: Props) {
  const navigate = useNavigate()

  return (
    <div className={styles.page} style={{ '--game-accent': game.accentColor } as React.CSSProperties}>
      <div className={styles.orb} />

      <button className={styles.back} onClick={() => navigate('/')}>
        ← Home
      </button>

      <div className={styles.layout}>
        {/* Hero panel */}
        <div className={styles.hero}>
          <div className={styles.heroEmoji}>{game.emoji}</div>
          <h1 className={styles.heroTitle}>{game.title}</h1>
          <p className={styles.heroSubtitle}>{game.subtitle}</p>
          <p className={styles.heroDescription}>{game.description}</p>
          <div className={styles.heroBadges}>
            <span className={styles.badge}>👥 {game.players}</span>
            <span className={styles.badge}>⭐ {game.difficulty}</span>
          </div>
        </div>

        {/* Setup panel */}
        <div className={styles.setupPanel}>
          <div className={styles.setupHeader}>
            <span className={styles.setupDot} />
            <span className={styles.setupLabel}>Configura la partita</span>
          </div>
          <div className={styles.setupContent}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
