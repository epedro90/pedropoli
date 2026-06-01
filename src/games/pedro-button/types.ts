export type ChallengeType =
  | 'exactClicks'
  | 'minClicks'
  | 'maxClicks'
  | 'noClick'
  | 'delayedClick'
  | 'clickBeforeTime'
  | 'conditionNumberEven'
  | 'conditionNumberOdd'
  | 'conditionColorMatch'
  | 'memoryNumber'
  | 'recallMemoryNumber'
  | 'shapeCorners'

export type ButtonColor = 'default' | 'green' | 'red' | 'blue' | 'yellow' | 'purple'

export type ShapeType = 'triangle' | 'square' | 'pentagon' | 'hexagon'

export interface ButtonChallenge {
  id: string
  text: string
  type: ChallengeType
  durationMs: number
  requiredClicks?: number
  minClicks?: number
  maxClicks?: number
  delayFraction?: number   // 0–1: deve premere dopo questa % del tempo
  beforeFraction?: number  // 0–1: deve premere prima di questa % del tempo
  number?: number
  buttonColor?: ButtonColor
  colorWord?: string       // parola colore mostrata nel testo
  shape?: ShapeType
  successMsg: string
  errorMsg: string
  difficulty: 1 | 2 | 3   // 1=facile, 2=medio, 3=difficile
}

export interface RoundResult {
  challengeId: string
  success: boolean
  clicks: number
  firstClickFraction: number | null
}

export type GamePhase = 'intro' | 'countdown' | 'playing' | 'feedback' | 'gameover'

export interface GameState {
  phase: GamePhase
  score: number
  lives: number
  round: number
  sequence: ButtonChallenge[]
  currentChallenge: ButtonChallenge | null
  feedbackType: 'success' | 'error' | null
  feedbackMsg: string
  bestScore: number
  memoryNumber: number | null
}
