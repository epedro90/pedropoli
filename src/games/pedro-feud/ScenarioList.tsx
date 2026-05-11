import { useState, useRef } from 'react'
import Button from '../../components/Button'
import type { FeudScenario } from './types'
import { BASE_SCENARIOS } from './data'
import {
  loadCustomScenarios,
  upsertCustomScenario,
  deleteCustomScenario,
  resetLocalData,
  generateId,
  downloadJSON,
} from './storage'
import styles from './PedroFeud.module.css'

interface Props {
  onPlay: (scenario: FeudScenario) => void
  onEdit: (scenario: FeudScenario) => void
  onCreate: () => void
  onBack: () => void
}

type ModalType = 'ai-generate' | 'import' | 'confirm-delete' | 'confirm-reset' | null

const AI_TONES = ['Divertente', 'Culturale', 'Sportivo', 'Cinematografico', 'Nostalgico', 'Gastronomico']

function buildAiPrompt(theme: string, tone: string): string {
  return `Genera uno scenario originale per un gioco stile survey game / Family Feud.

Tema: ${theme}
Tono: ${tone}
Lingua: italiano.
Numero di turni: 15.

Ogni turno deve avere:
- una domanda originale;
- da 5 a 8 risposte plausibili;
- ogni risposta deve avere "text" e "value";
- "value" è un numero da 1 a 100 che rappresenta solo popolarità/peso visivo, non punteggio;
- le risposte devono essere ordinate dalla più comune alla meno comune;
- una "bonusAnswer" ironica/meme senza value.

Non copiare domande da giochi esistenti.
Non ripetere domande.
Non usare contenuti offensivi o inadatti a una serata tra amici.

Restituisci solo JSON valido, senza markdown, commenti o testo esterno.

Schema:

{
  "name": "...",
  "description": "...",
  "rounds": [
    {
      "roundNumber": 1,
      "question": "...",
      "answers": [
        { "text": "...", "value": 80 }
      ],
      "bonusAnswer": {
        "text": "..."
      }
    }
  ]
}

Il JSON deve contenere esattamente 15 round.`
}

