export type GameId = 'intesa-vincente' | 'avanti-un-altro' | 'completamento' | 'chi-sono' | 'taboo-sprint' | 'il-falso' | 'pedro-feud' | 'pedro-button'

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
  {
    id: 'chi-sono',
    title: 'Chi Sono?',
    subtitle: 'Indizi progressivi e risposta rapida',
    description: "Indovina il personaggio o l'oggetto dal minor numero di indizi possibile. Ogni clue apre punti in meno.",
    route: '/chi-sono',
    accentColor: '#ffd166',
    secondaryColor: '#ff4d6d',
    emoji: '❓',
    players: '2-8 giocatori',
    difficulty: 'Medio',
  },
  {
    id: 'taboo-sprint',
    title: 'Taboo Sprint',
    subtitle: 'Parole vietate e ritmo serrato',
    description: 'Fai indovinare la parola senza usare i taboo. Più risposte giuste, più punti in meno tempo.',
    route: '/taboo-sprint',
    accentColor: '#ff6b6b',
    secondaryColor: '#ffd166',
    emoji: '🚫',
    players: '2-8 giocatori',
    difficulty: 'Medio',
  },
  {
    id: 'il-falso',
    title: 'Il Falso',
    subtitle: "Trova l'affermazione inventata",
    description: 'Tra quattro affermazioni una sola è falsa: scoprila prima che finisca il tempo del tuo turno.',
    route: '/il-falso',
    accentColor: '#a855f7',
    secondaryColor: '#ffd166',
    emoji: '🕵️',
    players: '2-8 giocatori',
    difficulty: 'Medio',
  },
  {
    id: 'pedro-feud',
    title: 'Pedro Feud',
    subtitle: 'Il survey game del Pedropoli',
    description: 'Due squadre si sfidano su 15 turni.',
    route: '/pedro-feud',
    accentColor: '#f59e0b',
    secondaryColor: '#ef4444',
    emoji: '🎙',
    players: '2 squadre',
    difficulty: 'Facile',
  },
  {
    id: 'pedro-button',
    title: 'Pedro Button',
    subtitle: 'Premi. O non premere.',
    description: 'Leggi l\'istruzione e decidi in pochi secondi. A volte devi premere, a volte devi resistere. Ogni errore costa una vita.',
    route: '/pedro-button',
    accentColor: '#00d4ff',
    secondaryColor: '#0078d4',
    emoji: '🔴',
    players: '1 giocatore',
    difficulty: 'Medio',
  },
]
