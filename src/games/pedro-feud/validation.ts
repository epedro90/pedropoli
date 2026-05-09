import type { FeudScenario, ValidationError } from './types'

export function validateScenario(
  scenario: FeudScenario,
  otherScenarios: FeudScenario[] = [],
): ValidationError[] {
  const errors: ValidationError[] = []

  if (!scenario.name.trim()) {
    errors.push({ field: 'name', message: 'Il nome dello scenario è obbligatorio.' })
  }

  if (scenario.rounds.length !== 15) {
    errors.push({
      field: 'rounds',
      message: `Lo scenario deve avere esattamente 15 round (attualmente: ${scenario.rounds.length}).`,
    })
  }

  const seenQuestions = new Set<string>()

  scenario.rounds.forEach((round, i) => {
    const n = i + 1

    if (!round.question.trim()) {
      errors.push({ field: `round[${i}].question`, message: `Round ${n}: la domanda non può essere vuota.` })
    } else {
      const norm = round.question.trim().toLowerCase()
      if (seenQuestions.has(norm)) {
        errors.push({ field: `round[${i}].question`, message: `Round ${n}: domanda duplicata in questo scenario.` })
      }
      seenQuestions.add(norm)

      for (const other of otherScenarios) {
        if (other.id === scenario.id) continue
        for (const otherRound of other.rounds) {
          if (otherRound.question.trim().toLowerCase() === norm) {
            errors.push({
              field: `round[${i}].question`,
              message: `Round ${n}: domanda già presente nello scenario "${other.name}".`,
            })
            break
          }
        }
      }
    }

    if (round.answers.length < 1 || round.answers.length > 8) {
      errors.push({
        field: `round[${i}].answers`,
        message: `Round ${n}: le risposte devono essere tra 1 e 8 (attualmente: ${round.answers.length}).`,
      })
    }

    round.answers.forEach((ans, j) => {
      if (!ans.text.trim()) {
        errors.push({
          field: `round[${i}].answers[${j}]`,
          message: `Round ${n}, risposta ${j + 1}: il testo non può essere vuoto.`,
        })
      }
      if (typeof ans.value !== 'number' || isNaN(ans.value) || ans.value < 0) {
        errors.push({
          field: `round[${i}].answers[${j}].value`,
          message: `Round ${n}, risposta ${j + 1}: il valore deve essere un numero positivo.`,
        })
      }
    })

    if (!round.bonusAnswer?.text?.trim()) {
      errors.push({ field: `round[${i}].bonusAnswer`, message: `Round ${n}: la risposta bonus non può essere vuota.` })
    }
  })

  return errors
}

export function roundHasErrors(roundIndex: number, errors: ValidationError[]): boolean {
  return errors.some(e => e.field.startsWith(`round[${roundIndex}]`))
}
