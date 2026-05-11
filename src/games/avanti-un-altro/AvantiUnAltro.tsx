import { useReducer, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { GamePhase, AvantiConfig, PlayerResult } from './types'
import { getShuffledQuestions } from './data'
import { Question } from './types'
import Button from '../../components/Button'
import Timer from '../../components/Timer'
import styles from './AvantiUnAltro.module.css'
import PlayerSetup from '../../components/PlayerSetup'
import GameSetupLayout from '../../components/GameSetupLayout'
import GamePlayLayout from '../../components/GamePlayLayout'
import Confetti from '../../components/Confetti'
import ShareResults from '../../components/ShareResults'
import { useSoundEffects } from '../../hooks/useSoundEffects'
import { GAMES } from '../../types/game'

const GAME_INFO = GAMES.find(g => g.id === 'avanti-un-altro')!
import { useSafeTimeout } from '../../hooks/useSafeTimeout'
import { isWrongAnswer, rankResults } from './logic'
import { useCountdownSound } from '../../hooks/useCountdownSound'

const DEFAULT_CONFIG: AvantiConfig = {
  players: ['Giocatore 1', 'Giocatore 2'],
  timerDuration: 150,
  questionsCount: 21,
}

interface GameState {
  questions: Question[]
  playerIndex: number
  questionIndex: number
  timerRunning: boolean
  timerKey: number
  results: PlayerResult[]
  feedback: 'correct' | 'wrong' | null
  startTime: number
  resetAnim: boolean
}

type Action =
  | { type: 'START'; questions: Question[] }
  | { type: 'START_TIMER'; now: number }
  | { type: 'SET_FEEDBACK'; feedback: 'correct' | 'wrong' | null }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESET_QUESTION' }
  | { type: 'COMPLETE_PLAYER'; result: PlayerResult; isLast: boolean }
  | { type: 'CLEAR_RESET_ANIM' }

const INITIAL_STATE: GameState = {
  questions: [],
  playerIndex: 0,
  questionIndex: 0,
  timerRunning: false,
  timerKey: 0,
  results: [],
  feedback: null,
  startTime: 0,
  resetAnim: false,
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START':
      return {
        ...INITIAL_STATE,
        timerKey: state.timerKey + 1,
        questions: action.questions,
      }
    case 'START_TIMER':
      return { ...state, timerRunning: true, startTime: action.now }
    case 'SET_FEEDBACK':
      return {
        ...state,
        feedback: action.feedback,
        resetAnim: action.feedback === 'correct',
      }
    case 'NEXT_QUESTION':
      return { ...state, feedback: null, questionIndex: state.questionIndex + 1 }
    case 'RESET_QUESTION':
      return { ...state, feedback: null, resetAnim: false, questionIndex: 0 }
    case 'COMPLETE_PLAYER': {
      const newResults = [...state.results, action.result]
      if (action.isLast) {
        return { ...state, timerRunning: false, results: newResults, feedback: null }
      }
      return {
        ...state,
        timerRunning: false,
        results: newResults,
        feedback: null,
        playerIndex: state.playerIndex + 1,
        questionIndex: 0,
        timerKey: state.timerKey + 1,
      }
    }
    case 'CLEAR_RESET_ANIM':
      return { ...state, resetAnim: false }
    default:
      return state
  }
}

