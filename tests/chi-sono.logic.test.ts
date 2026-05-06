import assert from 'node:assert/strict'
import { getVisibleClues, normalizeGuess, scoreForClues } from '../src/games/chi-sono/logic.js'

const clues = ['generico', 'medio', 'specifico', 'finale']

assert.deepEqual(getVisibleClues(clues, 2), ['generico', 'medio'])
assert.equal(scoreForClues(1, 4), 4)
assert.equal(scoreForClues(4, 4), 1)
assert.equal(normalizeGuess('Là, luna!'), 'LALUNA')
