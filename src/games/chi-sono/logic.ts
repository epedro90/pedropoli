export const scoreForClues = (revealedClues: number, totalClues: number) => {
  return Math.max(1, totalClues - revealedClues + 1)
}

export const normalizeGuess = (value: string) => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
}

export const getVisibleClues = <T>(clues: T[], clueIndex: number) => {
  return clues.slice(0, clueIndex)
}
