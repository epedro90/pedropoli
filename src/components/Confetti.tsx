import { useMemo } from 'react'
import styles from './Confetti.module.css'

const COLORS = ['#00d4ff', '#f59e0b', '#10b981', '#ec4899', '#fbbf24', '#3b82f6', '#ff4444', '#a78bfa']
const COUNT = 60

interface Particle {
  id: number
  color: string
  left: number
  size: number
  duration: number
  delay: number
  drift: number
}

export default function Confetti() {
  const particles = useMemo<Particle[]>(() => (
    Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      left: Math.random() * 100,
      size: 6 + Math.random() * 8,
      duration: 2.5 + Math.random() * 2,
      delay: Math.random() * 1.5,
      drift: (Math.random() - 0.5) * 120,
    }))
  ), [])

  return (
    <div className={styles.confetti} aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * (0.4 + Math.random() * 0.6),
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `translateX(${p.drift}px)`,
          }}
        />
      ))}
    </div>
  )
}