export default function AvantiUnAltro() {
  const navigate = useNavigate()
  const [phase, setPhase] = useReducer(
    (_: GamePhase, next: GamePhase) => next,
    'setup' as GamePhase
  )
  const [config, setConfig] = useReducer(
    (prev: AvantiConfig, patch: Partial<AvantiConfig>) => ({ ...prev, ...patch }),
    DEFAULT_CONFIG
  )
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const feedbackTimer = useSafeTimeout()
  const { onTick } = useCountdownSound()
  const { play } = useSoundEffects()
  const applauseFiredRef = useRef(false)

  const startGame = () => {
    feedbackTimer.clear()
    dispatch({ type: 'START', questions: getShuffledQuestions(config.questionsCount) })
    setPhase('playing')
  }

  const completePlayer = useCallback((completed: boolean) => {
    feedbackTimer.clear()
    const elapsed = completed
      ? Math.round((Date.now() - state.startTime) / 1000)
      : config.timerDuration
    const result: PlayerResult = {
      name: config.players[state.playerIndex],
      completed,
      timeUsed: elapsed,
      maxQuestion: state.questionIndex + 1,
    }
    const isLast = state.playerIndex + 1 >= config.players.length
    dispatch({ type: 'COMPLETE_PLAYER', result, isLast })
    if (isLast) setPhase('results')
  }, [feedbackTimer, config.timerDuration, config.players, state.playerIndex, state.questionIndex, state.startTime])

  const handleAnswer = useCallback((choice: 'A' | 'B') => {
    if (!state.timerRunning || state.feedback) return
    const q = state.questions[state.questionIndex]
    if (!q) return
    const isWrong = isWrongAnswer(choice, q.correctAnswer)
    const currentQuestionIndex = state.questionIndex

    if (isWrong) {
      play('success')
      dispatch({ type: 'SET_FEEDBACK', feedback: 'wrong' })
      feedbackTimer.clear()
      feedbackTimer.set(() => {
        if (currentQuestionIndex + 1 >= config.questionsCount) {
          completePlayer(true)
        } else {
          dispatch({ type: 'NEXT_QUESTION' })
        }
      }, 600)
    } else {
      play('error')
      dispatch({ type: 'SET_FEEDBACK', feedback: 'correct' })
      feedbackTimer.clear()
      feedbackTimer.set(() => {
        dispatch({ type: 'RESET_QUESTION' })
      }, 900)
    }
  }, [completePlayer, config.questionsCount, feedbackTimer, play, state.feedback, state.questionIndex, state.questions, state.timerRunning])

  const handleTimeUp = useCallback(() => {
    feedbackTimer.clear()
    completePlayer(false)
  }, [feedbackTimer, completePlayer])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      if (!state.timerRunning || state.feedback) return
      if (event.key.toLowerCase() === 'a') handleAnswer('A')
      if (event.key.toLowerCase() === 'b') handleAnswer('B')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.feedback, handleAnswer, state.timerRunning])

  useEffect(() => {
    if (phase === 'results' && !applauseFiredRef.current) {
      applauseFiredRef.current = true
      play('applause')
    }
    if (phase !== 'results') applauseFiredRef.current = false
  }, [phase, play])

  const currentQ = state.questions[state.questionIndex]
  const currentPlayer = config.players[state.playerIndex]
  const progress = Math.min(100, (state.questionIndex / config.questionsCount) * 100)

  /* ===== SETUP ===== */
  if (phase === 'setup') {
    return (
      <GameSetupLayout game={GAME_INFO}>
          <div className={styles.ruleBox}>
            <p>⚠️ <strong>Regola:</strong> Devi dare la risposta <strong style={{ color: 'var(--red)' }}>SBAGLIATA</strong> a ogni domanda. Se dài quella giusta, si riparte dall'inizio!</p>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>⏱ Tempo massimo (secondi)</label>
            <div className={styles.numRow}>
              {[90, 120, 150, 180, 240].map(v => (
                <button key={v}
                  className={[styles.chip, config.timerDuration === v ? styles.chipActive : ''].join(' ')}
                  onClick={() => setConfig({ timerDuration: v })}
                >{v}s</button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>🔢 Numero domande</label>
            <div className={styles.numRow}>
              {[10, 15, 21].map(v => (
                <button key={v}
                  className={[styles.chip, config.questionsCount === v ? styles.chipActive : ''].join(' ')}
                  onClick={() => setConfig({ questionsCount: v })}
                >{v}</button>
              ))}
            </div>
          </div>

          <PlayerSetup
            label="Giocatori"
            players={config.players}
            onChange={players => setConfig({ players })}
            min={1}
            max={6}
          />

          <Button variant="warning" size="xl" fullWidth glow onClick={startGame}>
            🏁 Inizia la Sfida!
          </Button>
      </GameSetupLayout>
    )
  }

  /* ===== RESULTS ===== */
  if (phase === 'results') {
    const completed = state.results.filter(r => r.completed)
    const notCompleted = state.results.filter(r => !r.completed)
    const winner = completed.length > 0
      ? completed.sort((a, b) => a.timeUsed - b.timeUsed)[0]
      : notCompleted.sort((a, b) => b.maxQuestion - a.maxQuestion)[0]

    return (
      <div className={styles.page}>
        <Confetti />
        <div className={styles.resultsCard}>
          <div className={styles.winnerBadge}>🏆</div>
          <h1 className={styles.winnerTitle}>VINCITORE!</h1>
          <h2 className={styles.winnerName}>{winner.name}</h2>
          <p className={styles.winnerSub}>
            {winner.completed ? `Completato in ${winner.timeUsed}s` : `Arrivato alla domanda ${winner.maxQuestion}`}
          </p>

          <div className={styles.finalList}>
            {rankResults(state.results).map((r, i) => (
              <div key={r.name} className={[styles.finalRow, i === 0 ? styles.first : ''].join(' ')}>
                <span className={styles.finalRank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                <span className={styles.finalName}>{r.name}</span>
                <span className={styles.finalDetail}>
                  {r.completed ? `✅ ${r.timeUsed}s` : `❌ Q.${r.maxQuestion}`}
                </span>
              </div>
            ))}
          </div>

          <ShareResults data={{
            gameName: GAME_INFO.title,
            winnerName: winner.name,
            winnerScore: winner.completed ? winner.timeUsed : winner.maxQuestion,
            scoreUnit: winner.completed ? 's' : 'D.',
            subtitle: winner.completed ? 'Completato!' : `Arrivato alla domanda ${winner.maxQuestion}`,
            players: rankResults(state.results).map(r => ({
              name: r.name,
              score: r.completed ? r.timeUsed : r.maxQuestion,
              meta: r.completed ? `✅ ${r.timeUsed}s` : `❌ Q.${r.maxQuestion}`,
            })),
          }} />

          <div className={styles.resultsBtns}>
            <Button variant="warning" size="lg" onClick={startGame}>🔄 Rigioca</Button>
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
      currentLabel={currentPlayer}
      progress={progress}
    >
      <div className={styles.gameCard}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        {!state.timerRunning ? (
          /* ── Ready screen: nasconde domanda ── */
          <div className={styles.readyBox}>
            <p className={styles.readyLabel}>Giocatore</p>
            <h2 className={styles.readyPlayer}>{currentPlayer}</h2>
            <p className={styles.readyHint}>
              Rispondi SEMPRE con la risposta sbagliata.<br />
              La domanda apparirà allo start.
            </p>
            <Timer key={state.timerKey} duration={config.timerDuration} running={false} onTimeUp={handleTimeUp} onTick={onTick} warningAt={20} size="lg" />
            <Button variant="warning" size="xl" fullWidth glow onClick={() => dispatch({ type: 'START_TIMER', now: Date.now() })}>
              ▶ Avvia {currentPlayer}
            </Button>
          </div>
        ) : (
          /* ── In gioco: domanda + scelte ── */
          <>
            <div className={styles.gameHeader}>
              <div className={styles.playerTag}>👤 {currentPlayer}</div>
              <div className={styles.qCount}>{state.questionIndex} / {config.questionsCount}</div>
            </div>

            <div className={styles.timerCenter}>
              <Timer
                key={state.timerKey}
                duration={config.timerDuration}
                running={state.timerRunning}
                onTimeUp={handleTimeUp}
                onTick={onTick}
                warningAt={20}
                size="lg"
              />
            </div>

            <div className={[
              styles.questionBox,
              state.feedback === 'correct' ? styles.qError : '',
              state.feedback === 'wrong' ? styles.qCorrect : '',
              state.resetAnim ? styles.qReset : '',
            ].filter(Boolean).join(' ')}>
              {state.feedback === 'correct' && (
                <div className={styles.feedbackOverlay}>
                  <span className={styles.feedbackIcon}>🚨 RISPOSTA GIUSTA! Riparti!</span>
                </div>
              )}
              {state.feedback === 'wrong' && (
                <div className={styles.feedbackOverlay}>
                  <span className={styles.feedbackIcon}>✅ Bene! Risposta sbagliata!</span>
                </div>
              )}
              <p className={styles.questionText}>{currentQ?.question}</p>
            </div>

            <div className={styles.choiceRow}>
              <button
                className={[styles.choiceBtn, styles.choiceA, state.feedback ? styles.choiceDisabled : ''].filter(Boolean).join(' ')}
                onClick={() => handleAnswer('A')}
                disabled={!!state.feedback}
              >
                <span className={styles.choiceLabel}>A</span>
                <span className={styles.choiceText}>{currentQ?.optionA}</span>
              </button>
              <button
                className={[styles.choiceBtn, styles.choiceB, state.feedback ? styles.choiceDisabled : ''].filter(Boolean).join(' ')}
                onClick={() => handleAnswer('B')}
                disabled={!!state.feedback}
              >
                <span className={styles.choiceLabel}>B</span>
                <span className={styles.choiceText}>{currentQ?.optionB}</span>
              </button>
            </div>

            <div className={styles.reminder}>
              ⚠️ Rispondi con la risposta <strong style={{ color: 'var(--red)' }}>SBAGLIATA</strong>!
            </div>
          </>
        )}
      </div>
    </GamePlayLayout>
  )
}
