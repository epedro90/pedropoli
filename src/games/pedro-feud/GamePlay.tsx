import { useState, useRef, useEffect } from 'react'
import Button from '../../components/Button'
import type { FeudScenario, FeudGameState, RoundWinner } from './types'
import styles from './GamePlay.module.css'

interface Props {
  scenario: FeudScenario
  onExit: () => void
}

function initState(scenario: FeudScenario): FeudGameState {
  return {
    scenarioId: scenario.id,
    currentRoundIndex: 0,
    team1Name: 'Squadra 1',
    team2Name: 'Squadra 2',
    team1Score: 0,
    team2Score: 0,
    roundErrors: {},
    roundRevealedAnswers: {},
    roundBonusRevealed: {},
    roundWinners: {},
  }
}

export default function GamePlay({ scenario, onExit }: Props) {
  const totalRounds = scenario.rounds.length
  const [state, setState] = useState<FeudGameState>(() => initState(scenario))
  const [showResults, setShowResults] = useState(false)
  const [editingTeam, setEditingTeam] = useState<'team1' | 'team2' | null>(null)
  const team1InputRef = useRef<HTMLInputElement>(null)
  const team2InputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingTeam === 'team1') team1InputRef.current?.focus()
    if (editingTeam === 'team2') team2InputRef.current?.focus()
  }, [editingTeam])

  // ── derived state ──────────────────────────────────
  const roundIdx = state.currentRoundIndex
  const currentRound = scenario.rounds[roundIdx]
  const errors = state.roundErrors[roundIdx] ?? 0
  const revealedAnswers = state.roundRevealedAnswers[roundIdx] ?? currentRound.answers.map(() => false)
  const bonusRevealed = state.roundBonusRevealed[roundIdx] ?? false
  const currentWinner = state.roundWinners[roundIdx] ?? null

  // ── actions ────────────────────────────────────────
  const toggleAnswer = (ansIdx: number) => {
    setState(s => {
      const current = s.roundRevealedAnswers[s.currentRoundIndex]
        ?? scenario.rounds[s.currentRoundIndex].answers.map(() => false)
      const updated = current.map((v, i) => i === ansIdx ? !v : v)
      return { ...s, roundRevealedAnswers: { ...s.roundRevealedAnswers, [s.currentRoundIndex]: updated } }
    })
  }

  const revealAll = () => {
    setState(s => ({
      ...s,
      roundRevealedAnswers: {
        ...s.roundRevealedAnswers,
        [s.currentRoundIndex]: scenario.rounds[s.currentRoundIndex].answers.map(() => true),
      },
    }))
  }

  const hideAll = () => {
    setState(s => ({
      ...s,
      roundRevealedAnswers: {
        ...s.roundRevealedAnswers,
        [s.currentRoundIndex]: scenario.rounds[s.currentRoundIndex].answers.map(() => false),
      },
      roundBonusRevealed: { ...s.roundBonusRevealed, [s.currentRoundIndex]: false },
    }))
  }

  const toggleBonus = () => {
    setState(s => ({
      ...s,
      roundBonusRevealed: { ...s.roundBonusRevealed, [s.currentRoundIndex]: !(s.roundBonusRevealed[s.currentRoundIndex] ?? false) },
    }))
  }

  const addError = () => {
    setState(s => ({
      ...s,
      roundErrors: { ...s.roundErrors, [s.currentRoundIndex]: Math.min(3, (s.roundErrors[s.currentRoundIndex] ?? 0) + 1) },
    }))
  }

  const removeError = () => {
    setState(s => ({
      ...s,
      roundErrors: { ...s.roundErrors, [s.currentRoundIndex]: Math.max(0, (s.roundErrors[s.currentRoundIndex] ?? 0) - 1) },
    }))
  }

  const assignWinner = (team: 'team1' | 'team2') => {
    setState(s => {
      const prev: RoundWinner = s.roundWinners[s.currentRoundIndex] ?? null
      if (prev === team) return s
      let t1 = s.team1Score
      let t2 = s.team2Score
      if (prev === 'team1') t1 = Math.max(0, t1 - 1)
      if (prev === 'team2') t2 = Math.max(0, t2 - 1)
      if (team === 'team1') t1++
      else t2++
      return { ...s, team1Score: t1, team2Score: t2, roundWinners: { ...s.roundWinners, [s.currentRoundIndex]: team } }
    })
  }

  const cancelWinner = () => {
    setState(s => {
      const prev: RoundWinner = s.roundWinners[s.currentRoundIndex] ?? null
      if (!prev) return s
      let t1 = s.team1Score
      let t2 = s.team2Score
      if (prev === 'team1') t1 = Math.max(0, t1 - 1)
      if (prev === 'team2') t2 = Math.max(0, t2 - 1)
      return { ...s, team1Score: t1, team2Score: t2, roundWinners: { ...s.roundWinners, [s.currentRoundIndex]: null } }
    })
  }

  const adjustScore = (team: 'team1' | 'team2', delta: number) => {
    setState(s => ({
      ...s,
      team1Score: team === 'team1' ? Math.max(0, s.team1Score + delta) : s.team1Score,
      team2Score: team === 'team2' ? Math.max(0, s.team2Score + delta) : s.team2Score,
    }))
  }

  const goToRound = (idx: number) => {
    setState(s => ({ ...s, currentRoundIndex: idx }))
  }

  const nextRound = () => {
    if (roundIdx < totalRounds - 1) goToRound(roundIdx + 1)
  }

  const prevRound = () => {
    if (roundIdx > 0) goToRound(roundIdx - 1)
  }

  const resetRound = () => {
    setState(s => ({
      ...s,
      roundErrors: { ...s.roundErrors, [s.currentRoundIndex]: 0 },
      roundRevealedAnswers: {
        ...s.roundRevealedAnswers,
        [s.currentRoundIndex]: scenario.rounds[s.currentRoundIndex].answers.map(() => false),
      },
      roundBonusRevealed: { ...s.roundBonusRevealed, [s.currentRoundIndex]: false },
    }))
  }

  const restartGame = () => {
    setState(initState(scenario))
    setShowResults(false)
  }

  const team1Winning = state.team1Score > state.team2Score
  const team2Winning = state.team2Score > state.team1Score

  // ── Results screen ─────────────────────────────────
  if (showResults) {
    const isDraw = state.team1Score === state.team2Score
    const winnerName = team1Winning ? state.team1Name : state.team2Name
    const winnerScore = team1Winning ? state.team1Score : state.team2Score

    return (
      <div className={styles.resultsPage}>
        <div className={styles.resultsCard}>
          <div className={styles.resultsEmoji}>{isDraw ? '🤝' : '🏆'}</div>
          {isDraw ? (
            <div className={styles.resultsDraw}>Pareggio!</div>
          ) : (
            <>
              <div className={styles.resultsTitle}>VINCITORE</div>
              <div className={styles.winnerName}>{winnerName}</div>
              <div className={styles.winnerScore}>{winnerScore} {winnerScore === 1 ? 'punto' : 'punti'}</div>
            </>
          )}

          <div className={styles.finalScores}>
            {[
              { name: state.team1Name, score: state.team1Score, win: team1Winning },
              { name: state.team2Name, score: state.team2Score, win: team2Winning },
            ].map((t, i) => (
              <div key={i} className={[styles.finalRow, t.win ? styles.finalRowWin : ''].filter(Boolean).join(' ')}>
                <span className={styles.finalMedal}>{t.win ? '🥇' : isDraw ? '🥇' : '🥈'}</span>
                <span className={styles.finalTeamName}>{t.name}</span>
                <span className={styles.finalTeamScore}>{t.score}</span>
              </div>
            ))}
          </div>

          <div className={styles.roundResultsList}>
            {scenario.rounds.map((_r, i) => {
              const w: RoundWinner = state.roundWinners[i] ?? null
              return (
                <div key={i} className={styles.roundResultRow}>
                  <span className={styles.roundResultNum}>Turno {i + 1}</span>
                  {w === 'team1' && <span className={styles.roundResultWinner}>{state.team1Name}</span>}
                  {w === 'team2' && <span className={styles.roundResultWinner}>{state.team2Name}</span>}
                  {!w && <span className={styles.roundResultNone}>—</span>}
                </div>
              )
            })}
          </div>

          <div className={styles.resultsBtns}>
            <Button variant="primary" size="lg" onClick={restartGame}>🔄 Rigioca</Button>
            <Button variant="ghost" size="lg" onClick={onExit}>← Scenari</Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Game screen ────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <button className={styles.exitBtn} onClick={() => {
          if (confirm('Abbandonare la partita?')) onExit()
        }}>
          ← Scenari
        </button>
        <span className={styles.scenarioName}>{scenario.name}</span>
        <span className={styles.roundBadge}>
          Turno {roundIdx + 1} / {totalRounds}
        </span>
      </div>

      {/* Teams */}
      <div className={styles.teamsRow}>
        {/* Team 1 */}
        <div className={[
          styles.teamCard,
          styles.teamCard1,
          currentWinner === 'team1' ? styles.teamCardWin1 : '',
        ].filter(Boolean).join(' ')}>
          {currentWinner === 'team1' && (
            <span className={styles.winnerBannerText}>Turno assegnato</span>
          )}
          <div className={styles.teamNameRow}>
            {editingTeam === 'team1' ? (
              <input
                ref={team1InputRef}
                className={styles.teamNameInput}
                value={state.team1Name}
                onChange={e => setState(s => ({ ...s, team1Name: e.target.value }))}
                onBlur={() => setEditingTeam(null)}
                onKeyDown={e => e.key === 'Enter' && setEditingTeam(null)}
              />
            ) : (
              <>
                <button className={styles.teamNameBtn} onClick={() => setEditingTeam('team1')}>
                  {state.team1Name}
                </button>
                <span className={styles.editNameHint} onClick={() => setEditingTeam('team1')}>✏</span>
              </>
            )}
          </div>
          <div className={[styles.teamScore, styles.teamScore1].join(' ')}>{state.team1Score}</div>
        </div>

        {/* Team 2 */}
        <div className={[
          styles.teamCard,
          styles.teamCard2,
          currentWinner === 'team2' ? styles.teamCardWin2 : '',
        ].filter(Boolean).join(' ')}>
          {currentWinner === 'team2' && (
            <span className={styles.winnerBannerText}>Turno assegnato</span>
          )}
          <div className={styles.teamNameRow}>
            {editingTeam === 'team2' ? (
              <input
                ref={team2InputRef}
                className={styles.teamNameInput}
                value={state.team2Name}
                onChange={e => setState(s => ({ ...s, team2Name: e.target.value }))}
                onBlur={() => setEditingTeam(null)}
                onKeyDown={e => e.key === 'Enter' && setEditingTeam(null)}
              />
            ) : (
              <>
                <button className={styles.teamNameBtn} onClick={() => setEditingTeam('team2')}>
                  {state.team2Name}
                </button>
                <span className={styles.editNameHint} onClick={() => setEditingTeam('team2')}>✏</span>
              </>
            )}
          </div>
          <div className={[styles.teamScore, styles.teamScore2].join(' ')}>{state.team2Score}</div>
        </div>
      </div>

      {/* Question */}
      <div className={styles.questionCard}>
        <div className={styles.questionLabel}>Domanda {roundIdx + 1}</div>
        <div className={styles.questionText}>{currentRound.question}</div>
      </div>

      {/* Answer board */}
      <div className={styles.answersGrid}>
        {currentRound.answers.map((ans, i) => {
          const revealed = revealedAnswers[i] ?? false
          return (
            <button
              key={i}
              className={[styles.answerTile, revealed ? styles.answerTileRevealed : ''].filter(Boolean).join(' ')}
              onClick={() => toggleAnswer(i)}
            >
              {revealed ? (
                <>
                  <span className={styles.tileText}>{ans.text}</span>
                  <span className={styles.tileValue}>{ans.value}</span>
                </>
              ) : (
                <span className={styles.tileSeat}>{i + 1}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Bonus meme */}
      <button
        className={[styles.bonusTile, bonusRevealed ? styles.bonusTileRevealed : ''].filter(Boolean).join(' ')}
        onClick={toggleBonus}
      >
        <span className={styles.bonusIcon}>🎭</span>
        <div>
          <div className={styles.bonusLabel}>Bonus Meme</div>
          {bonusRevealed ? (
            <div className={styles.bonusText}>{currentRound.bonusAnswer.text}</div>
          ) : (
            <div className={styles.bonusHidden}>Clicca per rivelare</div>
          )}
        </div>
      </button>

      {/* Errors */}
      <div className={styles.errorsSection}>
        <span className={styles.errorsLabel}>Errori</span>
        <div className={[styles.errorsDisplay, errors >= 3 ? styles.errors3 : ''].filter(Boolean).join(' ')}>
          {[0, 1, 2].map(i => (
            <span key={i} className={i < errors ? styles.errorX : styles.errorXEmpty}>✗</span>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.controlsTitle}>Controlli master</div>

        {/* Answers */}
        <div className={styles.controlRow}>
          <span className={styles.controlRowLabel}>Risposte</span>
          <div className={styles.controlRowBtns}>
            <button className={styles.winBtn} onClick={revealAll}>Rivela tutte</button>
            <button className={styles.winBtn} onClick={hideAll}>Nascondi tutte</button>
          </div>
        </div>

        {/* Errors */}
        <div className={styles.controlRow}>
          <span className={styles.controlRowLabel}>Errori</span>
          <div className={styles.controlRowBtns}>
            <button className={styles.winBtn} onClick={addError}>+ Errore</button>
            <button className={styles.winBtn} onClick={removeError}>− Errore</button>
          </div>
        </div>

        {/* Round winner */}
        <div className={styles.controlRow}>
          <span className={styles.controlRowLabel}>Turno</span>
          <div className={styles.controlRowBtns}>
            <button
              className={[styles.winBtn, currentWinner === 'team1' ? styles.winBtnActive : ''].filter(Boolean).join(' ')}
              onClick={() => assignWinner('team1')}
            >
              → {state.team1Name}
            </button>
            <button
              className={[styles.winBtn, currentWinner === 'team2' ? styles.winBtnActive : ''].filter(Boolean).join(' ')}
              onClick={() => assignWinner('team2')}
            >
              → {state.team2Name}
            </button>
            <button
              className={[styles.winBtn, styles.winBtnCancel].join(' ')}
              onClick={cancelWinner}
              disabled={!currentWinner}
            >
              Annulla
            </button>
          </div>
        </div>

        {/* Manual score */}
        <div className={styles.controlRow}>
          <span className={styles.controlRowLabel}>Punteggio</span>
          <div className={styles.controlRowBtns}>
            <button className={styles.scoreBtn} onClick={() => adjustScore('team1', 1)} title={`+1 ${state.team1Name}`}>+</button>
            <button className={[styles.scoreBtn, styles.scoreBtnMinus].join(' ')} onClick={() => adjustScore('team1', -1)} title={`−1 ${state.team1Name}`}>−</button>
            <span style={{ color: 'var(--gray)', fontSize: '0.75rem', padding: '0 0.5rem', alignSelf: 'center' }}>S1</span>
            <button className={styles.scoreBtn} onClick={() => adjustScore('team2', 1)} title={`+1 ${state.team2Name}`}>+</button>
            <button className={[styles.scoreBtn, styles.scoreBtnMinus].join(' ')} onClick={() => adjustScore('team2', -1)} title={`−1 ${state.team2Name}`}>−</button>
            <span style={{ color: 'var(--gray)', fontSize: '0.75rem', padding: '0 0.5rem', alignSelf: 'center' }}>S2</span>
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.controlRow}>
          <span className={styles.controlRowLabel}>Navigazione</span>
          <div className={styles.controlRowBtns}>
            <button className={styles.winBtn} onClick={prevRound} disabled={roundIdx === 0}>← Prec.</button>
            <button className={styles.winBtn} onClick={resetRound}>↺ Reset turno</button>
            <button className={styles.winBtn} onClick={nextRound} disabled={roundIdx === totalRounds - 1}>Succ. →</button>
          </div>
        </div>

        {/* End / exit */}
        <div className={styles.controlRow}>
          <span className={styles.controlRowLabel} />
          <div className={styles.controlRowBtns}>
            <Button variant="success" size="sm" onClick={() => setShowResults(true)}>
              Termina partita
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { if (confirm('Abbandonare la partita?')) onExit() }}>
              ← Scenari
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
