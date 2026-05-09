import { useState } from 'react'
import Button from '../../components/Button'
import type { FeudScenario } from './types'
import { BASE_SCENARIOS } from './data'
import { loadCustomScenarios, generateId } from './storage'
import { validateScenario, roundHasErrors } from './validation'
import type { ValidationError } from './types'
import styles from './PedroFeud.module.css'

interface Props {
  scenario: FeudScenario | null   // null = create new
  onSave: (scenario: FeudScenario) => void
  onCancel: () => void
}

interface DraftAnswer {
  text: string
  value: string
}

interface DraftRound {
  question: string
  answers: DraftAnswer[]
  bonusText: string
}

interface DraftState {
  id: string
  name: string
  description: string
  createdAt: string
  rounds: DraftRound[]
}

function emptyDraft(): DraftState {
  return {
    id: generateId(),
    name: '',
    description: '',
    createdAt: new Date().toISOString(),
    rounds: Array.from({ length: 15 }, () => ({
      question: '',
      answers: [
        { text: '', value: '' },
        { text: '', value: '' },
        { text: '', value: '' },
        { text: '', value: '' },
        { text: '', value: '' },
      ],
      bonusText: '',
    })),
  }
}

function fromScenario(s: FeudScenario): DraftState {
  return {
    id: s.id,
    name: s.name,
    description: s.description ?? '',
    createdAt: s.createdAt ?? new Date().toISOString(),
    rounds: s.rounds.map(r => ({
      question: r.question,
      answers: r.answers.map(a => ({ text: a.text, value: String(a.value) })),
      bonusText: r.bonusAnswer.text,
    })),
  }
}

function toScenario(draft: DraftState): FeudScenario {
  return {
    id: draft.id,
    name: draft.name.trim(),
    description: draft.description.trim() || undefined,
    createdAt: draft.createdAt,
    updatedAt: new Date().toISOString(),
    rounds: draft.rounds.map((r, i) => ({
      roundNumber: i + 1,
      question: r.question.trim(),
      answers: r.answers.map(a => ({
        text: a.text.trim(),
        value: Number(a.value) || 0,
      })),
      bonusAnswer: { text: r.bonusText.trim() },
    })),
  }
}

