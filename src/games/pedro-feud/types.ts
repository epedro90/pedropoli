export interface FeudAnswer {
  text: string
  value: number
}

export interface FeudBonusAnswer {
  text: string
}

export interface FeudRound {
  roundNumber: number
  question: string
  answers: FeudAnswer[]
  bonusAnswer: FeudBonusAnswer
}

export interface FeudScenario {
  id: string
  name: string
  category?: string
  description?: string
  createdAt?: string
  updatedAt?: string
  rounds: FeudRound[]
}

export type RoundWinner = 'team1' | 'team2' | null

export interface FeudGameState {
  scenarioId: string
  currentRoundIndex: number
  team1Name: string
  team2Name: string
  team1Score: number
  team2Score: number
  roundErrors: Record<number, number>
  roundRevealedAnswers: Record<number, boolean[]>
  roundBonusRevealed: Record<number, boolean>
  roundWinners: Record<number, RoundWinner>
}

export interface ValidationError {
  field: string
  message: string
}
