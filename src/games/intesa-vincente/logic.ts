import type { Team } from './types'

export const applyTeamScoreDelta = (teams: Team[], teamIndex: number, delta: number) => {
  return teams.map((team, index) => (
    index === teamIndex ? { ...team, score: Math.max(0, team.score + delta) } : team
  ))
}

export const getNextTeamIndex = (teamIndex: number, teamsCount: number) => {
  return (teamIndex + 1) % teamsCount
}

export const isLastTurn = (turnsPlayed: number, totalTurns: number) => {
  return turnsPlayed + 1 >= totalTurns
}
