import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { GamePhase, CompletamentoPlayer, CompletamentoConfig, CompletamentoQuestion } from './types'
import { getShuffledQuestions } from './data'
import Button from '../../components/Button'
import ScoreBoard, { Player } from '../../components/ScoreBoard'
import PlayerSetup from '../../components/PlayerSetup'
import styles from './Completamento.module.css'
import { useCountdownSound } from '../../hooks/useCountdownSound'
import { useSafeTimeout } from '../../hooks/useSafeTimeout'
import { useSoundEffects } from '../../hooks/useSoundEffects'
import GameSetupLayout from '../../components/GameSetupLayout'
import GamePlayLayout from '../../components/GamePlayLayout'
import Confetti from '../../components/Confetti'
import ShareResults from '../../components/ShareResults'
import { GAMES } from '../../types/game'

const GAME_INFO = GAMES.find(g => g.id === 'completamento')!


const DEFAULT_CONFIG: CompletamentoConfig = {
  players: ['Giocatore 1', 'Giocatore 2', 'Giocatore 3'],
  startTime: 60,
  revealInterval: 3,
  maxQuestions: 30,
}

export default function Completamento() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<GamePhase>('setup')
  const [config, setConfig] = useState<CompletamentoConfig>(DEFAULT_CONFIG)

  const [questions, setQuestions] = useState<CompletamentoQuestion[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [players, setPlayers] = useState<CompletamentoPlayer[]>([])
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0)
  const [revealedIndexes, setRevealedIndexes] = useState<number[]>([])
  const [timerRunning, setTimerRunning] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'skip' | null>(null)
  const [paused, setPaused] = useState(false)
  const [lastCorrectPlayer, setLastCorrectPlayer] = useState<number | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const revealRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const feedbackTimer = useSafeTimeout()
  const { onTick } = useCountdownSound()
  const { play } = useSoundEffects()
  const applauseFiredRef = useRef(false)

  const [awaitingStart, setAwaitingStart] = useState(false)

  const startGame = () => {
    const qs = getShuffledQuestions(config.maxQuestions)
    setQuestions(qs)
    setPlayers(config.players.map((name, i) => ({
      id: `p${i}`, name, score: 0, timeLeft: config.startTime, isEliminated: false
    })))
    setCurrentPlayerIdx(0)
    setQuestionIndex(0)
    setRevealedIndexes([])
    setTimerRunning(false)
    setPaused(false)
    setLastCorrectPlayer(null)
    setAwaitingStart(true)
    setPhase('playing')
  }

  const activePlayer = players[currentPlayerIdx]

  const advancePlayer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (revealRef.current) clearInterval(revealRef.current)
    feedbackTimer.clear()
    setFeedback(null)
    setRevealedIndexes([])

    // Find next non-eliminated player
    const nextIdx = (() => {
      let idx = (currentPlayerIdx + 1) % players.length
      let loops = 0
      while (players[idx]?.isEliminated && loops < players.length) {
        idx = (idx + 1) % players.length
        loops++
      }
      return idx
    })()

    const activePlayers = players.filter(p => !p.isEliminated && p.timeLeft > 0)
    if (activePlayers.length <= 1) {
      setPhase('results')
      return
    }

    setCurrentPlayerIdx(nextIdx)
    setQuestionIndex(qi => qi + 1)
  }, [currentPlayerIdx, feedbackTimer, players])

  const getRevealableIndexes = useCallback((word: string) => {
    return word
      .split('')
      .map((ch, i) => ({ ch, i }))
      .filter(({ ch, i }) => ch !== ' ' && i !== word.length - 1)
      .map(({ i }) => i)
  }, [])

  const getMaskedWord = useCallback((word: string, revealed: number[]) => {
    const revealedSet = new Set(revealed)
    const letters = word.split('')
    return letters.map((ch, i) => {
      if (ch === ' ') return ' '
      if (i === letters.length - 1) return '_' // last letter never revealed
      if (revealedSet.has(i)) return ch
      return '_'
    })
  }, [])

  // Personal timer for current player
  useEffect(() => {
    if (!timerRunning || paused || !activePlayer || activePlayer.isEliminated) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setPlayers(prev => {
        const updated = prev.map((p, i) => {
          if (i !== currentPlayerIdx) return p
          const newTime = p.timeLeft - 1
          onTick(newTime)
          if (newTime <= 0) return { ...p, timeLeft: 0, isEliminated: true }
          return { ...p, timeLeft: newTime }
        })
        return updated
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerRunning, paused, currentPlayerIdx, activePlayer])

  // Check elimination after timer ticks
  useEffect(() => {
    if (!timerRunning) return
    const current = players[currentPlayerIdx]
    if (current?.isEliminated || current?.timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current)
      advancePlayer()
    }
  }, [players, currentPlayerIdx, timerRunning, advancePlayer])

  useEffect(() => {
    if (phase === 'results' && !applauseFiredRef.current) {
      applauseFiredRef.current = true
      play('applause')
    }
    if (phase !== 'results') applauseFiredRef.current = false
  }, [phase, play])

  // Letter reveal interval
  useEffect(() => {
    if (!timerRunning || paused) {
      if (revealRef.current) clearInterval(revealRef.current)
      return
    }
    const word = questions[questionIndex]?.answer ?? ''
    revealRef.current = setInterval(() => {
      setRevealedIndexes(current => {
        const hiddenIndexes = getRevealableIndexes(word).filter(i => !current.includes(i))
        if (hiddenIndexes.length === 0) return current
        const nextIndex = hiddenIndexes[Math.floor(Math.random() * hiddenIndexes.length)]
        return [...current, nextIndex]
      })
    }, config.revealInterval * 1000)
    return () => { if (revealRef.current) clearInterval(revealRef.current) }
  }, [timerRunning, paused, questionIndex, questions, config.revealInterval, getRevealableIndexes])

  const handleCorrect = () => {
    play('success')
    setFeedback('correct')
    setLastCorrectPlayer(currentPlayerIdx)
    setPlayers(prev => prev.map((p, i) =>
      i === currentPlayerIdx ? { ...p, score: p.score + 1 } : p
    ))
    feedbackTimer.clear()
    feedbackTimer.set(() => {
      setFeedback(null)
      advancePlayer()
    }, 700)
  }

  const handleUndo = () => {
    if (lastCorrectPlayer === null) return
    setPlayers(prev => prev.map((p, i) =>
      i === lastCorrectPlayer ? { ...p, score: Math.max(0, p.score - 1) } : p
    ))
    setLastCorrectPlayer(null)
  }

  const handleSkip = () => {
    play('click')
    feedbackTimer.clear()
    setFeedback('skip')
    feedbackTimer.set(() => {
      setFeedback(null)
      advancePlayer()
    }, 500)
  }

  const scorePlayers: Player[] = players.map(p => ({
    id: p.id, name: p.name, score: p.score,
    isActive: p.id === activePlayer?.id,
    isEliminated: p.isEliminated,
    timeLeft: p.timeLeft,
  }))

  const currentQuestion = questions[questionIndex]
  const masked = currentQuestion ? getMaskedWord(currentQuestion.answer, revealedIndexes) : []
  const revealableCount = currentQuestion ? getRevealableIndexes(currentQuestion.answer).length : 0

  /* ===== SETUP ===== */
  if (phase === 'setup') {
    return (
      <GameSetupLayout game={GAME_INFO}>

          <div className={styles.section}>
            <label className={styles.label}>⏱ Tempo per giocatore (secondi)</label>
            <div className={styles.numRow}>
              {[30, 45, 60, 90, 120].map(v => (
                <button key={v}
                  className={[styles.chip, config.startTime === v ? styles.chipActive : ''].join(' ')}
                  onClick={() => setConfig(c => ({ ...c, startTime: v }))}
                >{v}s</button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>⏲ Rivela una lettera ogni (secondi)</label>
            <div className={styles.numRow}>
              {[0.5, 1, 2, 3, 4, 5, 8].map(v => (
                <button key={v}
                  className={[styles.chip, config.revealInterval === v ? styles.chipActive : ''].join(' ')}
                  onClick={() => setConfig(c => ({ ...c, revealInterval: v }))}
                >{v}s</button>
              ))}
            </div>
          </div>

          <PlayerSetup
            label="Concorrenti"
            players={config.players}
            onChange={players => setConfig(c => ({ ...c, players }))}
            min={2}
            max={8}
          />

          <Button variant="success" size="xl" fullWidth glow onClick={startGame}>
            🔤 Inizia il Gioco!
          </Button>
      </GameSetupLayout>
    )
  }

  /* ===== RESULTS ===== */
  if (phase === 'results') {
    const sorted = [...players].sort((a, b) => b.score - a.score)
    const winner = sorted[0]
    return (
      <div className={styles.page}>
        <Confetti />
        <div className={styles.resultsCard}>
          <div className={styles.winnerBadge}>🏆</div>
          <h1 className={styles.winnerTitle}>VINCITORE!</h1>
          <h2 className={styles.winnerName}>{winner.name}</h2>
          <p className={styles.winnerSub}>{winner.score} punti</p>
          <div className={styles.finalList}>
            {sorted.map((p, i) => (
              <div key={p.id} className={[styles.finalRow, i === 0 ? styles.first : '', p.isEliminated ? styles.eliminated : ''].filter(Boolean).join(' ')}>
                <span className={styles.finalRank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                <span className={styles.finalName}>{p.name}</span>
                <span className={styles.finalScore}>{p.score} pt</span>
                {p.isEliminated && <span className={styles.elimTag}>❌</span>}
              </div>
            ))}
          </div>
          <ShareResults data={{
            gameName: GAME_INFO.title,
            winnerName: winner.name,
            winnerScore: winner.score,
            scoreUnit: 'pt',
            players: sorted.map(p => ({
              name: p.name,
              score: p.score,
              meta: p.isEliminated ? '❌ eliminato' : undefined,
            })),
          }} />

          <div className={styles.resultsBtns}>
            <Button variant="success" size="lg" onClick={startGame}>🔄 Rigioca</Button>
            <Button variant="ghost" size="lg" onClick={() => navigate('/')}>🏠 Home</Button>
          </div>
        </div>
      </div>
    )
  }

  /* ===== PLAYING ===== */
  return (
    <GamePlayLayout
      game={GAME_INFO}
      onBack={() => { if (confirm('Tornare alla home?')) navigate('/') }}
      currentLabel={activePlayer?.name}
    >
      <div className={styles.gameLayout}>
        <aside className={styles.sidebar}>
          <ScoreBoard
            players={scorePlayers}
            accentColor="var(--green)"
            title="Classifica"
            showTime
          />
        </aside>

        <div className={styles.gameMain}>
          {awaitingStart ? (
            <div className={styles.readyBox}>
              <p className={styles.readyLabel}>Tutti pronti?</p>
              <h2 className={styles.readyPlayer}>Inizia il gioco</h2>
              <p className={styles.readyHint}>
                Le lettere si riveleranno con il tempo.<br />
                Indovina prima che finisca il tuo cronometro!
              </p>
              <Button variant="success" size="xl" glow onClick={() => { setAwaitingStart(false); setTimerRunning(true) }}>
                ▶ Inizia!
              </Button>
            </div>
          ) : (
          <>
          <div className={styles.playerBanner}>
            <span className={styles.playerBannerIcon}>🔤</span>
            <div>
              <div className={styles.playerBannerName}>{activePlayer?.name}</div>
              <div className={styles.playerBannerLabel}>Concorrente corrente</div>
            </div>
            <div className={[styles.personalTimer, activePlayer?.timeLeft && activePlayer.timeLeft <= 10 ? styles.timerDanger : ''].filter(Boolean).join(' ')}>
              <span className={styles.timerNum}>{activePlayer?.timeLeft ?? 0}</span>
              <span className={styles.timerSec}>sec</span>
            </div>
          </div>

          <div className={[
            styles.questionBox,
            feedback === 'correct' ? styles.qCorrect : '',
            feedback === 'skip' ? styles.qSkip : '',
          ].filter(Boolean).join(' ')}>
            <p className={styles.clueLabel}>Indizio</p>
            <p className={styles.clue}>{currentQuestion?.clue}</p>
          </div>

          <div className={styles.wordDisplay}>
            {masked.map((ch, i) => (
              <span
                key={i}
                className={[styles.letter, ch !== '_' && ch !== ' ' ? styles.letterRevealed : '', ch === ' ' ? styles.letterSpace : ''].filter(Boolean).join(' ')}
                style={ch !== '_' && ch !== ' ' ? { animationDelay: `${i * 0.05}s` } : {}}
              >
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </div>

          <div className={styles.revealInfo}>
            {revealedIndexes.length} / {revealableCount} lettere rivelate
          </div>

          <div className={styles.actionGrid}>
            <Button variant="success" size="xl" onClick={handleCorrect} aria-label="Corretta, aggiungi 1 punto">✅ Corretta +1</Button>
            <Button variant="warning" size="lg" onClick={handleSkip} aria-label="Salta questa parola">⏭ Salta</Button>
            <Button variant="ghost" size="lg" onClick={() => setPaused(p => !p)} aria-label={paused ? 'Riprendi timer' : 'Metti in pausa timer'}>
              {paused ? '▶ Riprendi' : '⏸ Pausa'}
            </Button>
            <Button variant="danger" size="sm" onClick={handleUndo} disabled={lastCorrectPlayer === null} aria-label="Annulla l'ultimo punto assegnato">
              ↩ Annulla ultimo punto
            </Button>
          </div>
          </>
          )}
        </div>
      </div>
    </GamePlayLayout>
  )
}
