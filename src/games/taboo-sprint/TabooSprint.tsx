import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import PlayerSetup from '../../components/PlayerSetup'
import ScoreBoard, { Player } from '../../components/ScoreBoard'
import Timer from '../../components/Timer'
import { getShuffledCards } from './data'
import { GamePhase, TabooCard, TabooConfig, TabooPlayer } from './types'
import styles from './TabooSprint.module.css'

const DEFAULT_CONFIG: TabooConfig = {
  players: ['Giocatore 1', 'Giocatore 2', 'Giocatore 3'],
  turnTime: 60,
  roundsPerPlayer: 3,
  maxSkips: 2,
  cardsPerGame: 24,
}

export default function TabooSprint() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<GamePhase>('setup')
  const [config, setConfig] = useState<TabooConfig>(DEFAULT_CONFIG)
  const [cards, setCards] = useState<TabooCard[]>([])
  const [cardIndex, setCardIndex] = useState(0)
  const [turnIndex, setTurnIndex] = useState(0)
  const [players, setPlayers] = useState<TabooPlayer[]>([])
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0)
  const [skipsLeft, setSkipsLeft] = useState(DEFAULT_CONFIG.maxSkips)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; title: string; message: string } | null>(null)
  const [timerRunning, setTimerRunning] = useState(false)
  const [turnKey, setTurnKey] = useState(0)
  const feedbackRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalTurns = Math.min(cards.length, config.players.length * config.roundsPerPlayer)
  const activePlayer = players[currentPlayerIdx]
  const currentCard = cards[cardIndex]

  const clearFeedbackTimer = () => {
    if (feedbackRef.current) clearTimeout(feedbackRef.current)
    feedbackRef.current = null
  }

  const finishTurn = useCallback(() => {
    clearFeedbackTimer()
    setFeedback(null)
    setSkipsLeft(config.maxSkips)

    setTurnIndex(prev => {
      const nextTurn = prev + 1
      if (nextTurn >= totalTurns || cardIndex + 1 >= cards.length) {
        setTimerRunning(false)
        setPhase('results')
        return prev
      }

      setCardIndex(prevCard => prevCard + 1)
      setCurrentPlayerIdx(prevPlayer => (prevPlayer + 1) % players.length)
      setTurnKey(prevKey => prevKey + 1)
      return nextTurn
    })
  }, [cardIndex, cards.length, config.maxSkips, players.length, totalTurns])

  const startGame = () => {
    const shuffled = getShuffledCards(config.cardsPerGame)
    setCards(shuffled)
    setPlayers(config.players.map((name, i) => ({
      id: `p${i}`,
      name,
      score: 0,
      correct: 0,
      tabooHits: 0,
      skips: 0,
    })))
    setCardIndex(0)
    setTurnIndex(0)
    setCurrentPlayerIdx(0)
    setSkipsLeft(config.maxSkips)
    setFeedback(null)
    setTimerRunning(true)
    setTurnKey(0)
    setPhase('playing')
  }

  const resolveCard = useCallback((type: 'success' | 'error' | 'info', scoreDelta: number, updateField: 'correct' | 'tabooHits' | 'skips' | null, title: string, message: string, nextDelay = 700) => {
    if (!currentCard) return

    if (updateField) {
      setPlayers(prev => prev.map((p, i) => (
        i === currentPlayerIdx
          ? {
              ...p,
              score: p.score + scoreDelta,
              [updateField]: p[updateField] + 1,
            }
          : p
      )))
    }

    setFeedback({ type, title, message })
    clearFeedbackTimer()
    feedbackRef.current = setTimeout(() => {
      setFeedback(null)
      if (cardIndex + 1 >= cards.length) {
        setTimerRunning(false)
        setPhase('results')
        return
      }
      setCardIndex(prev => prev + 1)
    }, nextDelay)
  }, [cardIndex, cards.length, currentCard, currentPlayerIdx])

  const handleCorrect = () => {
    if (!currentCard || !timerRunning || feedback) return
    resolveCard(
      'success',
      1,
      'correct',
      'Corretto! +1',
      `${currentCard.answer} era la risposta giusta.`,
      850,
    )
  }

  const handleTaboo = () => {
    if (!currentCard || !timerRunning || feedback) return
    resolveCard(
      'error',
      0,
      'tabooHits',
      'Taboo!',
      `Hai usato una parola vietata. La risposta era ${currentCard.answer}.`,
      850,
    )
  }

  const handleSkip = () => {
    if (!currentCard || !timerRunning || feedback || skipsLeft <= 0) return
    setSkipsLeft(prev => prev - 1)
    resolveCard(
      'info',
      0,
      'skips',
      'Passa',
      `Hai saltato ${currentCard.answer}.`,
      650,
    )
  }

  useEffect(() => {
    return () => {
      clearFeedbackTimer()
    }
  }, [])

  const scorePlayers: Player[] = players.map(p => ({
    id: p.id,
    name: p.name,
    score: p.score,
    isActive: p.id === activePlayer?.id,
  }))

  if (phase === 'setup') {
    return (
      <div className={styles.page}>
        <div className={styles.setupCard}>
          <button className={styles.back} onClick={() => navigate('/')}>← Home</button>
          <h1 className={styles.gameTitle}>Taboo Sprint</h1>
          <p className={styles.gameSub}>Spiega senza dire le parole vietate</p>

          <div className={styles.ruleBox}>
            <p>
              <strong>Regola:</strong> fai indovinare la parola senza usare nessuna delle parole taboo.
              Ogni risposta giusta vale punti, ogni taboo costa caro.
            </p>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>⏱ Tempo per turno (secondi)</label>
            <div className={styles.numRow}>
              {[45, 60, 75, 90].map(v => (
                <button
                  key={v}
                  className={[styles.chip, config.turnTime === v ? styles.chipActive : ''].join(' ')}
                  onClick={() => setConfig(c => ({ ...c, turnTime: v }))}
                >
                  {v}s
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>🃏 Carte in partita</label>
            <div className={styles.numRow}>
              {[12, 18, 24, 30].map(v => (
                <button
                  key={v}
                  className={[styles.chip, config.cardsPerGame === v ? styles.chipActive : ''].join(' ')}
                  onClick={() => setConfig(c => ({ ...c, cardsPerGame: v }))}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>⏭ Skip massimi per turno</label>
            <div className={styles.numRow}>
              {[0, 1, 2, 3, 5].map(v => (
                <button
                  key={v}
                  className={[styles.chip, config.maxSkips === v ? styles.chipActive : ''].join(' ')}
                  onClick={() => setConfig(c => ({ ...c, maxSkips: v }))}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>🔁 Turni per giocatore</label>
            <div className={styles.numRow}>
              {[1, 2, 3, 4].map(v => (
                <button
                  key={v}
                  className={[styles.chip, config.roundsPerPlayer === v ? styles.chipActive : ''].join(' ')}
                  onClick={() => setConfig(c => ({ ...c, roundsPerPlayer: v }))}
                >
                  {v}
                </button>
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

          <Button variant="warning" size="xl" fullWidth glow onClick={startGame}>
            ▶ Inizia il Sprint
          </Button>
        </div>
      </div>
    )
  }

  if (phase === 'results') {
    const sorted = [...players].sort((a, b) => b.score - a.score)
    const winner = sorted[0]

    return (
      <div className={styles.page}>
        <div className={styles.resultsCard}>
          <div className={styles.winnerBadge}>🏆</div>
          <h1 className={styles.winnerTitle}>VINCITORE</h1>
          <h2 className={styles.winnerName}>{winner?.name}</h2>
          <p className={styles.winnerSub}>{winner?.score ?? 0} punti totali</p>

          <div className={styles.finalList}>
            {sorted.map((p, i) => (
              <div key={p.id} className={[styles.finalRow, i === 0 ? styles.first : ''].filter(Boolean).join(' ')}>
                <span className={styles.finalRank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                <span className={styles.finalName}>{p.name}</span>
                <span className={styles.finalScore}>{p.score} pt</span>
                <span className={styles.finalMeta}>+{p.correct} / taboo {p.tabooHits}</span>
              </div>
            ))}
          </div>

          <div className={styles.resultsBtns}>
            <Button variant="warning" size="lg" onClick={startGame}>🔄 Rigioca</Button>
            <Button variant="ghost" size="lg" onClick={() => navigate('/')}>🏠 Home</Button>
          </div>
        </div>
      </div>
    )
  }

  const currentPoints = currentCard ? 1 : 0

  return (
    <div className={styles.page}>
      <div className={styles.gameLayout}>
        <aside className={styles.sidebar}>
          <button className={styles.back} onClick={() => { if (confirm('Tornare alla home? La partita verra persa.')) navigate('/') }}>
            ← Home
          </button>
          <ScoreBoard players={scorePlayers} accentColor="var(--red)" title="Classifica" />
          <div className={styles.turnInfo}>
            <span className={styles.turnLabel}>Turno</span>
            <span className={styles.turnVal}>{turnIndex + 1} / {totalTurns || 1}</span>
          </div>
          <div className={styles.turnInfo}>
            <span className={styles.turnLabel}>Skip</span>
            <span className={styles.turnVal}>{skipsLeft} / {config.maxSkips}</span>
          </div>
          <div className={styles.turnInfo}>
            <span className={styles.turnLabel}>Carte</span>
            <span className={styles.turnVal}>{cardIndex + 1} / {cards.length || 1}</span>
          </div>
        </aside>

        <div className={styles.gameMain}>
          <div className={styles.playerBanner}>
            <span className={styles.playerBannerIcon}>⏱</span>
            <div>
              <div className={styles.playerBannerName}>{activePlayer?.name}</div>
              <div className={styles.playerBannerLabel}>Mimo o squadra attiva</div>
            </div>
            <div className={styles.personalTimer}>
              <Timer
                key={turnKey}
                duration={config.turnTime}
                running={timerRunning}
                onTimeUp={finishTurn}
                warningAt={10}
                size="sm"
                showProgress={false}
              />
            </div>
          </div>

          <div className={styles.cardHeader}>
            <span className={styles.categoryPill}>{currentCard?.category}</span>
            <span className={styles.scoreHint}>Punto carta: +{currentPoints}</span>
          </div>

          <div className={[
            styles.wordBox,
            feedback?.type === 'success' ? styles.qCorrect : '',
            feedback?.type === 'error' ? styles.qError : '',
            feedback?.type === 'info' ? styles.qSkip : '',
          ].filter(Boolean).join(' ')}>
            <p className={styles.wordLabel}>Parola da far indovinare</p>
            <h2 className={styles.word}>{currentCard?.answer}</h2>
            <div className={styles.tabooBlock}>
              <span className={styles.tabooTitle}>Parole vietate</span>
              <div className={styles.tabooList}>
                {currentCard?.taboos.map((word, idx) => (
                  <span key={idx} className={styles.tabooChip}>{word}</span>
                ))}
              </div>
            </div>
          </div>

          {feedback && (
            <div className={[
              styles.feedback,
              feedback.type === 'success' ? styles.success : '',
              feedback.type === 'error' ? styles.error : '',
              feedback.type === 'info' ? styles.info : '',
            ].filter(Boolean).join(' ')}>
              <strong>{feedback.title}</strong>
              <span>{feedback.message}</span>
            </div>
          )}

          <div className={styles.guessActions}>
            <Button variant="success" size="xl" type="button" onClick={handleCorrect} disabled={!timerRunning}>
              Indovinata
            </Button>
            <Button variant="danger" size="xl" type="button" onClick={handleTaboo} disabled={!timerRunning}>
              Errore
            </Button>
            <Button variant="warning" size="xl" type="button" onClick={handleSkip} disabled={!timerRunning || skipsLeft <= 0}>
              Skip ({skipsLeft})
            </Button>
          </div>

          <div className={styles.ruleBox}>
            <p>
              <strong>Regola rapida:</strong> ogni parola giusta vale +1, l'errore non toglie punti.
              Gli skip sono limitati per turno e il timer scorre senza fermarsi.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