export default function ScenarioEditor({ scenario, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<DraftState>(() =>
    scenario ? fromScenario(scenario) : emptyDraft()
  )
  const [activeRound, setActiveRound] = useState(0)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [triedSave, setTriedSave] = useState(false)

  const isNew = scenario === null

  const allOtherScenarios = [
    ...BASE_SCENARIOS,
    ...loadCustomScenarios(),
  ].filter(s => s.id !== draft.id)

  const updateRound = (idx: number, updater: (r: DraftRound) => DraftRound) => {
    setDraft(d => ({
      ...d,
      rounds: d.rounds.map((r, i) => i === idx ? updater(r) : r),
    }))
  }

  const updateAnswer = (roundIdx: number, ansIdx: number, field: 'text' | 'value', val: string) => {
    updateRound(roundIdx, r => ({
      ...r,
      answers: r.answers.map((a, i) => i === ansIdx ? { ...a, [field]: val } : a),
    }))
  }

  const addAnswer = (roundIdx: number) => {
    updateRound(roundIdx, r => ({
      ...r,
      answers: [...r.answers, { text: '', value: '' }],
    }))
  }

  const removeAnswer = (roundIdx: number, ansIdx: number) => {
    updateRound(roundIdx, r => ({
      ...r,
      answers: r.answers.filter((_, i) => i !== ansIdx),
    }))
  }

  const handleSave = () => {
    setTriedSave(true)
    const draftScenario = toScenario(draft)
    const errs = validateScenario(draftScenario, allOtherScenarios)
    setErrors(errs)
    if (errs.length > 0) {
      const firstRoundErr = errs.find(e => e.field.startsWith('round['))
      if (firstRoundErr) {
        const match = firstRoundErr.field.match(/round\[(\d+)\]/)
        if (match) setActiveRound(parseInt(match[1]))
      }
      return
    }
    onSave(draftScenario)
  }

  const round = draft.rounds[activeRound]
  const title = scenario
    ? `Modifica: ${scenario.name}`
    : 'Nuovo scenario'

  const globalErrors = errors.filter(e => e.field === 'name' || e.field === 'rounds')
  const roundErrors = errors.filter(e => e.field.startsWith(`round[${activeRound}]`))

  return (
    <div className={styles.page}>
      <div className={styles.editorWrap}>
        <div className={styles.editorHeader}>
          <button className={styles.backBtn} onClick={onCancel}>← Scenari</button>
          <h1 className={styles.editorTitle}>{title}</h1>
        </div>

        {/* Metadata */}
        <div className={styles.metaCard}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nome scenario *</label>
            <input
              className={styles.formInput}
              placeholder="es. Serata tra amici"
              value={draft.name}
              onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Descrizione (opzionale)</label>
            <input
              className={styles.formInput}
              placeholder="es. Domande leggere e divertenti"
              value={draft.description}
              onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
            />
          </div>
        </div>

        {/* Global errors */}
        {triedSave && globalErrors.length > 0 && (
          <div className={styles.errorList}>
            {globalErrors.map((e, i) => (
              <div key={i} className={styles.errorItem}>{e.message}</div>
            ))}
          </div>
        )}

        {/* Round tabs */}
        <div className={styles.roundTabs}>
          {draft.rounds.map((_, i) => {
            const hasErr = triedSave && roundHasErrors(i, errors)
            return (
              <button
                key={i}
                className={[
                  styles.roundTab,
                  activeRound === i ? styles.roundTabActive : '',
                  hasErr ? styles.roundTabError : '',
                ].filter(Boolean).join(' ')}
                onClick={() => setActiveRound(i)}
              >
                {i + 1}
              </button>
            )
          })}
        </div>

        {/* Round form */}
        <div className={styles.roundCard}>
          <div className={styles.roundHeading}>Turno {activeRound + 1}</div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Domanda *</label>
            <textarea
              className={styles.formTextarea}
              placeholder='es. "Nomina una cosa che le persone dimenticano quando partono per un viaggio."'
              value={round.question}
              onChange={e => updateRound(activeRound, r => ({ ...r, question: e.target.value }))}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Risposte (1–8) — con valore di popolarità 1-100</label>
            <div className={styles.answersTable}>
              {round.answers.map((ans, j) => (
                <div key={j} className={styles.answerRow}>
                  <div className={styles.answerNum}>{j + 1}</div>
                  <input
                    className={[styles.formInput, styles.answerTextInput].join(' ')}
                    placeholder="Risposta..."
                    value={ans.text}
                    onChange={e => updateAnswer(activeRound, j, 'text', e.target.value)}
                  />
                  <input
                    className={[styles.formInput, styles.answerValueInput].join(' ')}
                    type="number"
                    placeholder="1-100"
                    min={1}
                    max={100}
                    value={ans.value}
                    onChange={e => updateAnswer(activeRound, j, 'value', e.target.value)}
                  />
                  <button
                    className={styles.deleteBtn}
                    onClick={() => removeAnswer(activeRound, j)}
                    disabled={round.answers.length <= 1}
                    title="Rimuovi risposta"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              className={styles.addAnswerBtn}
              onClick={() => addAnswer(activeRound)}
              disabled={round.answers.length >= 8}
            >
              + Aggiungi risposta
            </button>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Risposta Bonus Meme (ironica, senza valore) *</label>
            <input
              className={styles.formInput}
              placeholder='es. "La voglia di tornare al lavoro"'
              value={round.bonusText}
              onChange={e => updateRound(activeRound, r => ({ ...r, bonusText: e.target.value }))}
            />
          </div>

          {/* Round-level errors */}
          {triedSave && roundErrors.length > 0 && (
            <div className={styles.errorList}>
              {roundErrors.map((e, i) => (
                <div key={i} className={styles.errorItem}>{e.message}</div>
              ))}
            </div>
          )}

          <div className={styles.roundNav}>
            <Button
              variant="ghost"
              size="sm"
              disabled={activeRound === 0}
              onClick={() => setActiveRound(r => r - 1)}
            >
              ← Precedente
            </Button>
            <span style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>
              Turno {activeRound + 1} / 15
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={activeRound === 14}
              onClick={() => setActiveRound(r => r + 1)}
            >
              Successivo →
            </Button>
          </div>
        </div>

        <div className={styles.editorFooter}>
          {!isNew && (
            <span style={{ color: 'var(--gray)', fontSize: '0.82rem', alignSelf: 'center' }}>
              {scenario ? 'ID: ' + draft.id.slice(0, 28) + '…' : ''}
            </span>
          )}
          <Button variant="ghost" size="md" onClick={onCancel}>Annulla</Button>
          <Button variant="primary" size="md" glow onClick={handleSave}>
            Salva scenario
          </Button>
        </div>
      </div>
    </div>
  )
}
