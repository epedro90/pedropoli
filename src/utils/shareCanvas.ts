import type { ShareData } from './shareText'

const SIZE = 1080
const MEDALS = ['🥇', '🥈', '🥉']
const PALETTE = ['#00d4ff', '#f59e0b', '#10b981', '#ec4899', '#fbbf24', '#3b82f6', '#a78bfa', '#ff4444']

export async function generateResultsImage(data: ShareData): Promise<Blob | null> {
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // Background
  ctx.fillStyle = '#050505'
  ctx.fillRect(0, 0, SIZE, SIZE)

  // Radial glow top
  const grad1 = ctx.createRadialGradient(SIZE / 2, 0, 0, SIZE / 2, 0, SIZE * 0.7)
  grad1.addColorStop(0, 'rgba(0, 212, 255, 0.15)')
  grad1.addColorStop(1, 'transparent')
  ctx.fillStyle = grad1
  ctx.fillRect(0, 0, SIZE, SIZE)

  // Radial glow bottom right
  const grad2 = ctx.createRadialGradient(SIZE, SIZE, 0, SIZE, SIZE, SIZE * 0.6)
  grad2.addColorStop(0, 'rgba(37, 99, 235, 0.15)')
  grad2.addColorStop(1, 'transparent')
  ctx.fillStyle = grad2
  ctx.fillRect(0, 0, SIZE, SIZE)

  // Card
  const cardX = 60, cardY = 60, cardW = SIZE - 120, cardH = SIZE - 120
  ctx.fillStyle = 'rgba(26, 26, 26, 0.85)'
  roundRect(ctx, cardX, cardY, cardW, cardH, 36)
  ctx.fill()
  ctx.strokeStyle = 'rgba(0, 212, 255, 0.25)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Header label "PEDROPOLI"
  ctx.font = 'bold 28px Poppins, sans-serif'
  ctx.fillStyle = '#b0b0b0'
  ctx.textAlign = 'center'
  ctx.fillText('PEDROPOLI', SIZE / 2, 140)

  // Game name
  ctx.font = 'bold 56px Poppins, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(data.gameName, SIZE / 2, 220)

  // Trophy
  ctx.font = '110px sans-serif'
  ctx.fillText('🏆', SIZE / 2, 360)

  // Winner label
  ctx.font = 'bold 32px Poppins, sans-serif'
  ctx.fillStyle = '#fbbf24'
  ctx.fillText('VINCITORE', SIZE / 2, 415)

  // Winner name
  ctx.font = 'bold 72px Poppins, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(truncate(data.winnerName, 22), SIZE / 2, 500)

  // Winner score
  if (data.winnerScore !== undefined) {
    ctx.font = 'bold 44px Poppins, sans-serif'
    ctx.fillStyle = '#00d4ff'
    ctx.fillText(`${data.winnerScore} ${data.scoreUnit ?? 'pt'}`, SIZE / 2, 560)
  }

  // Subtitle
  if (data.subtitle) {
    ctx.font = '28px Poppins, sans-serif'
    ctx.fillStyle = '#b0b0b0'
    ctx.fillText(data.subtitle, SIZE / 2, 605)
  }

  // Players list
  const listStartY = 660
  const rowH = 56
  const maxRows = Math.min(data.players.length, 7)
  const listX = 140
  const listW = SIZE - 280
  ctx.textAlign = 'left'
  for (let i = 0; i < maxRows; i++) {
    const p = data.players[i]
    const y = listStartY + i * rowH
    // Row bg
    ctx.fillStyle = i === 0 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255, 255, 255, 0.03)'
    roundRect(ctx, listX, y, listW, rowH - 8, 12)
    ctx.fill()
    // Medal/rank
    const medal = MEDALS[i] ?? `#${i + 1}`
    ctx.font = 'bold 28px Poppins, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'left'
    ctx.fillText(medal, listX + 20, y + 36)
    // Name
    ctx.font = 'bold 26px Poppins, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(truncate(p.name, 24), listX + 80, y + 36)
    // Score
    ctx.font = 'bold 28px Poppins, sans-serif'
    ctx.fillStyle = PALETTE[i % PALETTE.length]
    ctx.textAlign = 'right'
    ctx.fillText(`${p.score} ${data.scoreUnit ?? 'pt'}`, listX + listW - 20, y + 36)
  }

  // Footer
  ctx.font = '22px Poppins, sans-serif'
  ctx.fillStyle = '#666'
  ctx.textAlign = 'center'
  ctx.fillText('pedropoli — party games 🎮', SIZE / 2, SIZE - 90)

  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/png')
  })
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + '…' : s
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
