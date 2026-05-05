export type GamePhase = 'setup' | 'playing' | 'results'

export interface FalseCard {
  category: string
  statements: [string, string, string, string]
  falseIndex: number
}

export interface IlFalsoPlayer {
  id: string
  name: string
  score: number
  correct: number
  wrong: number
}

export interface IlFalsoConfig {
  players: string[]
  turnTime: number
  roundsPerPlayer: number
  cardsPerTurn: number
}
