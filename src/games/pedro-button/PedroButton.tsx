import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildSequence, BEST_SCORE_KEY, getShapeEmoji } from './challenges'
import { validateChallenge } from './validation'
import type { ButtonChallenge, ButtonColor, GamePhase } from './types'
import styles from './PedroButton.module.css'

const MAX_LIVES = 3
const SEQUENCE_LENGTH = 20
const FEEDBACK_DURATION = 1100
const COUNTDOWN_DURATION = 3
const NUM_SECTIONS = 12

const BUTTON_COLOR_CLASS: Record<ButtonColor, string> = {
  default: '',
  green: styles.btnGreen,
  red: styles.btnRed,
  blue: styles.btnBlue,
  yellow: styles.btnYellow,
  purple: styles.btnPurple,
}

// SVG ring con N sezioni: ogni sezione è un arco
// Ritorna array di path d string per ogni sezione
function buildArcPath(index: number, total: number, r: number, gap: number): string {
  const anglePerSection = (2 * Math.PI) / total
  const startAngle = index * anglePerSection - Math.PI / 2 + gap / 2
  const endAngle = startAngle + anglePerSection - gap

  const cx = 0
  const cy = 0

  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy + r * Math.sin(endAngle)

  const largeArc = anglePerSection - gap > Math.PI ? 1 : 0

  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
}

// Numero di sezioni ancora accese in base al tempo
function calcSectionsLeft(timeLeft: number, totalTime: number): number {
  if (totalTime <= 0) return NUM_SECTIONS
  const fraction = timeLeft / totalTime
  return Math.ceil(fraction * NUM_SECTIONS)
}

function getBestScore(): number {
  try { return parseInt(localStorage.getItem(BEST_SCORE_KEY) ?? '0', 10) || 0 }
  catch { return 0 }
}

function saveBestScore(score: number): void {
  try {
    if (score > getBestScore()) localStorage.setItem(BEST_SCORE_KEY, String(score))
  } catch { /* ignore */ }
}

// Colore delle sezioni in base al tempo rimasto
function sectionColor(sectionsLeft: number): string {
  if (sectionsLeft > 8) return '#10b981'
  if (sectionsLeft > 4) return '#fbbf24'
  return '#ff4444'
}

