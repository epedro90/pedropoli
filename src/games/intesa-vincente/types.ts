export type GamePhase = 'setup' | 'playing' | 'results'

export interface Team {
  id: string
  name: string
  players: string[]
  score: number
}

export interface IntesaConfig {
  teams: Team[]
  timerDuration: number
  maxSkips: number
}

export interface TurnState {
  teamIndex: number
  wordIndex: number
  skipsLeft: number
  timerRunning: boolean
  timeLeft: number
  correctThisTurn: number
  penaltyThisTurn: number
}
