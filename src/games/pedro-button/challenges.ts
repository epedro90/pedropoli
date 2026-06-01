import type { ButtonChallenge } from './types'

export const BEST_SCORE_KEY = 'pedro-button-best'

// Durata base per difficoltà (ms) — scalata ulteriormente per round
const DUR = {
  easy: 4500,
  medium: 3500,
  hard: 2800,
}

// Challenge standalone (non richiedono stato precedente)
const STANDALONE: ButtonChallenge[] = [
  // ── FACILI ─────────────────────────────────────────────────────
  {
    id: 'press-once',
    text: 'Premi una volta',
    type: 'exactClicks',
    requiredClicks: 1,
    durationMs: DUR.easy,
    successMsg: 'Preciso!',
    errorMsg: 'Dovevi premere esattamente una volta.',
    difficulty: 1,
  },
  {
    id: 'do-not-press',
    text: 'Non premere',
    type: 'noClick',
    durationMs: DUR.easy,
    successMsg: 'Ottima resistenza!',
    errorMsg: 'Non dovevi premere.',
    difficulty: 1,
  },
  {
    id: 'press-twice',
    text: 'Premi due volte',
    type: 'exactClicks',
    requiredClicks: 2,
    durationMs: DUR.easy,
    successMsg: 'Due click perfetti!',
    errorMsg: 'Dovevi premere esattamente due volte.',
    difficulty: 1,
  },
  {
    id: 'press-three',
    text: 'Premi tre volte',
    type: 'exactClicks',
    requiredClicks: 3,
    durationMs: DUR.easy,
    successMsg: 'Tre su tre!',
    errorMsg: 'Dovevi premere esattamente tre volte.',
    difficulty: 1,
  },
  {
    id: 'no-press-hold',
    text: 'Tieni le mani ferme',
    type: 'noClick',
    durationMs: DUR.easy,
    successMsg: 'Nervi saldi!',
    errorMsg: 'Le mani non erano ferme.',
    difficulty: 1,
  },
  {
    id: 'min-five',
    text: 'Premi almeno 5 volte',
    type: 'minClicks',
    minClicks: 5,
    durationMs: DUR.easy + 500,
    successMsg: 'Che velocità!',
    errorMsg: 'Servivano almeno 5 click.',
    difficulty: 1,
  },
  // ── MEDI ───────────────────────────────────────────────────────
  {
    id: 'even-8',
    text: 'Premi solo se il numero è pari',
    type: 'conditionNumberEven',
    number: 8,
    durationMs: DUR.medium,
    successMsg: 'Corretto, 8 è pari!',
    errorMsg: '8 è pari: dovevi premere.',
    difficulty: 2,
  },
  {
    id: 'even-7',
    text: 'Premi solo se il numero è pari',
    type: 'conditionNumberEven',
    number: 7,
    durationMs: DUR.medium,
    successMsg: 'Giusto, 7 è dispari!',
    errorMsg: '7 è dispari: non dovevi premere.',
    difficulty: 2,
  },
  {
    id: 'odd-13',
    text: 'Premi solo se il numero è dispari',
    type: 'conditionNumberOdd',
    number: 13,
    durationMs: DUR.medium,
    successMsg: 'Esatto, 13 è dispari!',
    errorMsg: '13 è dispari: dovevi premere.',
    difficulty: 2,
  },
  {
    id: 'odd-12',
    text: 'Premi solo se il numero è dispari',
    type: 'conditionNumberOdd',
    number: 12,
    durationMs: DUR.medium,
    successMsg: 'Giusto, 12 è pari!',
    errorMsg: '12 è pari: non dovevi premere.',
    difficulty: 2,
  },
  {
    id: 'delayed-half',
    text: 'Premi solo dopo metà del tempo',
    type: 'delayedClick',
    delayFraction: 0.5,
    durationMs: DUR.medium + 500,
    successMsg: 'Tempismo perfetto!',
    errorMsg: 'Hai premuto troppo presto.',
    difficulty: 2,
  },
  {
    id: 'before-fast',
    text: 'Premi subito, prima del primo secondo',
    type: 'clickBeforeTime',
    beforeFraction: 0.28,
    durationMs: DUR.medium,
    successMsg: 'Super veloce!',
    errorMsg: 'Hai aspettato troppo.',
    difficulty: 2,
  },
  {
    id: 'max-two',
    text: 'Premi al massimo 2 volte',
    type: 'maxClicks',
    maxClicks: 2,
    durationMs: DUR.medium,
    successMsg: 'Autocontrollo!',
    errorMsg: 'Hai premuto troppe volte.',
    difficulty: 2,
  },
  {
    id: 'color-match-green',
    text: 'Premi se il pulsante è VERDE',
    type: 'conditionColorMatch',
    buttonColor: 'green',
    colorWord: 'VERDE',
    durationMs: DUR.medium,
    successMsg: 'Il pulsante era verde!',
    errorMsg: 'Il pulsante era verde: dovevi premere.',
    difficulty: 2,
  },
  {
    id: 'color-mismatch-blue',
    text: 'Premi se il pulsante è BLU',
    type: 'conditionColorMatch',
    buttonColor: 'red',
    colorWord: 'BLU',
    durationMs: DUR.medium,
    successMsg: 'Il pulsante non era blu!',
    errorMsg: 'Il pulsante era rosso, non blu: non dovevi premere.',
    difficulty: 2,
  },
  {
    id: 'triangle-corners',
    text: 'Premi tante volte quanti angoli ha ▲',
    type: 'shapeCorners',
    shape: 'triangle',
    requiredClicks: 3,
    durationMs: DUR.medium + 500,
    successMsg: 'Tre angoli, tre click!',
    errorMsg: 'Un triangolo ha 3 angoli.',
    difficulty: 2,
  },
  {
    id: 'square-corners',
    text: 'Premi tante volte quanti angoli ha ■',
    type: 'shapeCorners',
    shape: 'square',
    requiredClicks: 4,
    durationMs: DUR.medium + 500,
    successMsg: 'Quattro angoli, quattro click!',
    errorMsg: 'Un quadrato ha 4 angoli.',
    difficulty: 2,
  },
  // ── DIFFICILI ──────────────────────────────────────────────────
  {
    id: 'color-match-yellow',
    text: 'Premi se parola e colore coincidono',
    type: 'conditionColorMatch',
    buttonColor: 'yellow',
    colorWord: 'GIALLO',
    durationMs: DUR.hard,
    successMsg: 'Colore e parola coincidono!',
    errorMsg: 'Parola e colore coincidevano: dovevi premere.',
    difficulty: 3,
  },
  {
    id: 'color-stroop-red',
    text: 'Premi se parola e colore coincidono',
    type: 'conditionColorMatch',
    buttonColor: 'red',
    colorWord: 'VERDE',
    durationMs: DUR.hard,
    successMsg: 'Non coincidevano!',
    errorMsg: 'La parola era VERDE ma il pulsante era rosso: non dovevi premere.',
    difficulty: 3,
  },
  {
    id: 'pentagon-corners',
    text: 'Premi tante volte quanti angoli ha ⬠',
    type: 'shapeCorners',
    shape: 'pentagon',
    requiredClicks: 5,
    durationMs: DUR.hard + 800,
    successMsg: 'Cinque angoli, cinque click!',
    errorMsg: 'Un pentagono ha 5 angoli.',
    difficulty: 3,
  },
  {
    id: 'delayed-late',
    text: 'Premi solo quando manca meno di un terzo',
    type: 'delayedClick',
    delayFraction: 0.67,
    durationMs: DUR.hard + 1000,
    successMsg: 'Aspettato al momento giusto!',
    errorMsg: 'Hai premuto troppo presto.',
    difficulty: 3,
  },
  {
    id: 'range-clicks',
    text: 'Premi tra 3 e 4 volte',
    type: 'minClicks',
    minClicks: 3,
    maxClicks: 4,
    durationMs: DUR.hard + 500,
    successMsg: 'Nella fascia giusta!',
    errorMsg: 'Servivano tra 3 e 4 click.',
    difficulty: 3,
  },
  {
    id: 'even-16',
    text: 'Premi solo se il numero è pari',
    type: 'conditionNumberEven',
    number: 16,
    durationMs: DUR.hard,
    successMsg: '16 è pari!',
    errorMsg: '16 è pari: dovevi premere.',
    difficulty: 3,
  },
  {
    id: 'hexagon-corners',
    text: 'Premi tante volte quanti angoli ha ⬡',
    type: 'shapeCorners',
    shape: 'hexagon',
    requiredClicks: 6,
    durationMs: DUR.hard + 1500,
    successMsg: 'Sei angoli, sei click!',
    errorMsg: 'Un esagono ha 6 angoli.',
    difficulty: 3,
  },
  {
    id: 'no-press-blink',
    text: 'Non premere anche se lampeggia',
    type: 'noClick',
    durationMs: DUR.hard,
    successMsg: 'Non ti sei fatto fregare!',
    errorMsg: 'Non dovevi premere.',
    difficulty: 3,
  },
]

