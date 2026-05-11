export interface ShareData {
  gameName: string
  winnerName: string
  winnerScore?: number
  scoreUnit?: string
  players: { name: string; score: number; meta?: string }[]
  subtitle?: string
}

const MEDALS = ['🥇', '🥈', '🥉']

export function formatResultsText(data: ShareData): string {
  const unit = data.scoreUnit ?? 'pt'
  const lines: string[] = []
  lines.push(`🏆 ${data.gameName}`)
  if (data.winnerScore !== undefined) {
    lines.push(`Vincitore: ${data.winnerName} (${data.winnerScore} ${unit})`)
  } else {
    lines.push(`Vincitore: ${data.winnerName}`)
  }
  if (data.subtitle) lines.push(data.subtitle)
  lines.push('')
  data.players.forEach((p, i) => {
    const medal = MEDALS[i] ?? `#${i + 1}`
    const meta = p.meta ? ` — ${p.meta}` : ''
    lines.push(`${medal} ${p.name} — ${p.score} ${unit}${meta}`)
  })
  lines.push('')
  lines.push('Giocato su Pedropoli 🎮')
  return lines.join('\n')
}
