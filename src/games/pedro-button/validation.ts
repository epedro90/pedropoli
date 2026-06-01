import type { ButtonChallenge } from './types'

export interface ValidationResult {
  success: boolean
  message: string
}

export function validateChallenge(
  challenge: ButtonChallenge,
  clicks: number,
  firstClickFraction: number | null,
  memoryNumber: number | null,
): ValidationResult {
  const ok = (msg: string): ValidationResult => ({ success: true, message: msg })
  const fail = (msg: string): ValidationResult => ({ success: false, message: msg })

  switch (challenge.type) {
    case 'exactClicks':
      return clicks === challenge.requiredClicks
        ? ok(challenge.successMsg)
        : fail(challenge.errorMsg)

    case 'minClicks': {
      const min = challenge.minClicks ?? 1
      const max = challenge.maxClicks
      if (clicks < min) return fail(challenge.errorMsg)
      if (max !== undefined && clicks > max) return fail(challenge.errorMsg)
      return ok(challenge.successMsg)
    }

    case 'maxClicks': {
      const max = challenge.maxClicks ?? 0
      return clicks <= max ? ok(challenge.successMsg) : fail(challenge.errorMsg)
    }

    case 'noClick':
      return clicks === 0 ? ok(challenge.successMsg) : fail(challenge.errorMsg)

    case 'delayedClick': {
      const threshold = challenge.delayFraction ?? 0.5
      if (clicks === 0) return fail(challenge.errorMsg)
      if (firstClickFraction === null || firstClickFraction < threshold) {
        return fail(challenge.errorMsg)
      }
      return ok(challenge.successMsg)
    }

    case 'clickBeforeTime': {
      const threshold = challenge.beforeFraction ?? 0.5
      if (clicks === 0) return fail(challenge.errorMsg)
      if (firstClickFraction === null || firstClickFraction > threshold) {
        return fail(challenge.errorMsg)
      }
      return ok(challenge.successMsg)
    }

    case 'conditionNumberEven': {
      const num = challenge.number ?? 0
      const isEven = num % 2 === 0
      if (isEven) {
        return clicks > 0 ? ok(challenge.successMsg) : fail(challenge.errorMsg)
      } else {
        return clicks === 0 ? ok(challenge.successMsg) : fail(challenge.errorMsg)
      }
    }

    case 'conditionNumberOdd': {
      const num = challenge.number ?? 0
      const isOdd = num % 2 !== 0
      if (isOdd) {
        return clicks > 0 ? ok(challenge.successMsg) : fail(challenge.errorMsg)
      } else {
        return clicks === 0 ? ok(challenge.successMsg) : fail(challenge.errorMsg)
      }
    }

    case 'conditionColorMatch': {
      const colorMatches = challenge.buttonColor !== 'default' &&
        challenge.colorWord !== undefined &&
        colorNameMatches(challenge.colorWord, challenge.buttonColor ?? 'default')
      if (colorMatches) {
        return clicks > 0 ? ok(challenge.successMsg) : fail(challenge.errorMsg)
      } else {
        return clicks === 0 ? ok(challenge.successMsg) : fail(challenge.errorMsg)
      }
    }

    case 'memoryNumber':
      return ok(challenge.successMsg)

    case 'recallMemoryNumber': {
      const expected = challenge.number ?? 0
      const remembered = memoryNumber
      const numbersMatch = remembered === expected
      if (numbersMatch) {
        return clicks > 0 ? ok(challenge.successMsg) : fail(challenge.errorMsg)
      } else {
        return clicks === 0 ? ok(challenge.successMsg) : fail(challenge.errorMsg)
      }
    }

    case 'shapeCorners':
      return clicks === challenge.requiredClicks
        ? ok(challenge.successMsg)
        : fail(challenge.errorMsg)

    default:
      return fail('Challenge sconosciuta.')
  }
}

const COLOR_WORDS: Record<string, string[]> = {
  green: ['verde', 'green'],
  red: ['rosso', 'red'],
  blue: ['blu', 'blue', 'azzurro'],
  yellow: ['giallo', 'yellow'],
  purple: ['viola', 'purple'],
  default: [],
}

function colorNameMatches(word: string, color: string): boolean {
  const variants = COLOR_WORDS[color] ?? []
  return variants.some(v => word.toLowerCase().includes(v))
}
