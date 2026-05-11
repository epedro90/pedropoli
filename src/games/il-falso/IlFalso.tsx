import { useCallback, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import PlayerSetup from '../../components/PlayerSetup'
import ScoreBoard, { Player } from '../../components/ScoreBoard'
import Timer from '../../components/Timer'
import { useSafeTimeout } from '../../hooks/useSafeTimeout'
import { getShuffledCards } from './data'
import { FalseCard, GamePhase, IlFalsoConfig, IlFalsoPlayer } from './types'
import styles from './IlFalso.module.css'
import { useCountdownSound } from '../../hooks/useCountdownSound'
import GameSetupLayout from '../../components/GameSetupLayout'
import GamePlayLayout from '../../components/GamePlayLayout'
import Confetti from '../../components/Confetti'
import ShareResults from '../../components/ShareResults'
import { useSoundEffects } from '../../hooks/useSoundEffects'
import { GAMES } from '../../types/game'

const GAME_INFO = GAMES.find(g => g.id === 'il-falso')!

const DEFAULT_CONFIG: IlFalsoConfig = {
  players: ['Giocatore 1', 'Giocatore 2', 'Giocatore 3'],
  turnTime: 60,
  roundsPerPlayer: 1,
  cardsPerTurn: 18,
}

export default function IlFalso() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<GamePhase>('setup')
  const [config, setConfig] = useState<IlFalsoConfig>(DEFAULT_CONFIG)
  const [cards, setCards] = useState<FalseCard[]>([])
  const [cardIndex, setCardIndex] = useState(0)
  const [turnIndex, setTurnIndex] = useState(0)
  const [players, setPlayers] = useState<IlFalsoPlayer[]>([])
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; title: string; message: string } | null>(null)
  const [revealedAnswer, setRevealedAnswer] = useState<string | null>(null)
  const [timerRunning, setTimerRunning] = useState(false)
  const [awaitingStart, setAwaitingStart] = useState(false)
  const [turnKey, setTurnKey] = useState(0)
  const feedbackTimer = useSafeTimeout()
  const { onTick } = useCountdownSound()
  const revealTimer = useSafeTimeout()
  const { play } = useSoundEffects()
  const applauseFiredRef = useRef(false)

  const totalTurns = config.players.length * config.roundsPerPlayer
  const activePlayer = players[currentPlayerIdx]
  const currentCard = cards[cardIndex]

  const beginTurn = useCallback((playerIdx: number, turnNumber: number) => {
    setCards(getShuffledCards(config.cardsPerTurn))
    setCardIndex(0)
    setFeedback(null)
    setCurrentPlayerIdx(playerIdx)
    setTurnKey(prev => prev + 1)
    setTurnIndex(turnNumber)
    setTimerRunning(true)
    setAwaitingStart(false)
  }, [config.cardsPerTurn])

  const startGame = () => {
    feedbackTimer.clear()
    setPlayers(config.players.map((name, i) => ({
      id: `p${i}`,
      name,
      score: 0,
      correct: 0,
      wrong: 0,
    })))
    setTurnIndex(0)
    setCurrentPlayerIdx(0)
    setCardIndex(0)
    setCards([])
    setFeedback(null)
    setTimerRunning(false)
    setAwaitingStart(true)
    setTurnKey(0)
    setPhase('playing')
  }

  const finishTurn = useCallback((fromTimeUp = false) => {
    feedbackTimer.clear()
    revealTimer.clear()
    setFeedback(null)
    setTimerRunning(false)

    if (fromTimeUp && cards[cardIndex]) {
      const falseStatement = cards[cardIndex].statements[cards[cardIndex].falseIndex]
      setRevealedAnswer(falseStatement)
      revealTimer.set(() => {
        setRevealedAnswer(null)
        if (turnIndex + 1 >= totalTurns) {
          setAwaitingStart(false)
          setPhase('results')
          return
        }
        const nextPlayerIdx = (currentPlayerIdx + 1) % players.length
        setCurrentPlayerIdx(nextPlayerIdx)
        setCardIndex(0)
        setCards([])
        setAwaitingStart(true)
        setTurnIndex(prev => prev + 1)
      }, 3000)
      return
    }

    if (turnIndex + 1 >= totalTurns) {
      setAwaitingStart(false)
      setPhase('results')
      return
    }

    const nextPlayerIdx = (currentPlayerIdx + 1) % players.length
    setCurrentPlayerIdx(nextPlayerIdx)
    setCardIndex(0)
    setCards([])
    setAwaitingStart(true)
    setTurnIndex(prev => prev + 1)
  }, [cardIndex, cards, currentPlayerIdx, feedbackTimer, players.length, revealTimer, totalTurns, turnIndex])

  const resolveCard = useCallback((isCorrect: boolean) => {
    if (!currentCard || feedback || revealedAnswer) return

    play(isCorrect ? 'success' : 'error')
    setPlayers(prev => prev.map((p, i) => (
      i === currentPlayerIdx
        ? {
            ...p,
            score: isCorrect ? p.score + 1 : p.score,
            correct: isCorrect ? p.correct + 1 : p.correct,
            wrong: isCorrect ? p.wrong : p.wrong + 1,
          }
        : p
    )))

    setFeedback(
      isCorrect
        ? {
            type: 'success',
            title: 'Giusta! +1',
            message: "Hai trovato l'affermazione inventata.",
          }
        : {
            type: 'error',
            title: 'Sbagliato',
            message: 'Quella non era la falsa.',
          }
    )

    feedbackTimer.clear()
    feedbackTimer.set(() => {
      setFeedback(null)
      if (cardIndex + 1 >= cards.length) {
        finishTurn()
        return
      }
      setCardIndex(prev => prev + 1)
    }, 800)
  }, [cardIndex, cards.length, currentCard, currentPlayerIdx, feedback, feedbackTimer, finishTurn, play, revealedAnswer])

  const handleChoice = useCallback((index: number) => {
    if (!currentCard || !timerRunning || feedback || revealedAnswer) return
    resolveCard(index === currentCard.falseIndex)
  }, [currentCard, feedback, resolveCard, revealedAnswer, timerRunning])


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      if (!timerRunning || feedback || revealedAnswer || !currentCard) return

      const choiceMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 }
      const selected = choiceMap[event.key.toLowerCase()]
      if (selected !== undefined) handleChoice(selected)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentCard, feedback, handleChoice, revealedAnswer, timerRunning])

  useEffect(() => {
    if (phase === 'results' && !applauseFiredRef.current) {
      applauseFiredRef.current = true
      play('applause')
    }
    if (phase !== 'results') applauseFiredRef.current = false
  }, [phase, play])

  const scorePlayers: Player[] = players.map(p => ({
    id: p.id,
    name: p.name,
    score: p.score,
    isActive: p.id === activePlayer?.id,
  }))

  if (phase === 'setup') {
    return (
      <GameSetupLayout game={GAME_INFO}>
          <div className={styles.ruleBox}>
            <p>
              <strong>Regola:</strong> tra quattro affermazioni una sola è falsa.
              Premi quella giusta prima che finisca il tempo del tuo turno.
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
            <label className={styles.label}>🃏 Carte per turno</label>
            <div className={styles.numRow}>
              {[12, 18, 24, 30].map(v => (
                <button
                  key={v}
                  className={[styles.chip, config.cardsPerTurn === v ? styles.chipActive : ''].join(' ')}
                  onClick={() => setConfig(c => ({ ...c, cardsPerTurn: v }))}
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

          <Button variant="primary" size="xl" fullWidth glow onClick={startGame}>
            ▶ Inizia il gioco
          </Button>
      </GameSetupLayout>
    )
  }

  if (phase === 'results') {
    const sorted = [...players].sort((a, b) => b.score - a.score)
    const winner = sorted[0]

    return (
      <div className={styles.page}>
        <Confetti />
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
                <span className={styles.finalMeta}>+{p.correct} / -{p.wrong}</span>
              </div>
            ))}
          </div>

          <ShareResults data={{
            gameName: GAME_INFO.title,
            winnerName: winner?.name ?? '',
            winnerScore: winner?.score ?? 0,
            scoreUnit: 'pt',
            players: sorted.map(p => ({
              name: p.name,
              score: p.score,
              meta: `+${p.correct} / -${p.wrong}`,
            })),
          }} />

          <div className={styles.resultsBtns}>
            <Button variant="primary" size="lg" onClick={startGame}>🔄 Rigioca</Button>
            <Button variant="ghost" size="lg" onClick={() => navigate('/')}>🏠 Home</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <GamePlayLayout
      game={GAME_INFO}
      onBack={() => { if (confirm('Tornare alla home? La partita verrà persa.')) navigate('/') }}
      currentLabel={activePlayer?.name}
    >
      <div className={styles.gameLayout}>
        <aside className={styles.sidebar}>
          <ScoreBoard players={scorePlayers} accentColor="var(--violet)" title="Classifica" />
          <div className={styles.turnInfo}>
            <span className={styles.turnLabel}>Turno</span>
            <span className={styles.turnVal}>{turnIndex + 1} / {totalTurns || 1}</span>
          </div>
          <div className={styles.turnInfo}>
            <span className={styles.turnLabel}>Carte</span>
            <span className={styles.turnVal}>{cardIndex + 1} / {cards.length || 1}</span>
          </div>
        </aside>

        <div className={styles.gameMain}>
          <div className={styles.playerBanner}>
            <span className={styles.playerBannerIcon}>🕵️</span>
            <div>
              <div className={styles.playerBannerName}>{activePlayer?.name}</div>
              <div className={styles.playerBannerLabel}>{awaitingStart ? 'Pronto a partire' : 'Concorrente attivo'}</div>
            </div>
            <div className={styles.personalTimer}>
              <Timer
                key={turnKey}
                duration={config.turnTime}
                running={timerRunning}
                onTimeUp={() => finishTurn(true)}
            onTick={onTick}
                warningAt={10}
                size="sm"
                showProgress={false}
              />
            </div>
          </div>

          {awaitingStart && !timerRunning ? (
            <div className={styles.questionCard}>
              <p className={styles.questionLabel}>Prossimo turno</p>
              <h2 className={styles.questionText}>{activePlayer?.name}</h2>
              {turnIndex > 0 && (
                <div className={styles.readyScores}>
                  {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
                    <div key={p.id} className={[styles.readyScoreRow, p.id === activePlayer?.id ? styles.readyScoreActive : ''].filter(Boolean).join(' ')}>
                      <span className={styles.readyScoreRank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                      <span className={styles.readyScoreName}>{p.name}</span>
                      <span className={styles.readyScoreVal}>{p.score} pt</span>
                    </div>
                  ))}
                </div>
              )}
              <p className={styles.startHint}>Premi il pulsante per iniziare il suo turno.</p>
              <div className={styles.waitActions}>
                <Button variant="primary" size="xl" glow onClick={() => beginTurn(currentPlayerIdx, turnIndex)}>
                  ▶ Avvia {activePlayer?.name}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.cardHeader}>
                <span className={styles.categoryPill}>{currentCard?.category}</span>
                <span className={styles.scoreHint}>Punto carta: +1</span>
              </div>

              <div className={[
                styles.questionCard,
                feedback?.type === 'success' ? styles.correct : '',
                feedback?.type === 'error' ? styles.error : '',
              ].filter(Boolean).join(' ')}>
                <p className={styles.questionLabel}>Trova il falso</p>
                <h2 className={styles.questionText}>Quale affermazione è falsa?</h2>
                <div className={styles.statementList}>
                  {currentCard?.statements.map((statement, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={styles.statementBtn}
                      onClick={() => handleChoice(idx)}
                      disabled={!timerRunning || !!feedback || !!revealedAnswer}
                    >
                      <span className={styles.statementBadge}>
                        {String.fromCharCode(65 + idx)}
                        <span className={styles.statementKey}>[{String.fromCharCode(65 + idx)}]</span>
                      </span>
                      <span className={styles.statementText}>{statement}</span>
                    </button>
                  ))}
                </div>
              </div>

              {feedback && (
                <div className={[
                  styles.feedback,
                  feedback.type === 'success' ? styles.success : '',
                  feedback.type === 'error' ? styles.errorBox : '',
                ].filter(Boolean).join(' ')}>
                  <strong>{feedback.title}</strong>
                  <span>{feedback.message}</span>
                </div>
              )}
              {revealedAnswer && (
                <div className={[styles.feedback, styles.errorBox].join(' ')}>
                  <strong>⏰ Tempo scaduto! Il falso era:</strong>
                  <span>{revealedAnswer}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </GamePlayLayout>
  )
}


