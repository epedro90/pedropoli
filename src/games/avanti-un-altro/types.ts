export type GamePhase = 'setup' | 'playing' | 'results'

export interface Question {
  question: string
  optionA: string
  optionB: string
  correctAnswer: 'A' | 'B'
}

export interface PlayerResult {
  name: string
  completed: boolean
  timeUsed: number
  maxQuestion: number
}

export interface AvantiConfig {
  players: string[]
  timerDuration: number
  questionsCount: number
}
