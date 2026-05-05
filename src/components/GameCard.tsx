import { useNavigate } from 'react-router-dom'
import { GameDefinition } from '../types/game'
import styles from './GameCard.module.css'
import Button from './Button'

interface Props {
  game: GameDefinition
  index: number
}

export default function GameCard({ game, index }: Props) {
  const navigate = useNavigate()

  return (
    <div
      className={styles.card}
      style={{
        '--accent': game.accentColor,
        '--secondary': game.secondaryColor,
        animationDelay: `${index * 0.12}s`,
      } as React.CSSProperties}
    >
      <div className={styles.glow} />
      <div className={styles.header}>
        <span className={styles.emoji}>{game.emoji}</span>
        <div className={styles.badges}>
          <span className={styles.badge}>{game.players}</span>
          <span className={[styles.badge, styles.difficulty].join(' ')}>{game.difficulty}</span>
        </div>
      </div>
      <h2 className={styles.title}>{game.title}</h2>
      <p className={styles.subtitle}>{game.subtitle}</p>
      <p className={styles.description}>{game.description}</p>
      <div className={styles.footer}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate(game.route)}
          style={{ background: `linear-gradient(135deg, ${game.accentColor}, ${game.secondaryColor})`, color: '#06142e' } as React.CSSProperties}
        >
          🎮 Gioca!
        </Button>
      </div>
    </div>
  )
}
