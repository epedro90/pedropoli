import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import PlayerSetup from '../../components/PlayerSetup'
import ScoreBoard, { Player } from '../../components/ScoreBoard'
import Timer from '../../components/Timer'
import { useSafeTimeout } from '../../hooks/useSafeTimeout'
import { getShuffledCards } from './data'
import { getVisibleClues, normalizeGuess, scoreForClues } from './logic'
import { ChiSonoCard, ChiSonoConfig, ChiSonoPlayer, GamePhase } from './types'
import styles from './ChiSono.module.css'
import { useCountdownSound } from '../../hooks/useCountdownSound'
import GameSetupLayout from '../../components/GameSetupLayout'
import GamePlayLayout from '../../components/GamePlayLayout'
import Confetti from '../../components/Confetti'
import ShareResults from '../../components/ShareResults'
import { useSoundEffects } from '../../hooks/useSoundEffects'
import { GAMES } from '../../types/game'

const GAME_INFO = GAMES.find(g => g.id === 'chi-sono')!

const DEFAULT_CONFIG: ChiSonoConfig = {
  players: ['Giocatore 1', 'Giocatore 2', 'Giocatore 3'],
  turnTime: 60,
  roundsPerPlayer: 1,
  maxSkips: 2,
  cardsPerGame: 18,
}

