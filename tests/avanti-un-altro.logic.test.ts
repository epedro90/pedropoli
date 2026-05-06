import assert from 'node:assert/strict'
import { isWrongAnswer, nextQuestionAfterAnswer, rankResults } from '../src/games/avanti-un-altro/logic.js'

assert.equal(isWrongAnswer('B', 'A'), true)
assert.equal(nextQuestionAfterAnswer(4, 21, true), 5)
assert.equal(isWrongAnswer('A', 'A'), false)
assert.equal(nextQuestionAfterAnswer(4, 21, false), 0)

const ranked = rankResults([
  { name: 'A', completed: false, timeUsed: 150, maxQuestion: 20 },
  { name: 'B', completed: true, timeUsed: 80, maxQuestion: 21 },
  { name: 'C', completed: true, timeUsed: 70, maxQuestion: 21 },
])

assert.deepEqual(ranked.map(result => result.name), ['C', 'B', 'A'])
