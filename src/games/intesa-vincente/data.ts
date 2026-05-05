export const WORDS: string[] = [
  'Mare', 'Montagna', 'Telefono', 'Pizza', 'Cinema', 'Computer', 'Scuola', 'Vacanza',
  'Aeroporto', 'Biblioteca', 'Chitarra', 'Elefante', 'Farfalla', 'Giardino', 'Hotel',
  'Isola', 'Jeans', 'Kiwi', 'Lampone', 'Maschera', 'Nuvola', 'Ombrello', 'Panda',
  'Quadro', 'Ragno', 'Spiaggia', 'Treno', 'Uva', 'Violino', 'Zaino', 'Albero',
  'Bicicletta', 'Candela', 'Dado', 'Elicottero', 'Fiore', 'Gelato', 'Hamburger',
  'Igloo', 'Jungla', 'Koala', 'Limone', 'Mongolfiera', 'Nocciola', 'Orca', 'Pinguino',
  'Quokka', 'Razzo', 'Stella', 'Tostapane', 'Unicorno', 'Vulcano', 'Waterfall',
  'Xilofono', 'Yak', 'Zebra', 'Ananas', 'Baobab', 'Cappello', 'Delfino', 'Formaggio',
  'Grotta', 'Hamburger', 'Iride', 'Judo', 'Karate', 'Lago', 'Marmellata', 'Notte',
  'Orso', 'Parco', 'Quaderno', 'Radice', 'Sabbia', 'Tavola', 'Uragano', 'Vento',
  'Zione', 'Arcobaleno', 'Bottiglietta', 'Castello', 'Deserto', 'Equilibrio', 'Fumetto',
  'Ghiaccio', 'Hamburger', 'Insalata', 'Jamba', 'Kanguro', 'Lanterna', 'Musica',
  'Neve', 'Orologio', 'Pallone', 'Rucola', 'Serpente', 'Torta', 'Ufficio', 'Viaggio',
  'Abbraccio', 'Bandiera', 'Cucchiaio', 'Dinosauro', 'Equatore', 'Fontana', 'Globo',
  'Hamburger', 'Invenzione', 'Janome', 'Karaoke', 'Labirinto', 'Molecola', 'Narciso',
]

export function getShuffledWords(): string[] {
  return [...WORDS].sort(() => Math.random() - 0.5)
}