export default function ChiSono() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<GamePhase>('setup')
  const [config, setConfig] = useState<ChiSonoConfig>(DEFAULT_CONFIG)
  const [cards, setCards] = useState<ChiSonoCard[]>([])
  const [cardIndex, setCardIndex] = useState(0)
  const [turnIndex, setTurnIndex] = useState(0)
  const [players, setPlayers] = useState<ChiSonoPlayer[]>([])
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0)
  const [clueIndex, setClueIndex] = useState(1)
  const [skipsLeft, setSkipsLeft] = useState(DEFAULT_CONFIG.maxSkips)
  const [guess, setGuess] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; title: string; message: string } | null>(null)
  const [timerRunning, setTimerRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [awaitingStart, setAwaitingStart] = useState(false)
  const [turnKey, setTurnKey] = useState(0)
  const feedbackTimer = useSafeTimeout()
  const { onTick } = useCountdownSound()
  const { play } = useSoundEffects()
  const applauseFiredRef = useRef(false)

  const totalTurns = config.players.length * config.roundsPerPlayer
  const activePlayer = players[currentPlayerIdx]
  const currentCard = cards[cardIndex]

  const startGame = () => {
    feedbackTimer.clear()
    setPlayers(config.players.map((name, i) => ({
      id: `p${i}`,
      name,
      score: 0,
      solved: 0,
    })))
    setTurnIndex(0)
    setCurrentPlayerIdx(0)
    setCardIndex(0)
    setCards([])
    setClueIndex(1)
    setSkipsLeft(config.maxSkips)
    setGuess('')
    setFeedback(null)
    setTimerRunning(false)
    setPaused(false)
    setAwaitingStart(true)
    setTurnKey(0)
    setPhase('playing')
  }

  const beginTurn = useCallback((playerIdx: number, turnNumber: number) => {
    setCards(getShuffledCards(config.cardsPerGame))
    setCardIndex(0)
    setClueIndex(1)
    setSkipsLeft(config.maxSkips)
    setGuess('')
    setFeedback(null)
    setCurrentPlayerIdx(playerIdx)
    setTurnKey(prevKey => prevKey + 1)
    setTurnIndex(turnNumber)
    setTimerRunning(true)
    setPaused(false)
    setAwaitingStart(false)
  }, [config.cardsPerGame, config.maxSkips])

  const finishTurn = useCallback(() => {
    feedbackTimer.clear()
    setTimerRunning(false)
    setFeedback(null)
    setGuess('')
    setClueIndex(1)
    setSkipsLeft(config.maxSkips)

    if (turnIndex + 1 >= totalTurns) {
      setAwaitingStart(false)
      setPhase('results')
      return
    }

    const nextPlayerIdx = (currentPlayerIdx + 1) % players.length
    setCurrentPlayerIdx(nextPlayerIdx)
    setCards([])
    setCardIndex(0)
    setPaused(false)
    setAwaitingStart(true)
    setTurnIndex(prev => prev + 1)
  }, [config.maxSkips, currentPlayerIdx, feedbackTimer, players.length, totalTurns, turnIndex])

  const advanceCard = useCallback(() => {
    if (!currentCard) return
    const isLastCard = cardIndex + 1 >= cards.length

    if (isLastCard) {
      feedbackTimer.clear()
      setFeedback(null)
      setGuess('')
      setClueIndex(1)
      finishTurn()
      return
    }

    setCardIndex(prev => prev + 1)
    setClueIndex(1)
    setGuess('')
    setFeedback(null)
  }, [cardIndex, cards.length, currentCard, feedbackTimer, finishTurn])

  const handleCorrect = useCallback(() => {
    if (!currentCard) return
    play('success')
    const points = scoreForClues(clueIndex, currentCard.clues.length)
    setPlayers(prev => prev.map((p, i) => (
      i === currentPlayerIdx
        ? { ...p, score: p.score + points, solved: p.solved + 1 }
        : p
    )))
    setFeedback({
      type: 'success',
      title: `Corretto! +${points}`,
      message: `${currentCard.answer} era la risposta giusta.`,
    })
    feedbackTimer.clear()
    feedbackTimer.set(() => {
      advanceCard()
    }, 900)
  }, [advanceCard, clueIndex, currentCard, currentPlayerIdx, feedbackTimer, play])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!guess.trim() || !currentCard || !timerRunning || paused) return

    if (normalizeGuess(guess) === normalizeGuess(currentCard.answer)) {
      handleCorrect()
      return
    }

    play('error')
    if (clueIndex < currentCard.clues.length) {
      setClueIndex(prev => Math.min(prev + 1, currentCard.clues.length))
    }

    setFeedback({
      type: 'error',
      title: 'Sbagliato',
      message: clueIndex < currentCard.clues.length
        ? 'Ti abbiamo sbloccato un indizio in più.'
        : 'Hai già aperto tutti gli indizi disponibili.',
    })
    setGuess('')
    feedbackTimer.clear()
    feedbackTimer.set(() => setFeedback(null), 900)
  }

  const handleSkip = () => {
    if (!currentCard || paused || !timerRunning || skipsLeft <= 0) return
    setSkipsLeft(prev => prev - 1)
    setFeedback({
      type: 'info',
      title: 'Passa',
      message: `La risposta era ${currentCard.answer}.`,
    })
    feedbackTimer.clear()
    feedbackTimer.set(() => {
      advanceCard()
    }, 700)
  }


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

  /* ===== SETUP ===== */
  if (phase === 'setup') {
    return (
      <GameSetupLayout game={GAME_INFO}>

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
            <label className={styles.label}>🃏 Carte per turno</label>
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

          <PlayerSetup
            label="Concorrenti"
            players={config.players}
            onChange={players => setConfig(c => ({ ...c, players }))}
            min={2}
            max={8}
          />

          <Button variant="success" size="xl" fullWidth glow onClick={startGame}>
            ▶ Inizia la Sfida
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
          <h1 className={styles.winnerTitle}>VINCITORE</h1>
          <h2 className={styles.winnerName}>{winner?.name}</h2>
          <p className={styles.winnerSub}>{winner?.score ?? 0} punti totali</p>

          <div className={styles.finalList}>
            {sorted.map((p, i) => (
              <div key={p.id} className={[styles.finalRow, i === 0 ? styles.first : ''].filter(Boolean).join(' ')}>
                <span className={styles.finalRank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                <span className={styles.finalName}>{p.name}</span>
                <span className={styles.finalScore}>{p.score} pt</span>
                <span className={styles.finalMeta}>{p.solved} giuste</span>
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
              meta: `${p.solved} giuste`,
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

  const visibleClues = currentCard ? getVisibleClues(currentCard.clues, clueIndex) : []
  const cluePoints = currentCard ? scoreForClues(clueIndex, currentCard.clues.length) : 0

  /* ===== PLAYING ===== */
  return (
    <GamePlayLayout
      game={GAME_INFO}
      onBack={() => { if (confirm('Tornare alla home? La partita verrà persa.')) navigate('/') }}
      currentLabel={activePlayer?.name}
    >
      <div className={styles.gameLayout}>
        <aside className={styles.sidebar}>
          <ScoreBoard players={scorePlayers} accentColor="var(--yellow)" title="Classifica" />
          <div className={styles.turnInfo}>
            <span className={styles.turnLabel}>Turno</span>
            <span className={styles.turnVal}>{turnIndex + 1} / {totalTurns || 1}</span>
          </div>
          <div className={styles.turnInfo}>
            <span className={styles.turnLabel}>Skip</span>
            <span className={styles.turnVal}>{skipsLeft} / {config.maxSkips}</span>
          </div>
        </aside>

        <div className={styles.gameMain}>
          <div className={styles.playerBanner}>
            <span className={styles.playerBannerIcon}>❓</span>
            <div>
              <div className={styles.playerBannerName}>{activePlayer?.name}</div>
              <div className={styles.playerBannerLabel}>
                {awaitingStart ? 'Pronto a partire' : 'Concorrente attivo'}
              </div>
            </div>
            <div className={styles.personalTimer}>
              <Timer
                key={turnKey}
                duration={config.turnTime}
                running={timerRunning && !paused}
                onTimeUp={finishTurn}
            onTick={onTick}
                warningAt={10}
                size="sm"
                showProgress={false}
              />
            </div>
          </div>

          <div className={styles.cardHeader}>
            <span className={styles.categoryPill}>{currentCard?.category}</span>
            <span className={styles.scoreHint}>Valore attuale: {cluePoints} pt</span>
          </div>

          {awaitingStart && !timerRunning ? (
            <div className={styles.clueCard}>
              <p className={styles.clueTitle}>Prossimo turno</p>
              <h2 className={styles.answerMask}>{activePlayer?.name}</h2>
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
              <p className={styles.waitText}>Premi il pulsante per far partire il suo turno.</p>
              <div className={styles.waitActions}>
                <Button
                  variant="warning"
                  size="xl"
                  glow
                  onClick={() => beginTurn(currentPlayerIdx, turnIndex)}
                >
                  ▶ Avvia {activePlayer?.name}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.clueCard}>
                <p className={styles.clueTitle}>Chi sono?</p>
                <h2 className={styles.answerMask}>{clueIndex >= (currentCard?.clues.length ?? 1) ? 'Ultimo indizio' : 'Indizio in corso'}</h2>
                <div className={styles.clueList}>
                  {visibleClues.map((clue, idx) => (
                    <div key={idx} className={styles.clueRow}>
                      <span className={styles.clueIndex}>#{idx + 1}</span>
                      <span className={styles.clueText}>{clue}</span>
                    </div>
                  ))}
                  {currentCard?.clues.slice(clueIndex).map((_, idx) => (
                    <div key={`hidden-${idx}`} className={[styles.clueRow, styles.hiddenClue].join(' ')} aria-hidden="true">
                      <span className={styles.clueIndex}>#{clueIndex + idx + 1}</span>
                      <span className={styles.clueText}>🔒 Si sblocca con una risposta sbagliata</span>
                    </div>
                  ))}
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

              <form className={styles.guessForm} onSubmit={handleSubmit}>
                <input
                  className={styles.guessInput}
                  value={guess}
                  onChange={e => setGuess(e.target.value)}
                  placeholder="Scrivi qui il nome..."
                  disabled={!timerRunning || paused}
                />
                <div className={styles.guessActions}>
                  <Button variant="success" size="xl" type="submit" disabled={!timerRunning || paused} aria-label="Verifica la risposta inserita">
                    ✅ Verifica
                  </Button>
                  <Button variant="warning" size="xl" type="button" onClick={handleSkip} disabled={!timerRunning || paused} aria-label={`Salta questa carta, rimangono ${skipsLeft} skip`}>
                    ⏭ Passa ({skipsLeft})
                  </Button>
                  <Button variant="ghost" size="lg" type="button" onClick={() => setPaused(p => !p)} aria-label={paused ? 'Riprendi timer' : 'Metti in pausa timer'}>
                    {paused ? '▶ Riprendi' : '⏸ Pausa'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </GamePlayLayout>
  )
}