export default function PedroButton() {
  const navigate = useNavigate()

  const [phase, setPhase] = useState<GamePhase>('intro')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [round, setRound] = useState(0)
  const [, setSequence] = useState<ButtonChallenge[]>([])
  const [currentChallenge, setCurrentChallenge] = useState<ButtonChallenge | null>(null)
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [bestScore, setBestScore] = useState(getBestScore)
  const [memoryNumber, setMemoryNumber] = useState<number | null>(null)
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [buttonAnim, setButtonAnim] = useState<'idle' | 'pressed' | 'shake' | 'glow'>('idle')

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const resolvedRef = useRef(false)
  const clicksRef = useRef(0)
  const firstClickFractionRef = useRef<number | null>(null)
  const challengeStartRef = useRef<number>(0)
  const currentChallengeRef = useRef<ButtonChallenge | null>(null)
  const memoryNumberRef = useRef<number | null>(null)
  // Per evitare closure stale in handleFeedbackDone
  const livesRef = useRef(MAX_LIVES)
  const sequenceRef = useRef<ButtonChallenge[]>([])
  const roundRef = useRef(0)

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  const clearCountdown = useCallback(() => {
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null }
  }, [])

  const showFeedback = useCallback((type: 'success' | 'error', msg: string) => {
    setFeedbackType(type)
    setFeedbackMsg(msg)
    setPhase('feedback')
  }, [])

  const resolveChallenge = useCallback((
    challenge: ButtonChallenge,
    finalClicks: number,
    finalFirstFraction: number | null,
    finalMemory: number | null,
  ) => {
    if (resolvedRef.current) return
    resolvedRef.current = true
    clearTimer()

    if (challenge.type === 'memoryNumber') {
      memoryNumberRef.current = challenge.number ?? null
      setMemoryNumber(challenge.number ?? null)
    }

    const result = validateChallenge(challenge, finalClicks, finalFirstFraction, finalMemory)

    if (result.success) {
      setScore(prev => prev + 1)
      setButtonAnim('glow')
      showFeedback('success', result.message)
    } else {
      setLives(prev => {
        const next = prev - 1
        livesRef.current = next
        return next
      })
      setButtonAnim('shake')
      showFeedback('error', result.message)
    }

    setTimeout(() => setButtonAnim('idle'), 500)
  }, [clearTimer, showFeedback])

  const startChallenge = useCallback((ch: ButtonChallenge) => {
    resolvedRef.current = false
    clicksRef.current = 0
    firstClickFractionRef.current = null
    setCurrentChallenge(ch)
    currentChallengeRef.current = ch
    setTimeLeft(ch.durationMs)
    setTotalTime(ch.durationMs)
    setPhase('playing')
    setButtonAnim('idle')
    challengeStartRef.current = Date.now()

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - challengeStartRef.current
      const remaining = Math.max(0, ch.durationMs - elapsed)
      setTimeLeft(remaining)

      if (remaining <= 0) {
        clearTimer()
        const c = currentChallengeRef.current
        if (c) resolveChallenge(c, clicksRef.current, firstClickFractionRef.current, memoryNumberRef.current)
      }
    }, 50)
  }, [clearTimer, resolveChallenge])

  const handleFeedbackDone = useCallback(() => {
    const nextRound = roundRef.current + 1
    roundRef.current = nextRound
    setRound(nextRound)
    setFeedbackType(null)
    setFeedbackMsg('')

    if (livesRef.current <= 0 || nextRound >= sequenceRef.current.length) {
      setPhase('gameover')
      return
    }
    startChallenge(sequenceRef.current[nextRound])
  }, [startChallenge])

  useEffect(() => {
    if (phase !== 'feedback') return
    const t = setTimeout(handleFeedbackDone, FEEDBACK_DURATION)
    return () => clearTimeout(t)
  }, [phase, handleFeedbackDone])

  useEffect(() => {
    if (phase !== 'gameover') return
    saveBestScore(score)
    setBestScore(getBestScore())
  }, [phase, score])

  const startGame = useCallback(() => {
    clearTimer()
    clearCountdown()
    const seq = buildSequence(SEQUENCE_LENGTH)
    sequenceRef.current = seq
    livesRef.current = MAX_LIVES
    roundRef.current = 0
    setSequence(seq)
    setScore(0)
    setLives(MAX_LIVES)
    setRound(0)
    setMemoryNumber(null)
    memoryNumberRef.current = null
    setFeedbackType(null)
    setFeedbackMsg('')
    setCountdown(COUNTDOWN_DURATION)
    setPhase('countdown')

    let c = COUNTDOWN_DURATION
    countdownRef.current = setInterval(() => {
      c -= 1
      setCountdown(c)
      if (c <= 0) {
        clearCountdown()
        startChallenge(seq[0])
      }
    }, 1000)
  }, [clearTimer, clearCountdown, startChallenge])

  useEffect(() => () => { clearTimer(); clearCountdown() }, [clearTimer, clearCountdown])

  const handleButtonClick = useCallback(() => {
    if (phase !== 'playing' || resolvedRef.current) return

    const elapsed = Date.now() - challengeStartRef.current
    const ch = currentChallengeRef.current
    const fraction = ch ? elapsed / ch.durationMs : 0

    clicksRef.current += 1
    if (firstClickFractionRef.current === null) firstClickFractionRef.current = fraction

    setButtonAnim('pressed')
    setTimeout(() => setButtonAnim('idle'), 120)

    if (!ch) return

    // Risoluzione anticipata quando si raggiunge il click esatto
    if (
      (ch.type === 'exactClicks' || ch.type === 'shapeCorners') &&
      clicksRef.current === ch.requiredClicks
    ) {
      resolveChallenge(ch, clicksRef.current, firstClickFractionRef.current, memoryNumberRef.current)
    }
  }, [phase, resolveChallenge])

  // ── Valori derivati ────────────────────────────────────────────
  const sectionsLeft = calcSectionsLeft(timeLeft, totalTime)
  const ch = currentChallenge
  const btnColorClass = ch?.buttonColor ? (BUTTON_COLOR_CLASS[ch.buttonColor] ?? '') : ''
  const ringColor = feedbackType === 'success'
    ? '#10b981'
    : feedbackType === 'error'
      ? '#ff4444'
      : sectionColor(sectionsLeft)

  // SVG dimensions
  const SVG_SIZE = 280
  const CENTER = SVG_SIZE / 2
  const RING_R = 120
  const STROKE = 10
  const GAP = 0.12 // radianti tra sezioni

  // ── INTRO ──────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className={styles.page}>
        <div className={styles.introCard}>
          <div className={styles.introEmoji}>🔴</div>
          <h1 className={styles.introTitle}>Pedro Button</h1>
          <p className={styles.introSub}>Leggi. Decidi. Sopravvivi.</p>
          <p className={styles.introDesc}>
            Ogni round compare un'istruzione.<br />
            A volte devi premere, a volte devi resistere.<br />
            Hai <strong>3 vite</strong> — usale bene.
          </p>
          {bestScore > 0 && (
            <div className={styles.bestScore}>
              🏆 Record: <strong>{bestScore}</strong>
            </div>
          )}
          <button className={styles.startBtn} onClick={startGame}>Gioca</button>
          <button className={styles.backLink} onClick={() => navigate('/')}>← Torna ai giochi</button>
        </div>
      </div>
    )
  }

  // ── COUNTDOWN ─────────────────────────────────────────────────
  if (phase === 'countdown') {
    return (
      <div className={styles.page}>
        <div className={styles.countdownBox}>
          <span className={styles.countdownNum}>{countdown}</span>
          <p className={styles.countdownLabel}>Preparati...</p>
        </div>
      </div>
    )
  }

  // ── GAME OVER ─────────────────────────────────────────────────
  if (phase === 'gameover') {
    const isNewBest = score > 0 && score >= bestScore
    return (
      <div className={styles.page}>
        <div className={styles.gameoverCard}>
          <div className={styles.gameoverEmoji}>{isNewBest ? '🏆' : '💥'}</div>
          <h1 className={styles.gameoverTitle}>{isNewBest ? 'Nuovo record!' : 'Game Over'}</h1>
          <p className={styles.gameoverScore}>{score} round superati</p>
          {!isNewBest && bestScore > 0 && <p className={styles.gameoverPrev}>Record: {bestScore}</p>}
          <div className={styles.gameoverBtns}>
            <button className={styles.startBtn} onClick={startGame}>🔄 Rigioca</button>
            <button className={styles.ghostBtn} onClick={() => navigate('/')}>🏠 Torna ai giochi</button>
          </div>
        </div>
      </div>
    )
  }

  // ── PLAYING / FEEDBACK ────────────────────────────────────────
  const isFeedback = phase === 'feedback'

  return (
    <div className={styles.page}>
      {/* HUD */}
      <div className={styles.hud}>
        <div className={styles.hudItem}>
          <span className={styles.hudLabel}>Round</span>
          <span className={styles.hudVal}>{round + 1}</span>
        </div>
        <div className={styles.hudLives}>
          {[...Array(MAX_LIVES)].map((_, i) => (
            <span key={i} className={i < lives ? styles.lifeOn : styles.lifeOff}>♥</span>
          ))}
        </div>
        <div className={styles.hudItem}>
          <span className={styles.hudLabel}>Punti</span>
          <span className={styles.hudVal}>{score}</span>
        </div>
      </div>

      {/* Ring + Button */}
      <div className={styles.ringWrap}>
        <svg
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className={styles.ringSvg}
          aria-hidden="true"
        >
          <g transform={`translate(${CENTER},${CENTER})`}>
            {Array.from({ length: NUM_SECTIONS }, (_, i) => {
              const active = isFeedback
                ? feedbackType === 'success'
                  ? true   // tutte accese in verde
                  : false  // tutte spente in rosso
                : i < sectionsLeft
              return (
                <path
                  key={i}
                  d={buildArcPath(i, NUM_SECTIONS, RING_R, GAP)}
                  stroke={active ? ringColor : 'rgba(255,255,255,0.07)'}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  fill="none"
                  style={{ transition: 'stroke 0.15s ease' }}
                />
              )
            })}
          </g>
        </svg>

        {/* Pulsante dentro il ring */}
        <button
          className={[
            styles.mainBtn,
            btnColorClass,
            buttonAnim === 'pressed' ? styles.btnPressed : '',
            buttonAnim === 'shake' ? styles.btnShake : '',
            buttonAnim === 'glow' ? styles.btnGlow : '',
            isFeedback ? styles.btnDisabled : '',
            feedbackType === 'success' ? styles.btnSuccess : '',
            feedbackType === 'error' ? styles.btnError : '',
          ].filter(Boolean).join(' ')}
          onClick={handleButtonClick}
          disabled={!isFeedback ? phase !== 'playing' : true}
          aria-label="Pulsante principale"
          onPointerDown={e => e.preventDefault()}
        >
          {isFeedback ? (
            <div className={styles.feedbackInner}>
              <span className={styles.feedbackIcon}>
                {feedbackType === 'success' ? '✓' : '✗'}
              </span>
              <span className={styles.feedbackText}>{feedbackMsg}</span>
            </div>
          ) : (
            <div className={styles.challengeInner}>
              {ch?.type === 'memoryNumber' && ch.number !== undefined && (
                <span className={styles.memoryNum}>{ch.number}</span>
              )}
              {ch?.number !== undefined && ch.type !== 'memoryNumber' && (
                <span className={styles.numberHint}>{ch.number}</span>
              )}
              {ch?.shape && ch.type === 'shapeCorners' && (
                <span className={styles.shapeHint}>{getShapeEmoji(ch.shape)}</span>
              )}
              {ch?.colorWord && (
                <span className={styles.colorWord}>{ch.colorWord}</span>
              )}
              <p className={styles.instruction}>{ch?.text}</p>
            </div>
          )}
        </button>
      </div>

      {/* Numero in memoria (mostrato fuori dal bottone, solo se attivo e non è il turno memory) */}
      {memoryNumber !== null && !isFeedback && ch?.type !== 'memoryNumber' && (
        <div className={styles.memoryTag}>
          🧠 Numero ricordato: <strong>{memoryNumber}</strong>
        </div>
      )}
    </div>
  )
}