export default function ScenarioList({ onPlay, onEdit, onCreate, onBack }: Props) {
  const [customScenarios, setCustomScenarios] = useState<FeudScenario[]>(() => loadCustomScenarios())
  const [modal, setModal] = useState<ModalType>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  // AI generate state
  const [aiTheme, setAiTheme] = useState('')
  const [aiTone, setAiTone] = useState(AI_TONES[0])
  const [aiPromptVisible, setAiPromptVisible] = useState(false)
  const [aiJsonPaste, setAiJsonPaste] = useState('')
  const [aiError, setAiError] = useState('')
  const [aiCopied, setAiCopied] = useState(false)

  // Import state
  const [importError, setImportError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reload = () => setCustomScenarios(loadCustomScenarios())

  const isBase = (id: string) => BASE_SCENARIOS.some(s => s.id === id)

  const handleEdit = (scenario: FeudScenario) => {
    if (isBase(scenario.id)) {
      const copy: FeudScenario = {
        ...structuredClone(scenario) as FeudScenario,
        id: generateId(),
        name: `${scenario.name} (copia)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      onEdit(copy)
    } else {
      onEdit(scenario)
    }
  }

  const handleDuplicate = (scenario: FeudScenario) => {
    const copy: FeudScenario = {
      ...structuredClone(scenario) as FeudScenario,
      id: generateId(),
      name: `${scenario.name} (copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    upsertCustomScenario(copy)
    reload()
  }

  const handleExportSingle = (scenario: FeudScenario) => {
    const slug = scenario.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    downloadJSON(scenario, `pedro-feud-${slug}.json`)
  }

  const handleExportAll = () => {
    if (customScenarios.length === 0) return
    downloadJSON({ scenarios: customScenarios }, 'pedro-feud-scenari-personalizzati.json')
  }

  const handleDeleteConfirm = (id: string) => {
    setDeleteTargetId(id)
    setModal('confirm-delete')
  }

  const handleDeleteExecute = () => {
    if (!deleteTargetId) return
    deleteCustomScenario(deleteTargetId)
    reload()
    setModal(null)
    setDeleteTargetId(null)
  }

  const handleResetExecute = () => {
    resetLocalData()
    reload()
    setModal(null)
  }

  // AI generate
  const handleShowPrompt = () => {
    if (!aiTheme.trim()) { setAiError('Inserisci un tema.'); return }
    setAiError('')
    setAiPromptVisible(true)
  }

  const handleCopyPrompt = () => {
    const prompt = buildAiPrompt(aiTheme, aiTone)
    navigator.clipboard.writeText(prompt).then(() => {
      setAiCopied(true)
      setTimeout(() => setAiCopied(false), 2000)
    }).catch(() => undefined)
  }

  const handleImportAiJson = () => {
    setAiError('')
    try {
      const raw: unknown = JSON.parse(aiJsonPaste)
      const scenario = parseImportedScenario(raw)
      upsertCustomScenario(scenario)
      reload()
      setModal(null)
      setAiJsonPaste('')
      setAiTheme('')
      setAiPromptVisible(false)
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'JSON non valido.')
    }
  }

  const closeAiModal = () => {
    setModal(null)
    setAiError('')
    setAiPromptVisible(false)
    setAiJsonPaste('')
  }

  // Import JSON file
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const raw: unknown = JSON.parse(evt.target?.result as string)
        const scenario = parseImportedScenario(raw)
        upsertCustomScenario(scenario)
        reload()
        setModal(null)
        setImportError('')
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'File non valido.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleExportAllCustom = () => {
    if (customScenarios.length === 0) {
      alert('Nessuno scenario personalizzato da esportare.')
      return
    }
    handleExportAll()
  }

  const allScenarios: Array<{ scenario: FeudScenario; base: boolean }> = [
    ...BASE_SCENARIOS.map(s => ({ scenario: s, base: true })),
    ...customScenarios.map(s => ({ scenario: s, base: false })),
  ]

  const aiPrompt = aiTheme.trim() ? buildAiPrompt(aiTheme, aiTone) : ''

  return (
    <div className={styles.page}>
      <div className={styles.listWrap}>
        <div className={styles.listHeader}>
          <button className={styles.backBtn} onClick={onBack}>← Home</button>
          <h1 className={styles.listTitle}>
            Pedro <span className={styles.listTitleAccent}>Feud</span>
          </h1>
        </div>

        <div className={styles.listActions}>
          <Button variant="primary" size="sm" onClick={onCreate}>+ Crea scenario</Button>
          <Button variant="ghost" size="sm" onClick={() => { setModal('ai-generate'); setAiPromptVisible(false) }}>
            ✨ Genera con AI
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setImportError(''); setModal('import') }}>
            ↑ Importa JSON
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExportAllCustom}>
            ↓ Esporta tutti
          </Button>
          <Button variant="danger" size="sm" onClick={() => setModal('confirm-reset')}>
            ⚠ Reset dati
          </Button>
        </div>

        <div className={styles.scenarioGrid}>
          {allScenarios.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyEmoji}>🎙</div>
              <div className={styles.emptyText}>Nessuno scenario disponibile. Crea il primo!</div>
            </div>
          )}
          {allScenarios.map(({ scenario, base }) => (
            <div key={scenario.id} className={styles.scenarioCard}>
              <div className={styles.scenarioIcon}>🎙</div>
              <div className={styles.scenarioInfo}>
                <div className={styles.scenarioName}>{scenario.name}</div>
                {scenario.description && (
                  <div className={styles.scenarioDesc}>{scenario.description}</div>
                )}
                <div className={styles.scenarioMeta}>
                  <span className={[styles.badge, base ? styles.badgeBase : styles.badgeCustom].join(' ')}>
                    {base ? 'Base' : 'Personalizzato'}
                  </span>
                  <span className={[styles.badge, styles.badgeRounds].join(' ')}>
                    {scenario.rounds.length} turni
                  </span>
                </div>
              </div>
              <div className={styles.scenarioBtns}>
                <Button variant="primary" size="sm" onClick={() => onPlay(scenario)}>▶ Gioca</Button>
                <button className={styles.iconBtn} onClick={() => handleEdit(scenario)}>✏ Modifica</button>
                <button className={styles.iconBtn} onClick={() => handleDuplicate(scenario)}>⧉ Duplica</button>
                <button className={styles.iconBtn} onClick={() => handleExportSingle(scenario)}>↓ JSON</button>
                {!base && (
                  <button
                    className={[styles.iconBtn, styles.iconBtnDanger].join(' ')}
                    onClick={() => handleDeleteConfirm(scenario.id)}
                  >
                    🗑
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Generate modal */}
      {modal === 'ai-generate' && (
        <div className={styles.modalOverlay} onClick={closeAiModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalTitle}>✨ Genera scenario con AI</div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tema</label>
              <input
                className={styles.formInput}
                placeholder="es. Sport italiano, Cucina, Anni '90..."
                value={aiTheme}
                onChange={e => setAiTheme(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tono</label>
              <select
                className={styles.formSelect}
                value={aiTone}
                onChange={e => setAiTone(e.target.value)}
              >
                {AI_TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {!aiPromptVisible && (
              <Button variant="primary" size="md" onClick={handleShowPrompt}>
                Genera prompt
              </Button>
            )}

            {aiError && !aiPromptVisible && (
              <div className={styles.errorList}>
                <div className={styles.errorItem}>{aiError}</div>
              </div>
            )}

            {aiPromptVisible && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Prompt generato — copial e incollalo in Claude o ChatGPT</label>
                  <div className={styles.promptBox}>{aiPrompt}</div>
                  <div className={styles.promptActions}>
                    <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
                      {aiCopied ? '✓ Copiato!' : '📋 Copia prompt'}
                    </Button>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Incolla qui il JSON restituito dall'AI</label>
                  <textarea
                    className={styles.formTextarea}
                    style={{ minHeight: 120 }}
                    placeholder='{"name": "...", "description": "...", "rounds": [...]}'
                    value={aiJsonPaste}
                    onChange={e => setAiJsonPaste(e.target.value)}
                  />
                </div>

                {aiError && (
                  <div className={styles.errorList}>
                    <div className={styles.errorItem}>{aiError}</div>
                  </div>
                )}

                <div className={styles.modalActions}>
                  <Button variant="ghost" size="md" onClick={closeAiModal}>Annulla</Button>
                  <Button variant="success" size="md" onClick={handleImportAiJson} disabled={!aiJsonPaste.trim()}>
                    Importa scenario
                  </Button>
                </div>
              </>
            )}

            {!aiPromptVisible && (
              <div className={styles.modalActions}>
                <Button variant="ghost" size="md" onClick={closeAiModal}>Annulla</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Import JSON modal */}
      {modal === 'import' && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalTitle}>↑ Importa scenario JSON</div>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
              Seleziona un file JSON esportato da Pedro Feud. Può contenere un singolo scenario
              o un oggetto <code style={{ color: '#f59e0b' }}>&#123;"scenarios": [...]&#125;</code>.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              style={{ display: 'none' }}
              onChange={handleFileImport}
            />

            {importError && (
              <div className={styles.errorList}>
                <div className={styles.errorItem}>{importError}</div>
              </div>
            )}

            <div className={styles.modalActions}>
              <Button variant="ghost" size="md" onClick={() => setModal(null)}>Annulla</Button>
              <Button variant="primary" size="md" onClick={() => fileInputRef.current?.click()}>
                Scegli file
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {modal === 'confirm-delete' && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalTitle}>🗑 Elimina scenario</div>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
              Sei sicuro di voler eliminare questo scenario? L'operazione non è reversibile.
            </p>
            <div className={styles.modalActions}>
              <Button variant="ghost" size="md" onClick={() => setModal(null)}>Annulla</Button>
              <Button variant="danger" size="md" onClick={handleDeleteExecute}>Elimina</Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm reset */}
      {modal === 'confirm-reset' && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalTitle}>⚠ Reset dati locali</div>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
              Tutti gli scenari personalizzati verranno eliminati. Gli scenari base rimarranno invariati.
            </p>
            <div className={styles.modalActions}>
              <Button variant="ghost" size="md" onClick={() => setModal(null)}>Annulla</Button>
              <Button variant="danger" size="md" onClick={handleResetExecute}>Reset</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── helpers ───────────────────────────────────────────

function parseImportedScenario(raw: unknown): FeudScenario {
  if (typeof raw !== 'object' || raw === null) throw new Error('JSON non valido: deve essere un oggetto.')

  // Support { scenarios: [...] } envelope — take the first scenario
  if ('scenarios' in raw) {
    const env = raw as { scenarios: unknown }
    if (!Array.isArray(env.scenarios) || env.scenarios.length === 0)
      throw new Error('Nessuno scenario trovato nell\'array "scenarios".')
    return parseSingleScenario(env.scenarios[0] as unknown)
  }

  return parseSingleScenario(raw)
}

function parseSingleScenario(raw: unknown): FeudScenario {
  if (typeof raw !== 'object' || raw === null) throw new Error('Scenario non valido.')
  const obj = raw as Record<string, unknown>

  if (typeof obj.name !== 'string' || !obj.name.trim()) throw new Error('Il campo "name" è obbligatorio.')
  if (!Array.isArray(obj.rounds)) throw new Error('Il campo "rounds" deve essere un array.')
  if (obj.rounds.length !== 15) throw new Error(`Lo scenario deve avere esattamente 15 round (trovati: ${obj.rounds.length}).`)

  const rounds = (obj.rounds as unknown[]).map((r, i) => {
    if (typeof r !== 'object' || r === null) throw new Error(`Round ${i + 1}: formato non valido.`)
    const rObj = r as Record<string, unknown>
    if (typeof rObj.question !== 'string' || !rObj.question.trim()) throw new Error(`Round ${i + 1}: la domanda è obbligatoria.`)
    if (!Array.isArray(rObj.answers)) throw new Error(`Round ${i + 1}: "answers" deve essere un array.`)
    if (rObj.answers.length < 1 || rObj.answers.length > 8) throw new Error(`Round ${i + 1}: le risposte devono essere tra 1 e 8 (trovate: ${rObj.answers.length}).`)
    if (typeof rObj.bonusAnswer !== 'object' || rObj.bonusAnswer === null) throw new Error(`Round ${i + 1}: "bonusAnswer" mancante.`)
    const bonus = rObj.bonusAnswer as Record<string, unknown>
    if (typeof bonus.text !== 'string' || !bonus.text.trim()) throw new Error(`Round ${i + 1}: il testo della bonusAnswer è obbligatorio.`)

    const answers = (rObj.answers as unknown[]).map((a, j) => {
      if (typeof a !== 'object' || a === null) throw new Error(`Round ${i + 1}, risposta ${j + 1}: formato non valido.`)
      const aObj = a as Record<string, unknown>
      if (typeof aObj.text !== 'string' || !aObj.text.trim()) throw new Error(`Round ${i + 1}, risposta ${j + 1}: "text" obbligatorio.`)
      const val = typeof aObj.value === 'number' ? aObj.value : Number(aObj.value)
      if (isNaN(val)) throw new Error(`Round ${i + 1}, risposta ${j + 1}: "value" deve essere un numero.`)
      return { text: aObj.text, value: val }
    })

    return {
      roundNumber: i + 1,
      question: rObj.question as string,
      answers,
      bonusAnswer: { text: bonus.text as string },
    }
  })

  return {
    id: typeof obj.id === 'string' && obj.id ? obj.id : generateId(),
    name: (obj.name as string).trim(),
    description: typeof obj.description === 'string' ? obj.description : undefined,
    createdAt: typeof obj.createdAt === 'string' ? obj.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rounds,
  }
}

