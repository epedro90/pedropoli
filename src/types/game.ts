export type GameId = 'intesa-vincente' | 'avanti-un-altro' | 'completamento'

export interface GameDefinition {
  id: GameId
  title: string
  subtitle: string
  description: string
  route: string
  accentColor: string
  secondaryColor: string
  emoji: string
  players: string
  difficulty: string
}

export const GAMES: GameDefinition[] = [
  {
    id: 'intesa-vincente',
    title: 'Intesa Vincente',
    subtitle: 'Il gioco delle parole in squadra',
    description: 'Due suggeritori si alternano parola per parola per far indovinare la parola segreta al loro compagno. Sfida le altre squadre!',
    route: '/intesa-vincente',
    accentColor: '#00aaff',
    secondaryColor: '#00f5ff',
    emoji: '🧠',
    players: '3+ giocatori',
    difficulty: 'Medio',
  },
  {
    id: 'avanti-un-altro',
    title: 'Avanti un Altro',
    subtitle: 'Finale al contrario',
    description: 'Rispondi a 21 domande dando SEMPRE la risposta SBAGLIATA. Più facile a dirsi che a farsi!',
    route: '/avanti-un-altro',
    accentColor: '#ffd166',
    secondaryColor: '#ff4fd8',
    emoji: '🎯',
    players: '1-6 giocatori',
    difficulty: 'Difficile',
  },
  {
    id: 'completamento',
    title: 'Completamento',
    subtitle: 'Indovina la parola nascosta',
    description: 'Le lettere si rivelano con il tempo. Indovina prima che finisca il tuo cronometro personale!',
    route: '/completamento',
    accentColor: '#06d6a0',
    secondaryColor: '#7c3aed',
    emoji: '🔤',
    players: '2-8 giocatori',
    difficulty: 'Facile',
  },
]
