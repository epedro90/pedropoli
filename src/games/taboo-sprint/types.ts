export type GamePhase = 'setup' | 'playing' | 'results'

export interface TabooCard {
  category: string
  answer: string
  taboos: [string, string, string, string]
}

export interface TabooPlayer {
  id: string
  name: string
  score: number
  correct: number
  tabooHits: number
  skips: number
}

export interface TabooConfig {
  players: string[]
  turnTime: number
  roundsPerPlayer: number
  maxSkips: number
  cardsPerGame: number
}
