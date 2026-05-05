import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './Timer.module.css'

interface Props {
  duration: number
  running: boolean
  onTimeUp?: () => void
  onTick?: (remaining: number) => void
  warningAt?: number
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
}

export default function Timer({
  duration,
  running,
  onTimeUp,
  onTick,
  warningAt = 10,
  size = 'lg',
  showProgress = true,
}: Props) {
  const [remaining, setRemaining] = useState(duration)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const calledTimeUpRef = useRef(false)

  useEffect(() => {
    setRemaining(duration)
    calledTimeUpRef.current = false
  }, [duration])

  const tick = useCallback(() => {
    setRemaining(prev => {
      const next = prev - 1
      onTick?.(next)
      if (next <= 0 && !calledTimeUpRef.current) {
        calledTimeUpRef.current = true
        onTimeUp?.()
        return 0
      }
      return next
    })
  }, [onTick, onTimeUp])

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, remaining, tick])

  const pct = Math.max(0, (remaining / duration) * 100)
  const isWarning = remaining <= warningAt && remaining > 0
  const isDanger = remaining <= Math.floor(warningAt / 2) && remaining > 0
  const isExpired = remaining <= 0

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const display = mins > 0
    ? `${mins}:${String(secs).padStart(2, '0')}`
    : String(remaining)

  const strokeColor = isExpired
    ? 'var(--red)'
    : isDanger
    ? 'var(--red)'
    : isWarning
    ? 'var(--yellow)'
    : 'var(--cyan)'

  const radius = size === 'lg' ? 70 : size === 'md' ? 50 : 35
  const stroke = size === 'lg' ? 8 : size === 'md' ? 6 : 4
  const svgSize = (radius + stroke) * 2
  const circumference = 2 * Math.PI * radius

  return (
    <div className={[styles.timer, styles[size], isWarning ? styles.warning : '', isExpired ? styles.expired : ''].filter(Boolean).join(' ')}>
      {showProgress && (
        <svg className={styles.ring} width={svgSize} height={svgSize}>
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
          />
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct / 100)}
            strokeLinecap="round"
            transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
          />
        </svg>
      )}
      <span
        className={styles.display}
        style={{ color: strokeColor }}
      >
        {display}
      </span>
    </div>
  )
}
