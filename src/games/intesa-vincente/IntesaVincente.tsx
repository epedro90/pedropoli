import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { GamePhase, Team, IntesaConfig, TurnState } from './types'
import { getShuffledWords } from './data'
import Button from '../../components/Button'
import Timer from '../../components/Timer'
import ScoreBoard, { Player } from '../../components/ScoreBoard'
import Modal from '../../components/Modal'
import PlayerSetup from '../../components/PlayerSetup'
import styles from './IntesaVincente.module.css'

const DEFAULT_CONFIG: IntesaConfig = {
  teams: [
    { id: 't1', name: 'Squadra Blu', players: ['', '', ''], score: 0 },
    { id: 't2', name: 'Squadra Rossa', players: ['', '', ''], score: 0 },
  ],
  timerDuration: 60,
  maxSkips: 3,
  wordsPerTurn: 10,
}

type ModalState = { open: boolean; type: 'success' | 'error' | 'info' | 'winner' | 'warning'; title: string; message?: string }

export default function IntesaVincente() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<GamePhase>('setup')
  const [config, setConfig] = useState<IntesaConfig>(DEFAULT_CONFIG)
  const [words, setWords] = useState<string[]>([])
  const [turn, setTurn] = useState<TurnState>({
    teamIndex: 0, wordIndex: 0, skipsLeft: DEFAULT_CONFIG.maxSkips,
    timerRunning: false, timeLeft: DEFAULT_CONFIG.timerDuration,
    correctThisTurn: 0, penaltyThisTurn: 0,
  })
  const [teams, setTeams] = useState<Team[]>([])
  const [turnsPlayed, setTurnsPlayed] = useState<number>(0)
  const [modal, setModal] = useState<ModalState>({ open: false, type: 'info', title: '' })
  const [wordAnim, setWordAnim] = useState('')
  const [roundsCount] = useState(2)

  const totalTurns = config.teams.length * roundsCount

  const startGame = () => {
    const shuffled = getShuffledWords()
    setWords(shuffled)
    const resetTeams = config.teams.map(t => ({ ...t, score: 0 }))
    setTeams(resetTeams)
    setTurn({
      teamIndex: 0, wordIndex: 0, skipsLeft: config.maxSkips,
      timerRunning: false, timeLeft: config.timerDuration,
      correctThisTurn: 0, penaltyThisTurn: 0,
    })
    setTurnsPlayed(0)
    setPhase('playing')
  }

  const animateWord = (type: 'correct' | 'error' | 'skip') => {
    setWordAnim(type)
    setTimeout(() => setWordAnim(''), 400)
  }

  const updateTeamScore = (delta: number) => {
    setTeams(prev => prev.map((t, i) =>
      i === turn.teamIndex ? { ...t, score: Math.max(0, t.score + delta) } : t
    ))
  }

  const nextWord = (delta: number, field: 'correctThisTurn' | 'penaltyThisTurn' | null) => {
    updateTeamScore(delta)
    setTurn(prev => ({
      ...prev,
      wordIndex: prev.wordIndex + 1,
      correctThisTurn: field === 'correctThisTurn' ? prev.correctThisTurn + 1 : prev.correctThisTurn,
      penaltyThisTurn: field === 'penaltyThisTurn' ? prev.penaltyThisTurn + 1 : prev.penaltyThisTurn,
    }))
  }

  const handleCorrect = () => {
    animateWord('correct')
    setModal({ open: true, type: 'success', title: '✅ Corretta! +1 punto', message: 'Ottimo! Prossima parola...' })
    nextWord(1, 'correctThisTurn')
    setTimeout(() => setModal(m => ({ ...m, open: false })), 1200)
  }

  const handleError = () => {
    animateWord('error')
    setModal({ open: true, type: 'error', title: '❌ Penalità! −1 punto', message: 'Attenzione alle regole!' })
    nextWord(-1, 'penaltyThisTurn')
    setTimeout(() => setModal(m => ({ ...m, open: false })), 1200)
  }

  const handleSkip = () => {
    if (turn.skipsLeft <= 0) return
    animateWord('skip')
    setTurn(prev => ({ ...prev, wordIndex: prev.wordIndex + 1, skipsLeft: prev.skipsLeft - 1 }))
  }

  const handleTimeUp = useCallback(() => {
    setTurn(prev => ({ ...prev, timerRunning: false }))
    setModal({ open: true, type: 'warning', title: '⏰ Tempo Scaduto!', message: `${teams[turn.teamIndex]?.name}: turno terminato.` })
  }, [teams, turn.teamIndex])

  const endTurn = () => {
    const nextTurns = turnsPlayed + 1
    setTurnsPlayed(nextTurns)
    setModal({ open: false, type: 'info', title: '' })

    if (nextTurns >= totalTurns) {
      setPhase('results')
      return
    }

    const nextTeamIndex = (turn.teamIndex + 1) % config.teams.length
    setTurn({
      teamIndex: nextTeamIndex,
      wordIndex: turn.wordIndex,
      skipsLeft: config.maxSkips,
      timerRunning: false,
      timeLeft: config.timerDuration,
      correctThisTurn: 0,
      penaltyThisTurn: 0,
    })
  }

  const currentWord = words[turn.wordIndex] ?? '—'
  const currentTeam = teams[turn.teamIndex]
  const scorePlayers: Player[] = teams.map(t => ({
    id: t.id, name: t.name, score: t.score, isActive: t.id === teams[turn.teamIndex]?.id
  }))
  const winner = [...teams].sort((a, b) => b.score - a.score)[0]

  /* ===== SETUP ===== */
  if (phase === 'setup') {
    return (
      <div className={styles.page}>
        <div className={styles.setupCard}>
          <button className={styles.back} onClick={() => navigate('/')}>← Home</button>
          <h1 className={styles.gameTitle}>🧠 Intesa Vincente</h1>
          <p className={styles.gameSub}>Configura la partita</p>

          <div className={styles.section}>
            <label className={styles.label}>⏱ Durata turno (secondi)</label>
            <div className={styles.numRow}>
              {[30, 45, 60, 90, 120].map(v => (
                <button key={v}
                  className={[styles.chip, config.timerDuration === v ? styles.chipActive : ''].join(' ')}
                  onClick={() => setConfig(c => ({ ...c, timerDuration: v }))}
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
                  onClick={() => setConfig(c => ({ ...c, maxSkips: v }))}
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
                  onChange={e => setConfig(c => ({
                    ...c,
                    teams: c.teams.map((t, i) => i === tidx ? { ...t, name: e.target.value } : t)
                  }))}
                  placeholder={`Nome squadra ${tidx + 1}`}
                />
              </div>
              <PlayerSetup
                label={`Giocatori`}
                players={team.players}
                onChange={players => setConfig(c => ({
                  ...c,
                  teams: c.teams.map((t, i) => i === tidx ? { ...t, players } : t)
                }))}
                min={3}
                max={8}
                placeholder="Nome giocatore"
              />
            </div>
          ))}

          <div className={styles.teamsActions}>
            {config.teams.length < 4 && (
              <Button variant="ghost" size="sm" onClick={() => setConfig(c => ({
                ...c,
                teams: [...c.teams, { id: `t${Date.now()}`, name: `Squadra ${c.teams.length + 1}`, players: ['', '', ''], score: 0 }]
              }))}>+ Aggiungi Squadra</Button>
            )}
            {config.teams.length > 2 && (
              <Button variant="ghost" size="sm" onClick={() => setConfig(c => ({ ...c, teams: c.teams.slice(0, -1) }))}>
                − Rimuovi Ultima
              </Button>
            )}
          </div>

          <Button variant="success" size="xl" fullWidth glow onClick={startGame}>
            🎮 Inizia la Partita!
          </Button>
        </div>
      </div>
    )
  }

  /* ===== RESULTS ===== */
  if (phase === 'results') {
    const sorted = [...teams].sort((a, b) => b.score - a.score)
    return (
      <div className={styles.page}>
        <div className={styles.resultsCard}>
          <div className={styles.winnerBadge}>🏆</div>
          <h1 className={styles.winnerTitle}>VINCITORE!</h1>
          <h2 className={styles.winnerName}>{winner.name}</h2>
          <p className={styles.winnerScore}>{winner.score} punti</p>

          <div className={styles.finalScores}>
            {sorted.map((t, i) => (
              <div key={t.id} className={[styles.finalRow, i === 0 ? styles.firstPlace : ''].join(' ')}>
                <span className={styles.finalRank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                <span className={styles.finalName}>{t.name}</span>
                <span className={styles.finalPts}>{t.score} pt</span>
              </div>
            ))}
          </div>

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
    <div className={styles.page}>
      <div className={styles.gameLayout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <button className={styles.back} onClick={() => { if (confirm('Tornare alla home? La partita sarà persa.')) navigate('/') }}>← Home</button>
          <ScoreBoard players={scorePlayers} accentColor="var(--blue-electric)" title="Classifica" />
          <div className={styles.turnInfo}>
            <span className={styles.turnLabel}>Turno</span>
            <span className={styles.turnVal}>{turnsPlayed + 1} / {totalTurns}</span>
          </div>
        </aside>

        {/* Main */}
        <div className={styles.gameMain}>
          <div className={styles.teamBanner} style={{ background: 'linear-gradient(135deg, var(--blue-electric), var(--violet))' }}>
            <span className={styles.teamBannerIcon}>🧠</span>
            <span>{currentTeam?.name}</span>
          </div>

          <div className={styles.timerRow}>
            <Timer
              duration={config.timerDuration}
              running={turn.timerRunning}
              onTimeUp={handleTimeUp}
              warningAt={10}
              size="lg"
            />
          </div>

          <div className={[
            styles.wordBox,
            wordAnim === 'correct' ? styles.wordCorrect : '',
            wordAnim === 'error' ? styles.wordError : '',
            wordAnim === 'skip' ? styles.wordSkip : '',
          ].filter(Boolean).join(' ')}>
            <p className={styles.wordLabel}>Parola da indovinare</p>
            <h2 className={styles.word}>{currentWord}</h2>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statVal} style={{ color: 'var(--green)' }}>{turn.correctThisTurn}</span>
              <span className={styles.statLabel}>Corrette</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statVal} style={{ color: 'var(--red)' }}>{turn.penaltyThisTurn}</span>
              <span className={styles.statLabel}>Penalità</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statVal} style={{ color: 'var(--yellow)' }}>{turn.skipsLeft}</span>
              <span className={styles.statLabel}>Passi</span>
            </div>
          </div>

          {!turn.timerRunning ? (
            <Button variant="primary" size="xl" fullWidth glow onClick={() => setTurn(t => ({ ...t, timerRunning: true }))}>
              ▶ Avvia Timer
            </Button>
          ) : (
            <>
              <div className={styles.actionGrid}>
                <Button variant="success" size="xl" onClick={handleCorrect}>✅ Corretta +1</Button>
                <Button variant="danger" size="xl" onClick={handleError}>❌ Penalità −1</Button>
                <Button variant="warning" size="lg" onClick={handleSkip} disabled={turn.skipsLeft <= 0}>⏭ Passo ({turn.skipsLeft})</Button>
                <Button variant="ghost" size="lg" onClick={() => setTurn(t => ({ ...t, timerRunning: false }))}>⏸ Pausa</Button>
              </div>
              <Button variant="outline" size="lg" fullWidth onClick={endTurn}>🔁 Fine Turno</Button>
            </>
          )}
        </div>
      </div>

      <Modal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => modal.type === 'warning' ? undefined : setModal(m => ({ ...m, open: false }))}
      >
        {modal.type === 'warning' && (
          <div style={{ marginTop: '1rem' }}>
            <Button variant="primary" size="lg" onClick={endTurn}>➡ Fine Turno</Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
