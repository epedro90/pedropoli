import styles from './ScoreBoard.module.css'

export interface Player {
  id: string
  name: string
  score: number
  isActive?: boolean
  isEliminated?: boolean
  timeLeft?: number
}

interface Props {
  players: Player[]
  title?: string
  accentColor?: string
  showTime?: boolean
}

export default function ScoreBoard({ players, title = 'Punteggi', accentColor = 'var(--blue-electric)', showTime = false }: Props) {
  const sorted = [...players].sort((a, b) => b.score - a.score)

  return (
    <div className={styles.board}>
      <h3 className={styles.title} style={{ color: accentColor }}>{title}</h3>
      <div className={styles.list}>
        {sorted.map((p, idx) => (
          <div
            key={p.id}
            className={[
              styles.row,
              p.isActive ? styles.active : '',
              p.isEliminated ? styles.eliminated : '',
            ].filter(Boolean).join(' ')}
            style={p.isActive ? { borderColor: accentColor, boxShadow: `0 0 16px ${accentColor}44` } : {}}
          >
            <span className={styles.rank}>
              {idx === 0 && !p.isEliminated ? '🥇' : idx === 1 && !p.isEliminated ? '🥈' : idx === 2 && !p.isEliminated ? '🥉' : `#${idx + 1}`}
            </span>
            <span className={styles.name}>{p.name}</span>
            {showTime && p.timeLeft !== undefined && (
              <span className={styles.time} style={{ color: p.timeLeft <= 10 ? 'var(--red)' : 'var(--yellow)' }}>
                ⏱ {p.timeLeft}s
              </span>
            )}
            <span key={p.score} className={styles.score} style={{ color: accentColor }}>
              {p.score}
              <span className={styles.pts}>pt</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
