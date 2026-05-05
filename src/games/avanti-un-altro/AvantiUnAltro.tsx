import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { GamePhase, AvantiConfig, PlayerResult } from './types'
import { getShuffledQuestions } from './data'
import { Question } from './types'
import Button from '../../components/Button'
import Timer from '../../components/Timer'
import styles from './AvantiUnAltro.module.css'
import PlayerSetup from '../../components/PlayerSetup'

const DEFAULT_CONFIG: AvantiConfig = {
  players: ['Giocatore 1', 'Giocatore 2'],
  timerDuration: 150,
  questionsCount: 21,
}

export default function AvantiUnAltro() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<GamePhase>('setup')
  const [config, setConfig] = useState<AvantiConfig>(DEFAULT_CONFIG)

  // Game state
  const [questions, setQuestions] = useState<Question[]>([])
  const [playerIndex, setPlayerIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [results, setResults] = useState<PlayerResult[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [startTime, setStartTime] = useState(0)
  const [resetAnim, setResetAnim] = useState(false)
  const startGame = () => {
    const qs = getShuffledQuestions(config.questionsCount)
    setQuestions(qs)
    setPlayerIndex(0)
    setQuestionIndex(0)
    setResults([])
    setTimerRunning(false)
    setTimerKey(k => k + 1)
    setPhase('playing')
  }

  const startTimer = () => {
    setStartTime(Date.now())
    setTimerRunning(true)
  }

  const handleAnswer = (choice: 'A' | 'B') => {
    if (!timerRunning || feedback) return
    const q = questions[questionIndex]
    const isWrong = choice !== q.correctAnswer

    if (isWrong) {
      // Good! Player gave wrong answer → advance
      setFeedback('wrong')
      setTimeout(() => {
        setFeedback(null)
        if (questionIndex + 1 >= config.questionsCount) {
          // Completed all questions!
          completePlayer(true)
        } else {
          setQuestionIndex(qi => qi + 1)
        }
      }, 600)
    } else {
      // Bad! Player gave correct answer → reset to question 1
      setFeedback('correct')
      setResetAnim(true)
      setTimeout(() => {
        setFeedback(null)
        setResetAnim(false)
        setQuestionIndex(0)
      }, 900)
    }
  }

  const completePlayer = useCallback((completed: boolean) => {
    const elapsed = completed ? Math.round((Date.now() - startTime) / 1000) : config.timerDuration
    const result: PlayerResult = {
      name: config.players[playerIndex],
      completed,
      timeUsed: elapsed,
      maxQuestion: questionIndex + 1,
    }
    const newResults = [...results, result]
    setResults(newResults)
    setTimerRunning(false)

    if (playerIndex + 1 >= config.players.length) {
      setPhase('results')
    } else {
      setPlayerIndex(pi => pi + 1)
      setQuestionIndex(0)
      setTimerKey(k => k + 1)
    }
  }, [config.players, config.timerDuration, playerIndex, questionIndex, results, startTime])

  const handleTimeUp = useCallback(() => {
    completePlayer(false)
  }, [completePlayer])

  const currentQ = questions[questionIndex]
  const currentPlayer = config.players[playerIndex]
  const progress = ((questionIndex) / config.questionsCount) * 100

  /* ===== SETUP ===== */
  if (phase === 'setup') {
    return (
      <div className={styles.page}>
        <div className={styles.setupCard}>
          <button className={styles.back} onClick={() => navigate('/')}>← Home</button>
          <h1 className={styles.gameTitle}>🎯 Avanti un Altro</h1>
          <p className={styles.gameSub}>Finale al Contrario</p>
          <div className={styles.ruleBox}>
            <p>⚠️ <strong>Regola:</strong> Devi dare la risposta <strong style={{ color: 'var(--red)' }}>SBAGLIATA</strong> a ogni domanda. Se dài quella giusta, si riparte dall'inizio!</p>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>⏱ Tempo massimo (secondi)</label>
            <div className={styles.numRow}>
              {[90, 120, 150, 180, 240].map(v => (
                <button key={v}
                  className={[styles.chip, config.timerDuration === v ? styles.chipActive : ''].join(' ')}
                  onClick={() => setConfig(c => ({ ...c, timerDuration: v }))}
                >{v}s</button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>❓ Numero domande</label>
            <div className={styles.numRow}>
              {[10, 15, 21].map(v => (
                <button key={v}
                  className={[styles.chip, config.questionsCount === v ? styles.chipActive : ''].join(' ')}
                  onClick={() => setConfig(c => ({ ...c, questionsCount: v }))}
                >{v}</button>
              ))}
            </div>
          </div>

          <PlayerSetup
            label="Giocatori"
            players={config.players}
            onChange={players => setConfig(c => ({ ...c, players }))}
            min={1}
            max={6}
          />

          <Button variant="warning" size="xl" fullWidth glow onClick={startGame}>
            🎯 Inizia la Sfida!
          </Button>
        </div>
      </div>
    )
  }

  /* ===== RESULTS ===== */
  if (phase === 'results') {
    const completed = results.filter(r => r.completed)
    const notCompleted = results.filter(r => !r.completed)
    let winner: PlayerResult
    if (completed.length > 0) {
      winner = completed.sort((a, b) => a.timeUsed - b.timeUsed)[0]
    } else {
      winner = notCompleted.sort((a, b) => b.maxQuestion - a.maxQuestion)[0]
    }

    return (
      <div className={styles.page}>
        <div className={styles.resultsCard}>
          <div className={styles.winnerBadge}>🏆</div>
          <h1 className={styles.winnerTitle}>VINCITORE!</h1>
          <h2 className={styles.winnerName}>{winner.name}</h2>
          <p className={styles.winnerSub}>
            {winner.completed ? `Completato in ${winner.timeUsed}s` : `Arrivato alla domanda ${winner.maxQuestion}`}
          </p>

          <div className={styles.finalList}>
            {[...results]
              .sort((a, b) => {
                if (a.completed && !b.completed) return -1
                if (!a.completed && b.completed) return 1
                if (a.completed && b.completed) return a.timeUsed - b.timeUsed
                return b.maxQuestion - a.maxQuestion
              })
              .map((r, i) => (
                <div key={r.name} className={[styles.finalRow, i === 0 ? styles.first : ''].join(' ')}>
                  <span className={styles.finalRank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                  <span className={styles.finalName}>{r.name}</span>
                  <span className={styles.finalDetail}>
                    {r.completed ? `✅ ${r.timeUsed}s` : `❌ Q.${r.maxQuestion}`}
                  </span>
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

  /* ===== PLAYING ===== */
  return (
    <div className={styles.page}>
      <div className={styles.gameCard}>
        <div className={styles.gameHeader}>
          <button className={styles.back} onClick={() => { if (confirm('Tornare alla home?')) navigate('/') }}>← Home</button>
          <div className={styles.playerTag}>👤 {currentPlayer}</div>
          <div className={styles.qCount}>{questionIndex} / {config.questionsCount}</div>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.timerCenter}>
          <Timer
            key={timerKey}
            duration={config.timerDuration}
            running={timerRunning}
            onTimeUp={handleTimeUp}
            warningAt={20}
            size="lg"
          />
        </div>

        <div className={[
          styles.questionBox,
          feedback === 'correct' ? styles.qError : '',
          feedback === 'wrong' ? styles.qCorrect : '',
          resetAnim ? styles.qReset : '',
        ].filter(Boolean).join(' ')}>
          {feedback === 'correct' && (
            <div className={styles.feedbackOverlay}>
              <span className={styles.feedbackIcon}>😱 RISPOSTA GIUSTA! Riparti!</span>
            </div>
          )}
          {feedback === 'wrong' && (
            <div className={styles.feedbackOverlay}>
              <span className={styles.feedbackIcon}>✅ Bene! Risposta sbagliata!</span>
            </div>
          )}
          <p className={styles.questionText}>{currentQ?.question}</p>
        </div>

        <div className={styles.choiceRow}>
          <button
            className={[styles.choiceBtn, styles.choiceA, feedback ? styles.choiceDisabled : ''].filter(Boolean).join(' ')}
            onClick={() => handleAnswer('A')}
            disabled={!!feedback || !timerRunning}
          >
            <span className={styles.choiceLabel}>A</span>
            <span className={styles.choiceText}>{currentQ?.optionA}</span>
          </button>
          <button
            className={[styles.choiceBtn, styles.choiceB, feedback ? styles.choiceDisabled : ''].filter(Boolean).join(' ')}
            onClick={() => handleAnswer('B')}
            disabled={!!feedback || !timerRunning}
          >
            <span className={styles.choiceLabel}>B</span>
            <span className={styles.choiceText}>{currentQ?.optionB}</span>
          </button>
        </div>

        {!timerRunning && questionIndex === 0 && (
          <Button variant="warning" size="xl" fullWidth glow onClick={startTimer}>
            ▶ Inizia!
          </Button>
        )}

        <div className={styles.reminder}>
          ⚠️ Rispondi con la risposta <strong style={{ color: 'var(--red)' }}>SBAGLIATA</strong>!
        </div>
      </div>
    </div>
  )
}
