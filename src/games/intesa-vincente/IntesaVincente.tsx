import { useReducer, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { GamePhase, Team, IntesaConfig, TurnState } from './types'
import { getShuffledWords } from './data'
import Button from '../../components/Button'
import Timer from '../../components/Timer'
import ScoreBoard, { Player } from '../../components/ScoreBoard'
import Modal from '../../components/Modal'
import PlayerSetup from '../../components/PlayerSetup'
import { useSafeTimeout } from '../../hooks/useSafeTimeout'
import { applyTeamScoreDelta, getNextTeamIndex, isLastTurn } from './logic'
import styles from './IntesaVincente.module.css'
import { useCountdownSound } from '../../hooks/useCountdownSound'
import GameSetupLayout from '../../components/GameSetupLayout'
import GamePlayLayout from '../../components/GamePlayLayout'
import Confetti from '../../components/Confetti'
import ShareResults from '../../components/ShareResults'
import { useSoundEffects } from '../../hooks/useSoundEffects'
import { GAMES } from '../../types/game'

const GAME_INFO = GAMES.find(g => g.id === 'intesa-vincente')!

const DEFAULT_CONFIG: IntesaConfig = {
  teams: [
    { id: 't1', name: 'Squadra Blu', players: ['', '', ''], score: 0 },
    { id: 't2', name: 'Squadra Rossa', players: ['', '', ''], score: 0 },
  ],
  timerDuration: 60,
  maxSkips: 3,
}

type ModalState = { open: boolean; type: 'success' | 'error' | 'info' | 'winner' | 'warning'; title: string; message?: string }

interface GameState {
  words: string[]
  turn: TurnState
  teams: Team[]
  turnsPlayed: number
  modal: ModalState
  wordAnim: string
}

type Action =
  | { type: 'START'; words: string[]; teams: Team[]; turn: TurnState }
  | { type: 'TOGGLE_TIMER' }
  | { type: 'SET_WORD_ANIM'; anim: string }
  | { type: 'SET_MODAL'; modal: ModalState }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SCORE_AND_NEXT'; delta: number; field: 'correctThisTurn' | 'penaltyThisTurn' | null }
  | { type: 'SKIP' }
  | { type: 'TIME_UP'; teamName: string }
  | { type: 'END_TURN'; nextTeamIndex: number; nextWordIndex: number; config: IntesaConfig }

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START':
      return { ...state, words: action.words, teams: action.teams, turn: action.turn, turnsPlayed: 0, modal: { open: false, type: 'info', title: '' }, wordAnim: '' }
    case 'TOGGLE_TIMER':
      return { ...state, turn: { ...state.turn, timerRunning: !state.turn.timerRunning } }
    case 'SET_WORD_ANIM':
      return { ...state, wordAnim: action.anim }
    case 'SET_MODAL':
      return { ...state, modal: action.modal }
    case 'CLOSE_MODAL':
      return { ...state, modal: { ...state.modal, open: false } }
    case 'SCORE_AND_NEXT':
      return {
        ...state,
        teams: applyTeamScoreDelta(state.teams, state.turn.teamIndex, action.delta),
        turn: {
          ...state.turn,
          wordIndex: state.turn.wordIndex + 1,
          correctThisTurn: action.field === 'correctThisTurn' ? state.turn.correctThisTurn + 1 : state.turn.correctThisTurn,
          penaltyThisTurn: action.field === 'penaltyThisTurn' ? state.turn.penaltyThisTurn + 1 : state.turn.penaltyThisTurn,
        },
      }
    case 'SKIP':
      return {
        ...state,
        turn: { ...state.turn, wordIndex: state.turn.wordIndex + 1, skipsLeft: state.turn.skipsLeft - 1 },
      }
    case 'TIME_UP':
      return {
        ...state,
        turn: { ...state.turn, timerRunning: false },
        modal: { open: true, type: 'warning', title: '⏰ Tempo Scaduto!', message: `${action.teamName}: turno terminato.` },
      }
    case 'END_TURN':
      return {
        ...state,
        turnsPlayed: state.turnsPlayed + 1,
        modal: { open: false, type: 'info', title: '' },
        turn: {
          teamIndex: action.nextTeamIndex,
          wordIndex: action.nextWordIndex,
          skipsLeft: action.config.maxSkips,
          timerRunning: false,
          timeLeft: action.config.timerDuration,
          correctThisTurn: 0,
          penaltyThisTurn: 0,
        },
      }
    default:
      return state
  }
}

const ROUNDS = 1

