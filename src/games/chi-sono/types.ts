export type GamePhase = 'setup' | 'playing' | 'results'

export interface ChiSonoCard {
  category: string
  answer: string
  clues: [string, string, string, string]
}

export interface ChiSonoPlayer {
  id: string
  name: string
  score: number
  solved: number
}

export interface ChiSonoConfig {
  players: string[]
  turnTime: number
  roundsPerPlayer: number
  maxSkips: number
  cardsPerGame: number
}
