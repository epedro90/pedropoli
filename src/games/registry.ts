import type { ComponentType } from 'react'
import IntesaVincente from './intesa-vincente/IntesaVincente'
import AvantiUnAltro from './avanti-un-altro/AvantiUnAltro'
import Completamento from './completamento/Completamento'
import ChiSono from './chi-sono/ChiSono'
import TabooSprint from './taboo-sprint/TabooSprint'
import IlFalso from './il-falso/IlFalso'
import PedroFeud from './pedro-feud/PedroFeud'
import { GAMES, type GameId } from '../types/game'

const GAME_COMPONENTS: Record<GameId, ComponentType> = {
  'intesa-vincente': IntesaVincente,
  'avanti-un-altro': AvantiUnAltro,
  completamento: Completamento,
  'chi-sono': ChiSono,
  'taboo-sprint': TabooSprint,
  'il-falso': IlFalso,
  'pedro-feud': PedroFeud,
}

export const GAME_ROUTES = GAMES.map(game => ({
  ...game,
  Component: GAME_COMPONENTS[game.id],
}))
