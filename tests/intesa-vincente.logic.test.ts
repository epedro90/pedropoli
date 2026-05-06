import assert from 'node:assert/strict'
import { applyTeamScoreDelta, getNextTeamIndex, isLastTurn } from '../src/games/intesa-vincente/logic.js'
import type { Team } from '../src/games/intesa-vincente/types.js'

const teams: Team[] = [
  { id: 'a', name: 'Blu', players: [], score: 2 },
  { id: 'b', name: 'Rossa', players: [], score: 0 },
]

assert.deepEqual(applyTeamScoreDelta(teams, 0, 1).map(team => team.score), [3, 0])
assert.equal(applyTeamScoreDelta(teams, 1, -1)[1].score, 0)
assert.equal(getNextTeamIndex(1, 2), 0)
assert.equal(isLastTurn(1, 2), true)
assert.equal(isLastTurn(0, 2), false)