// Coppie memory/recall: [memorizza, ...recall]. recall può essere vero o falso
export type MemoryPair = {
  memory: ButtonChallenge
  recalls: ButtonChallenge[]
}

export const MEMORY_PAIRS: MemoryPair[] = [
  {
    memory: {
      id: 'memory-47',
      text: 'Memorizza questo numero: 47',
      type: 'memoryNumber',
      number: 47,
      durationMs: 3500,
      successMsg: 'Memorizzato!',
      errorMsg: '',
      difficulty: 2,
    },
    recalls: [
      {
        id: 'recall-47-true',
        text: 'Premi se il numero era 47',
        type: 'recallMemoryNumber',
        number: 47,
        durationMs: 3000,
        successMsg: 'Memoria di ferro!',
        errorMsg: 'Il numero era 47: dovevi premere.',
        difficulty: 2,
      },
      {
        id: 'recall-47-false',
        text: 'Premi se il numero era 23',
        type: 'recallMemoryNumber',
        number: 23,
        durationMs: 3000,
        successMsg: 'Giusto, non era 23!',
        errorMsg: 'Il numero era 47, non 23: non dovevi premere.',
        difficulty: 2,
      },
    ],
  },
  {
    memory: {
      id: 'memory-81',
      text: 'Memorizza questo numero: 81',
      type: 'memoryNumber',
      number: 81,
      durationMs: 3500,
      successMsg: 'Memorizzato!',
      errorMsg: '',
      difficulty: 3,
    },
    recalls: [
      {
        id: 'recall-81-true',
        text: 'Premi se il numero era 81',
        type: 'recallMemoryNumber',
        number: 81,
        durationMs: 2800,
        successMsg: 'Memoria perfetta!',
        errorMsg: 'Il numero era 81: dovevi premere.',
        difficulty: 3,
      },
      {
        id: 'recall-81-false',
        text: 'Premi se il numero era 55',
        type: 'recallMemoryNumber',
        number: 55,
        durationMs: 2800,
        successMsg: 'Giusto, non era 55!',
        errorMsg: 'Il numero era 81, non 55: non dovevi premere.',
        difficulty: 3,
      },
    ],
  },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

/**
 * Scala la durata di una challenge in base al round (round 0-based).
 * Nei primissimi round si aggiunge tempo extra che si riduce gradualmente.
 */
function scaleDuration(base: number, round: number): number {
  // round 0-3: +1500ms, 4-7: +800ms, 8-11: +200ms, 12+: nessun bonus
  const bonus = round < 4 ? 1500 : round < 8 ? 800 : round < 12 ? 200 : 0
  return base + bonus
}

export function buildSequence(targetLength: number): ButtonChallenge[] {
  const easy = shuffle(STANDALONE.filter(c => c.difficulty === 1))
  const medium = shuffle(STANDALONE.filter(c => c.difficulty === 2))
  const hard = shuffle(STANDALONE.filter(c => c.difficulty === 3))

  const result: ButtonChallenge[] = []

  // Slot 0-3: solo facili
  for (let i = 0; i < 4 && result.length < targetLength; i++) {
    result.push(easy[i % easy.length])
  }

  // Slot 4-5: facili + primo medio
  result.push(easy[4 % easy.length])
  result.push(medium[0])

  // Slot 6-7: medi
  result.push(medium[1 % medium.length])
  result.push(medium[2 % medium.length])

  // Slot 8: prima coppia memory (memory-47)
  const pair0 = MEMORY_PAIRS[0]
  result.push(pair0.memory)
  // Slot 9: uno dei recall della coppia 0
  const recall0 = shuffle(pair0.recalls)[0]
  result.push(recall0)

  // Slot 10-11: medi/difficili
  result.push(medium[3 % medium.length])
  result.push(hard[0 % hard.length])

  // Slot 12: seconda coppia memory
  const pair1 = MEMORY_PAIRS[1]
  result.push(pair1.memory)
  // Slot 13: recall coppia 1 (preferibilmente l'altro rispetto al primo)
  const recall1 = shuffle(pair1.recalls)[0]
  result.push(recall1)

  // Slot 14+: pool misto difficile
  const mixPool = shuffle([...medium, ...hard])
  for (let i = 14; result.length < targetLength; i++) {
    result.push(mixPool[(i - 14) % mixPool.length])
  }

  // Applica scala durata per ogni slot
  return result.slice(0, targetLength).map((ch, idx) => ({
    ...ch,
    durationMs: scaleDuration(ch.durationMs, idx),
  }))
}

export function getShapeEmoji(shape: string): string {
  const map: Record<string, string> = {
    triangle: '▲',
    square: '■',
    pentagon: '⬠',
    hexagon: '⬡',
  }
  return map[shape] ?? '?'
}