export default function IntesaVincente() {
  const navigate = useNavigate()
  const [phase, setPhase] = useReducer((_: GamePhase, next: GamePhase) => next, 'setup' as GamePhase)
  const [config, setConfig] = useReducer(
    (prev: IntesaConfig, patch: Partial<IntesaConfig>) => ({ ...prev, ...patch }),
    DEFAULT_CONFIG
  )
  const [state, dispatch] = useReducer(reducer, {
    words: [],
    turn: { teamIndex: 0, wordIndex: 0, skipsLeft: DEFAULT_CONFIG.maxSkips, timerRunning: false, timeLeft: DEFAULT_CONFIG.timerDuration, correctThisTurn: 0, penaltyThisTurn: 0 },
    teams: [],
    turnsPlayed: 0,
    modal: { open: false, type: 'info', title: '' },
    wordAnim: '',
  })
  const wordAnimTimer = useSafeTimeout()
  const { onTick } = useCountdownSound()
  const { play } = useSoundEffects()
  const modalTimer = useSafeTimeout()
  const applauseFiredRef = useRef(false)

  const totalTurns = config.teams.length * ROUNDS

  const animateWord = useCallback((anim: string) => {
    dispatch({ type: 'SET_WORD_ANIM', anim })
    wordAnimTimer.set(() => dispatch({ type: 'SET_WORD_ANIM', anim: '' }), 400)
  }, [wordAnimTimer])

  const endTurn = useCallback((nextWordIndex?: number) => {
    modalTimer.clear()
    if (isLastTurn(state.turnsPlayed, totalTurns)) {
      setPhase('results')
      return
    }
    const nextTeamIndex = getNextTeamIndex(state.turn.teamIndex, config.teams.length)
    dispatch({ type: 'END_TURN', nextTeamIndex, nextWordIndex: nextWordIndex ?? state.turn.wordIndex, config })
  }, [config, modalTimer, state.turn.teamIndex, state.turn.wordIndex, state.turnsPlayed, totalTurns])

  const startGame = () => {
    wordAnimTimer.clear()
    modalTimer.clear()
    const shuffled = getShuffledWords()
    const resetTeams = config.teams.map(t => ({ ...t, score: 0 }))
    dispatch({
      type: 'START',
      words: shuffled,
      teams: resetTeams,
      turn: { teamIndex: 0, wordIndex: 0, skipsLeft: config.maxSkips, timerRunning: false, timeLeft: config.timerDuration, correctThisTurn: 0, penaltyThisTurn: 0 },
    })
    setPhase('playing')
  }

  const handleCorrect = useCallback(() => {
    if (!state.turn.timerRunning) return
    play('success')
    animateWord('correct')
    dispatch({ type: 'SCORE_AND_NEXT', delta: 1, field: 'correctThisTurn' })
    dispatch({ type: 'SET_MODAL', modal: { open: true, type: 'success', title: '✅ Corretta! +1 punto', message: 'Ottimo! Prossima parola...' } })
    modalTimer.clear()
    modalTimer.set(() => dispatch({ type: 'CLOSE_MODAL' }), 1200)
  }, [animateWord, modalTimer, play, state.turn.timerRunning])

  const handleError = useCallback(() => {
    if (!state.turn.timerRunning) return
    play('error')
    animateWord('error')
    dispatch({ type: 'SCORE_AND_NEXT', delta: -1, field: 'penaltyThisTurn' })
    dispatch({ type: 'SET_MODAL', modal: { open: true, type: 'error', title: '❌ Penalità! −1 punto', message: 'Attenzione alle regole!' } })
    modalTimer.clear()
    modalTimer.set(() => dispatch({ type: 'CLOSE_MODAL' }), 1200)
  }, [animateWord, modalTimer, play, state.turn.timerRunning])

  const handleSkip = useCallback(() => {
    if (!state.turn.timerRunning || state.turn.skipsLeft <= 0) return
    animateWord('skip')
    dispatch({ type: 'SKIP' })
  }, [animateWord, state.turn.skipsLeft, state.turn.timerRunning])

  const handleTimeUp = useCallback(() => {
    modalTimer.clear()
    wordAnimTimer.clear()
    dispatch({ type: 'TIME_UP', teamName: state.teams[state.turn.teamIndex]?.name ?? '' })
  }, [modalTimer, wordAnimTimer, state.teams, state.turn.teamIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      if (event.key === '1') handleCorrect()
      if (event.key === '2') handleError()
      if (event.key === '3') handleSkip()
      if (event.key === ' ') {
        event.preventDefault()
        dispatch({ type: 'TOGGLE_TIMER' })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleCorrect, handleError, handleSkip])

  useEffect(() => {
    if (phase === 'results' && !applauseFiredRef.current) {
      applauseFiredRef.current = true
      play('applause')
    }
    if (phase !== 'results') applauseFiredRef.current = false
  }, [phase, play])

  const currentWord = state.words[state.turn.wordIndex] ?? '—'
  const currentTeam = state.teams[state.turn.teamIndex]
  const scorePlayers: Player[] = state.teams.map(t => ({
    id: t.id, name: t.name, score: t.score, isActive: t.id === state.teams[state.turn.teamIndex]?.id
  }))
  const winner = [...state.teams].sort((a, b) => b.score - a.score)[0]

  /* ===== SETUP ===== */
  if (phase === 'setup') {
    return (
      <GameSetupLayout game={GAME_INFO}>

          <div className={styles.section}>
            <label className={styles.label}>⏱ Durata turno (secondi)</label>
            <div className={styles.numRow}>
              {[30, 45, 60, 90, 120].map(v => (
                <button key={v}
                  className={[styles.chip, config.timerDuration === v ? styles.chipActive : ''].join(' ')}
                  onClick={() => setConfig({ timerDuration: v })}
                >{v}s</button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>🔁 Passi disponibili per turno</label>
            <div className={styles.numRow}>
              {[0, 1, 2, 3, 5].map(v => (
                <button key={v}
                  className={[styles.chip, config.maxSkips === v ? styles.chipActive : ''].join(' ')}
                  onClick={() => setConfig({ maxSkips: v })}
                >{v}</button>
              ))}
            </div>
          </div>

          {config.teams.map((team, tidx) => (
            <div key={team.id} className={styles.teamBlock}>
              <div className={styles.teamHeader}>
                <input
                  className={styles.teamNameInput}
                  value={team.name}
                  onChange={e => setConfig({
                    teams: config.teams.map((t, i) => i === tidx ? { ...t, name: e.target.value } : t)
                  })}
                  placeholder={`Nome squadra ${tidx + 1}`}
                />
              </div>
              <PlayerSetup
                label="Giocatori"
                players={team.players}
                onChange={players => setConfig({
                  teams: config.teams.map((t, i) => i === tidx ? { ...t, players } : t)
                })}
                min={3}
                max={8}
                placeholder="Nome giocatore"
              />
            </div>
          ))}

          <div className={styles.teamsActions}>
            {config.teams.length < 4 && (
              <Button variant="ghost" size="sm" onClick={() => setConfig({
                teams: [...config.teams, { id: `t${Date.now()}`, name: `Squadra ${config.teams.length + 1}`, players: ['', '', ''], score: 0 }]
              })}>+ Aggiungi Squadra</Button>
            )}
            {config.teams.length > 2 && (
              <Button variant="ghost" size="sm" onClick={() => setConfig({ teams: config.teams.slice(0, -1) })}>
                − Rimuovi Ultima
              </Button>
            )}
          </div>

          <Button variant="success" size="xl" fullWidth glow onClick={startGame}>
            🎮 Inizia la Partita!
          </Button>
      </GameSetupLayout>
    )
  }

  /* ===== RESULTS ===== */
  if (phase === 'results') {
    const sorted = [...state.teams].sort((a, b) => b.score - a.score)
    return (
      <div className={styles.page}>
        <Confetti />
        <div className={styles.resultsCard}>
          <div className={styles.winnerBadge}>🏆</div>
          <h1 className={styles.winnerTitle}>VINCITORE!</h1>
          <h2 className={styles.winnerName}>{winner?.name}</h2>
          <p className={styles.winnerScore}>{winner?.score} punti</p>

          <div className={styles.finalScores}>
            {sorted.map((t, i) => (
              <div key={t.id} className={[styles.finalRow, i === 0 ? styles.firstPlace : ''].join(' ')}>
                <span className={styles.finalRank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                <span className={styles.finalName}>{t.name}</span>
                <span className={styles.finalPts}>{t.score} pt</span>
              </div>
            ))}
          </div>

          <ShareResults data={{
            gameName: GAME_INFO.title,
            winnerName: winner?.name ?? '',
            winnerScore: winner?.score,
            scoreUnit: 'pt',
            players: sorted.map(t => ({ name: t.name, score: t.score })),
          }} />

          <div className={styles.resultsBtns}>
            <Button variant="primary" size="lg" onClick={startGame}>🔄 Rigioca</Button>
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
      onBack={() => { if (confirm('Tornare alla home? La partita sarà persa.')) navigate('/') }}
      currentLabel={currentTeam?.name}
    >
      <div className={styles.gameLayout}>
        <aside className={styles.sidebar}>
          <ScoreBoard players={scorePlayers} accentColor="var(--blue-electric)" title="Classifica" />
          <div className={styles.turnInfo}>
            <span className={styles.turnLabel}>Turno</span>
            <span className={styles.turnVal}>{state.turnsPlayed + 1} / {totalTurns}</span>
          </div>
        </aside>

        <div className={styles.gameMain}>
          <div className={styles.teamBanner} style={{ background: 'linear-gradient(135deg, var(--blue-electric), var(--violet))' }}>
            <span className={styles.teamBannerIcon}>🧠</span>
            <span>{currentTeam?.name}</span>
          </div>

          {!state.turn.timerRunning ? (
            /* ── Pre-start: nascondi la parola ── */
            <div className={styles.readyBox}>
              <p className={styles.readyLabel}>Squadra di turno</p>
              <h2 className={styles.readyTeam}>{currentTeam?.name}</h2>
              {state.turnsPlayed > 0 && (
                <div className={styles.readyScores}>
                  {[...state.teams].sort((a, b) => b.score - a.score).map((t, i) => (
                    <div key={t.id} className={[styles.readyScoreRow, t.id === currentTeam?.id ? styles.readyScoreActive : ''].filter(Boolean).join(' ')}>
                      <span className={styles.readyScoreRank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                      <span className={styles.readyScoreName}>{t.name}</span>
                      <span className={styles.readyScoreVal}>{t.score} pt</span>
                    </div>
                  ))}
                </div>
              )}
              <p className={styles.readyHint}>Premi Avvia quando tutti sono pronti. La parola apparirà allo start.</p>
              <Timer
                duration={config.timerDuration}
                running={false}
                onTimeUp={handleTimeUp}
                onTick={onTick}
                warningAt={10}
                size="lg"
              />
              <Button variant="primary" size="xl" fullWidth glow onClick={() => dispatch({ type: 'TOGGLE_TIMER' })}>
                ▶ Avvia Timer
              </Button>
            </div>
          ) : (
            /* ── In gioco: parola + azioni ── */
            <>
              <div className={[
                styles.wordBox,
                state.wordAnim === 'correct' ? styles.wordCorrect : '',
                state.wordAnim === 'error' ? styles.wordError : '',
                state.wordAnim === 'skip' ? styles.wordSkip : '',
              ].filter(Boolean).join(' ')}>
                <p className={styles.wordLabel}>Parola da indovinare</p>
                <h2 className={styles.word}>{currentWord}</h2>
              </div>

              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <span className={styles.statVal} style={{ color: 'var(--green)' }}>{state.turn.correctThisTurn}</span>
                  <span className={styles.statLabel}>Corrette</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statVal} style={{ color: 'var(--red)' }}>{state.turn.penaltyThisTurn}</span>
                  <span className={styles.statLabel}>Penalità</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statVal} style={{ color: 'var(--yellow)' }}>{state.turn.skipsLeft}</span>
                  <span className={styles.statLabel}>Passi</span>
                </div>
              </div>

              <div className={styles.timerRow}>
                <Timer
                  duration={config.timerDuration}
                  running={state.turn.timerRunning}
                  onTimeUp={handleTimeUp}
                  onTick={onTick}
                  warningAt={10}
                  size="lg"
                />
              </div>

              <div className={styles.actionGrid}>
                <Button variant="success" size="xl" onClick={handleCorrect} aria-label="Corretta, aggiungi 1 punto">✅ Corretta +1</Button>
                <Button variant="danger" size="xl" onClick={handleError} aria-label="Penalità, sottrai 1 punto">❌ Penalità −1</Button>
                <Button variant="warning" size="lg" onClick={handleSkip} disabled={state.turn.skipsLeft <= 0} aria-label={`Passo, rimangono ${state.turn.skipsLeft} passi`}>⏭ Passo ({state.turn.skipsLeft})</Button>
                <Button variant="ghost" size="lg" onClick={() => dispatch({ type: 'TOGGLE_TIMER' })} aria-label="Pausa timer">⏸ Pausa</Button>
              </div>
              <Button variant="outline" size="lg" fullWidth onClick={() => endTurn()}>🔁 Fine Turno</Button>
            </>
          )}
        </div>
      </div>

      <Modal
        open={state.modal.open}
        type={state.modal.type}
        title={state.modal.title}
        message={state.modal.message}
        onClose={() => state.modal.type === 'warning' ? undefined : dispatch({ type: 'CLOSE_MODAL' })}
      >
        {state.modal.type === 'warning' && (
          <div style={{ marginTop: '1rem' }}>
            <Button variant="primary" size="lg" onClick={() => endTurn()}>➡ Fine Turno</Button>
          </div>
        )}
      </Modal>
    </GamePlayLayout>
  )
}
