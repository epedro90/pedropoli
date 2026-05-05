export type GamePhase = 'setup' | 'playing' | 'results'

export interface CompletamentoQuestion {
  clue: string
  answer: string
}

export interface CompletamentoPlayer {
  id: string
  name: string
  score: number
  timeLeft: number
  isEliminated: boolean
}

export interface CompletamentoConfig {
  players: string[]
  startTime: number
  revealInterval: number
  maxQuestions: number
}
