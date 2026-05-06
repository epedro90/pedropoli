import type { PlayerResult } from './types'

export const isWrongAnswer = (choice: 'A' | 'B', correctAnswer: 'A' | 'B') => {
  return choice !== correctAnswer
}

export const nextQuestionAfterAnswer = (questionIndex: number, questionsCount: number, answeredWrong: boolean) => {
  if (!answeredWrong) return 0
  return Math.min(questionIndex + 1, questionsCount)
}

export const rankResults = (results: PlayerResult[]) => {
  return [...results].sort((a, b) => {
    if (a.completed && !b.completed) return -1
    if (!a.completed && b.completed) return 1
    if (a.completed && b.completed) return a.timeUsed - b.timeUsed
    return b.maxQuestion - a.maxQuestion
  })
}
