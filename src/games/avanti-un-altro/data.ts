import { Question } from './types'

export const QUESTIONS: Question[] = [
  // --- CULTURA GENERALE ---
  { question: 'Qual è la capitale d\'Italia?', optionA: 'Roma', optionB: 'Milano', correctAnswer: 'A' },
  { question: 'Quanti colori ha la bandiera italiana?', optionA: 'Tre', optionB: 'Quattro', correctAnswer: 'A' },
  { question: 'In quale anno è finita la Seconda Guerra Mondiale?', optionA: '1945', optionB: '1939', correctAnswer: 'A' },
  { question: 'Chi ha dipinto la Cappella Sistina?', optionA: 'Michelangelo', optionB: 'Leonardo', correctAnswer: 'A' },
  { question: 'Quanti pianeti ha il Sistema Solare?', optionA: 'Otto', optionB: 'Nove', correctAnswer: 'A' },
  { question: 'Quale pianeta è più vicino al Sole?', optionA: 'Mercurio', optionB: 'Venere', correctAnswer: 'A' },
  { question: 'Chi ha scritto la Divina Commedia?', optionA: 'Dante Alighieri', optionB: 'Petrarca', correctAnswer: 'A' },
  { question: 'Qual è la montagna più alta del mondo?', optionA: 'Everest', optionB: 'K2', correctAnswer: 'A' },
  { question: 'In quale oceano si trova l\'Australia?', optionA: 'Pacifico', optionB: 'Indiano', correctAnswer: 'A' },
  { question: 'Quante sono le meraviglie del mondo antico?', optionA: 'Sette', optionB: 'Cinque', correctAnswer: 'A' },
  { question: 'Qual è l\'elemento chimico con simbolo O?', optionA: 'Ossigeno', optionB: 'Oro', correctAnswer: 'A' },
  { question: 'Chi ha inventato il telefono?', optionA: 'Alexander Graham Bell', optionB: 'Thomas Edison', correctAnswer: 'A' },
  { question: 'Quante corde ha una chitarra classica?', optionA: 'Sei', optionB: 'Cinque', correctAnswer: 'A' },
  { question: 'Quale paese ha la popolazione più alta al mondo?', optionA: 'India', optionB: 'Cina', correctAnswer: 'A' },
  { question: 'Qual è la capitale della Francia?', optionA: 'Parigi', optionB: 'Marsiglia', correctAnswer: 'A' },
  { question: 'Quante lettere ha l\'alfabeto italiano?', optionA: '21', optionB: '26', correctAnswer: 'A' },
  { question: 'Quale organo produce l\'insulina?', optionA: 'Pancreas', optionB: 'Fegato', correctAnswer: 'A' },
  { question: 'In quale città si trova il Colosseo?', optionA: 'Roma', optionB: 'Napoli', correctAnswer: 'A' },
  { question: 'Quanti continenti ci sono sulla Terra?', optionA: 'Sette', optionB: 'Sei', correctAnswer: 'A' },
  { question: 'Qual è il paese più grande del mondo per superficie?', optionA: 'Russia', optionB: 'Canada', correctAnswer: 'A' },

  // --- CALCIO ITALIANO ---
  { question: 'Quale squadra ha vinto più scudetti nella storia?', optionA: 'Juventus', optionB: 'Inter', correctAnswer: 'A' },
  { question: 'In quale città gioca la Juventus?', optionA: 'Torino', optionB: 'Milano', correctAnswer: 'A' },
  { question: 'Come si chiama lo stadio del Milan?', optionA: 'San Siro', optionB: 'Olimpico', correctAnswer: 'A' },
  { question: 'Quale squadra ha la maglia a strisce verticali bianconere?', optionA: 'Juventus', optionB: 'Inter', correctAnswer: 'A' },
  { question: 'Chi ha segnato il gol di testa nella finale del Mondiale 2006?', optionA: 'Materazzi', optionB: 'Toni', correctAnswer: 'A' },
  { question: 'Quante volte ha vinto l\'Italia il Mondiale di calcio?', optionA: 'Quattro', optionB: 'Tre', correctAnswer: 'A' },
  { question: 'In quale anno l\'Italia ha vinto l\'ultimo Europeo?', optionA: '2021', optionB: '2012', correctAnswer: 'A' },
  { question: 'Come si chiama il giocatore soprannominato "Il Capitano" alla Roma?', optionA: 'Francesco Totti', optionB: 'Daniele De Rossi', correctAnswer: 'A' },
  { question: 'In quale città gioca il Napoli?', optionA: 'Napoli', optionB: 'Bari', correctAnswer: 'A' },
  { question: 'Quale colore è la maglia dell\'Inter?', optionA: 'Nerazzurra', optionB: 'Bianconera', correctAnswer: 'A' },
  { question: 'Chi allenava l\'Italia quando vinse il Mondiale 2006?', optionA: 'Marcello Lippi', optionB: 'Giovanni Trapattoni', correctAnswer: 'A' },
  { question: 'Quale squadra gioca allo stadio Diego Armando Maradona?', optionA: 'Napoli', optionB: 'Palermo', correctAnswer: 'A' },
  { question: 'Quante squadre partecipano alla Serie A?', optionA: 'Venti', optionB: 'Diciotto', correctAnswer: 'A' },
  { question: 'Chi è il capocannoniere di tutti i tempi della Serie A?', optionA: 'Silvio Piola', optionB: 'Francesco Totti', correctAnswer: 'A' },

  // --- CALCIO ESTERO ---
  { question: 'Quante volte ha vinto il Pallone d\'Oro Messi?', optionA: 'Otto', optionB: 'Cinque', correctAnswer: 'A' },
  { question: 'In quale paese gioca il Real Madrid?', optionA: 'Spagna', optionB: 'Portogallo', correctAnswer: 'A' },
  { question: 'Quale squadra ha vinto più Champions League?', optionA: 'Real Madrid', optionB: 'Barcelona', correctAnswer: 'A' },
  { question: 'In quale città si trova il Camp Nou?', optionA: 'Barcellona', optionB: 'Madrid', correctAnswer: 'A' },
  { question: 'Di quale nazionalità è Kylian Mbappé?', optionA: 'Francese', optionB: 'Belga', correctAnswer: 'A' },
  { question: 'Quale squadra inglese ha sede ad Anfield?', optionA: 'Liverpool', optionB: 'Everton', correctAnswer: 'A' },
  { question: 'In quale paese si disputa la Bundesliga?', optionA: 'Germania', optionB: 'Austria', correctAnswer: 'A' },
  { question: 'Chi è soprannominato "CR7"?', optionA: 'Cristiano Ronaldo', optionB: 'Carlos Roberto', correctAnswer: 'A' },
  { question: 'Quale squadra ha vinto il Mondiale 2022?', optionA: 'Argentina', optionB: 'Francia', correctAnswer: 'A' },
  { question: 'Di quale nazionalità è Erling Haaland?', optionA: 'Norvegese', optionB: 'Danese', correctAnswer: 'A' },
  { question: 'Qual è il soprannome del Bayern Monaco?', optionA: 'Die Roten', optionB: 'Die Schwarzen', correctAnswer: 'A' },
  { question: 'In quale stadio si gioca la finale di Wembley?', optionA: 'Londra', optionB: 'Manchester', correctAnswer: 'A' },
  { question: 'Quale squadra è chiamata "I Blancos"?', optionA: 'Real Madrid', optionB: 'Atletico Madrid', correctAnswer: 'A' },

  // --- SPORT IN GENERALE ---
  { question: 'In quale sport si usa il termine "ace"?', optionA: 'Tennis', optionB: 'Golf', correctAnswer: 'A' },
  { question: 'Quanti giocatori ci sono in una squadra di basket in campo?', optionA: 'Cinque', optionB: 'Sei', correctAnswer: 'A' },
  { question: 'In quale sport si usa lo schiacciare?', optionA: 'Pallavolo', optionB: 'Pallamano', correctAnswer: 'A' },
  { question: 'Quanti set vince chi fa il tennis a Wimbledon (uomini)?', optionA: 'Tre su cinque', optionB: 'Due su tre', correctAnswer: 'A' },
  { question: 'In quale sport si compete per il Trofeo Borg-Warner?', optionA: 'Formula 1', optionB: 'MotoGP', correctAnswer: 'A' },
  { question: 'Che distanza si corre in una maratona?', optionA: '42,195 km', optionB: '40 km', correctAnswer: 'A' },
  { question: 'Quale atleta è considerato il più veloce della storia?', optionA: 'Usain Bolt', optionB: 'Carl Lewis', correctAnswer: 'A' },
  { question: 'In quale sport si usa la spada?', optionA: 'Scherma', optionB: 'Judo', correctAnswer: 'A' },
  { question: 'Quante basi ci sono nel baseball?', optionA: 'Quattro', optionB: 'Tre', correctAnswer: 'A' },
  { question: 'In quale sport si difende la porta con i guantoni?', optionA: 'Boxe', optionB: 'Calcio', correctAnswer: 'A' },
  { question: 'In quale paese sono nate le Olimpiadi moderne?', optionA: 'Grecia', optionB: 'Francia', correctAnswer: 'A' },
  { question: 'Quanti anelli ha il simbolo olimpico?', optionA: 'Cinque', optionB: 'Sei', correctAnswer: 'A' },
  { question: 'In quale sport si parla di "grande slam"?', optionA: 'Tennis', optionB: 'Golf', correctAnswer: 'A' },
  { question: 'Quanti round ha un match di boxe professionistico massimo?', optionA: 'Dodici', optionB: 'Quindici', correctAnswer: 'A' },
  { question: 'Chi ha vinto più titoli del Mondo di MotoGP?', optionA: 'Valentino Rossi', optionB: 'Marc Marquez', correctAnswer: 'A' },
  { question: 'In quale sport si usa il "birdie"?', optionA: 'Golf', optionB: 'Badminton', correctAnswer: 'A' },

  // --- ANIMALI ---
  { question: 'Quante zampe ha un ragno?', optionA: 'Otto', optionB: 'Sei', correctAnswer: 'A' },
  { question: 'Quale animale ha la gestazione più lunga?', optionA: 'Elefante', optionB: 'Balena', correctAnswer: 'A' },
  { question: 'Quante camere ha il cuore di un mammifero?', optionA: 'Quattro', optionB: 'Tre', correctAnswer: 'A' },
  { question: 'Quale animale è il più veloce della terra?', optionA: 'Ghepardo', optionB: 'Leone', correctAnswer: 'A' },
  { question: 'Quante zampe ha un insetto?', optionA: 'Sei', optionB: 'Otto', correctAnswer: 'A' },
  { question: 'Quale animale è il più grande del mondo?', optionA: 'Balena Blu', optionB: 'Elefante africano', correctAnswer: 'A' },
  { question: 'Quale uccello non può volare?', optionA: 'Pinguino', optionB: 'Piccione', correctAnswer: 'A' },
  { question: 'Quante strisce ha una zebra... di base più bianche o nere?', optionA: 'Nere', optionB: 'Bianche', correctAnswer: 'A' },
  { question: 'Quale animale produce la seta?', optionA: 'Baco da seta', optionB: 'Ragno', correctAnswer: 'A' },
  { question: 'Quale animale ha le pinne pettorale come "braccia"?', optionA: 'Delfino', optionB: 'Squalo', correctAnswer: 'A' },
  { question: 'Quante gobbe ha il cammello battriano?', optionA: 'Due', optionB: 'Una', correctAnswer: 'A' },
  { question: 'Quale animale è il simbolo dell\'Australia?', optionA: 'Canguro', optionB: 'Koala', correctAnswer: 'A' },
  { question: 'Quale animale ha la lingua più lunga in rapporto al corpo?', optionA: 'Camaleonte', optionB: 'Formichiere', correctAnswer: 'A' },
  { question: 'In quale paese vive il panda gigante allo stato brado?', optionA: 'Cina', optionB: 'Giappone', correctAnswer: 'A' },
  { question: 'Quante ore dorme al giorno un koala mediamente?', optionA: '22', optionB: '16', correctAnswer: 'A' },

  // --- MUSICA ---
  { question: 'Quante corde ha un violino?', optionA: 'Quattro', optionB: 'Cinque', correctAnswer: 'A' },
  { question: 'Di quale gruppo faceva parte Freddie Mercury?', optionA: 'Queen', optionB: 'Led Zeppelin', correctAnswer: 'A' },
  { question: 'In quale città è nato il jazz?', optionA: 'New Orleans', optionB: 'Chicago', correctAnswer: 'A' },
  { question: 'Quanti componenti avevano i Beatles?', optionA: 'Quattro', optionB: 'Cinque', correctAnswer: 'A' },
  { question: 'In quale anno si è tenuto il primo Festival di Sanremo?', optionA: '1951', optionB: '1960', correctAnswer: 'A' },
  { question: 'Quale strumento suonava Jimi Hendrix?', optionA: 'Chitarra', optionB: 'Basso', correctAnswer: 'A' },
  { question: 'Di quale nazionalità è stato Elvis Presley?', optionA: 'Americana', optionB: 'Inglese', correctAnswer: 'A' },
  { question: 'Come si chiama la nota musicale che segue il "Sol"?', optionA: 'La', optionB: 'Si', correctAnswer: 'A' },
  { question: 'Quante note ha la scala musicale?', optionA: 'Sette', optionB: 'Cinque', correctAnswer: 'A' },
  { question: 'Chi ha scritto "Bohemian Rhapsody"?', optionA: 'Freddie Mercury', optionB: 'Brian May', correctAnswer: 'A' },
  { question: 'Quale cantante italiano è soprannominato "il Blasco"?', optionA: 'Vasco Rossi', optionB: 'Ligabue', correctAnswer: 'A' },
  { question: 'Quante ottave ha un pianoforte da concerto?', optionA: 'Sette e un terzo', optionB: 'Sei', correctAnswer: 'A' },
  { question: 'In quale decennio è nato il rock and roll?', optionA: 'Anni 50', optionB: 'Anni 60', correctAnswer: 'A' },
  { question: 'Quale cantante si chiama Stefani Joanne Germanotta?', optionA: 'Lady Gaga', optionB: 'Katy Perry', correctAnswer: 'A' },

  // --- GEOGRAFIA ---
  { question: 'Quale è il fiume più lungo del mondo?', optionA: 'Nilo', optionB: 'Amazzoni', correctAnswer: 'A' },
  { question: 'In quale continente si trova l\'Egitto?', optionA: 'Africa', optionB: 'Asia', correctAnswer: 'A' },
  { question: 'Quale è il lago più grande del mondo?', optionA: 'Mar Caspio', optionB: 'Lago Superiore', correctAnswer: 'A' },
  { question: 'Qual è la capitale del Brasile?', optionA: 'Brasilia', optionB: 'Rio de Janeiro', correctAnswer: 'A' },
  { question: 'In quale paese si trova il Taj Mahal?', optionA: 'India', optionB: 'Pakistan', correctAnswer: 'A' },
  { question: 'Qual è la capitale del Giappone?', optionA: 'Tokyo', optionB: 'Osaka', correctAnswer: 'A' },
  { question: 'Quale paese ha il maggior numero di isole?', optionA: 'Svezia', optionB: 'Indonesia', correctAnswer: 'A' },
  { question: 'In quale paese si trova il deserto del Sahara in grande parte?', optionA: 'Algeria', optionB: 'Egitto', correctAnswer: 'A' },
  { question: 'Quale è il paese più piccolo del mondo?', optionA: 'Vaticano', optionB: 'Monaco', correctAnswer: 'A' },
  { question: 'In quale paese si trova il Machu Picchu?', optionA: 'Perù', optionB: 'Bolivia', correctAnswer: 'A' },
  { question: 'Quale è il mare più salato del mondo?', optionA: 'Mar Morto', optionB: 'Mar Rosso', correctAnswer: 'A' },
  { question: 'Qual è la capitale della Russia?', optionA: 'Mosca', optionB: 'San Pietroburgo', correctAnswer: 'A' },
  { question: 'In quale oceano si trova Hawaii?', optionA: 'Pacifico', optionB: 'Atlantico', correctAnswer: 'A' },
  { question: 'Qual è la capitale dell\'Argentina?', optionA: 'Buenos Aires', optionB: 'Santiago', correctAnswer: 'A' },

  // --- STORIA ---
  { question: 'In quale anno è caduto il Muro di Berlino?', optionA: '1989', optionB: '1991', correctAnswer: 'A' },
  { question: 'Chi era il primo uomo sulla Luna?', optionA: 'Neil Armstrong', optionB: 'Buzz Aldrin', correctAnswer: 'A' },
  { question: 'In quale anno è iniziata la Prima Guerra Mondiale?', optionA: '1914', optionB: '1916', correctAnswer: 'A' },
  { question: 'Chi era il faraone legato a Tutankhamon?', optionA: 'Tutankhamon stesso', optionB: 'Ramses II', correctAnswer: 'A' },
  { question: 'In quale anno Cristoforo Colombo ha scoperto l\'America?', optionA: '1492', optionB: '1498', correctAnswer: 'A' },
  { question: 'Chi era il leader dell\'URSS durante la Seconda Guerra Mondiale?', optionA: 'Stalin', optionB: 'Lenin', correctAnswer: 'A' },
  { question: 'In quale anno è iniziata la Rivoluzione Francese?', optionA: '1789', optionB: '1776', correctAnswer: 'A' },
  { question: 'Quale imperatore romano ha costruito il Colosseo?', optionA: 'Vespasiano', optionB: 'Nerone', correctAnswer: 'A' },
  { question: 'In quale anno è stato assassinato JFK?', optionA: '1963', optionB: '1965', correctAnswer: 'A' },
  { question: 'Quale paese ha inventato la carta?', optionA: 'Cina', optionB: 'Egitto', correctAnswer: 'A' },
  { question: 'In quale anno è avvenuto lo sbarco in Normandia?', optionA: '1944', optionB: '1943', correctAnswer: 'A' },
  { question: 'Chi ha dipinto la Gioconda?', optionA: 'Leonardo da Vinci', optionB: 'Raffaello', correctAnswer: 'A' },

  // --- MATEMATICA E SCIENZA ---
  { question: 'Quanto fa la radice quadrata di 144?', optionA: '12', optionB: '14', correctAnswer: 'A' },
  { question: 'Quanti lati ha un esagono?', optionA: 'Sei', optionB: 'Sette', correctAnswer: 'A' },
  { question: 'Qual è il numero pi greco approssimato?', optionA: '3,14', optionB: '3,41', correctAnswer: 'A' },
  { question: 'Quanto fa 15 x 15?', optionA: '225', optionB: '215', correctAnswer: 'A' },
  { question: 'Quanti angoli ha un triangolo?', optionA: 'Tre', optionB: 'Quattro', correctAnswer: 'A' },
  { question: 'A quanti gradi bolle l\'acqua al livello del mare?', optionA: '100', optionB: '90', correctAnswer: 'A' },
  { question: 'Quanti millilitri ha un litro?', optionA: '1000', optionB: '100', correctAnswer: 'A' },
  { question: 'Qual è il numero atomico dell\'idrogeno?', optionA: 'Uno', optionB: 'Due', correctAnswer: 'A' },
  { question: 'Quanti lati uguali ha un quadrato?', optionA: 'Quattro', optionB: 'Due', correctAnswer: 'A' },
  { question: 'Quanto fa 2 elevato alla decima potenza?', optionA: '1024', optionB: '512', correctAnswer: 'A' },

  // --- MACCHINE E MOTO ---
  { question: 'In quale paese è nata la Ferrari?', optionA: 'Italia', optionB: 'Germania', correctAnswer: 'A' },
  { question: 'Quale pilota di F1 ha vinto più titoli mondiali?', optionA: 'Lewis Hamilton', optionB: 'Michael Schumacher', correctAnswer: 'A' },
  { question: 'Quanti cilindri ha tradizionalmente un motore V8?', optionA: 'Otto', optionB: 'Sei', correctAnswer: 'A' },
  { question: 'In quale città ha sede la Ducati?', optionA: 'Bologna', optionB: 'Torino', correctAnswer: 'A' },
  { question: 'Quale marchio ha creato la Countach?', optionA: 'Lamborghini', optionB: 'Ferrari', correctAnswer: 'A' },
  { question: 'Quante ruote ha una moto standard?', optionA: 'Due', optionB: 'Tre', correctAnswer: 'A' },
  { question: 'Chi è stato il primo campione del mondo di Formula 1?', optionA: 'Nino Farina', optionB: 'Juan Manuel Fangio', correctAnswer: 'A' },
  { question: 'Quale marchio produce la moto Ninja?', optionA: 'Kawasaki', optionB: 'Yamaha', correctAnswer: 'A' },
  { question: 'In quale anno è stata fondata la Ferrari?', optionA: '1939', optionB: '1950', correctAnswer: 'A' },
  { question: 'Di quale paese è originaria la Harley-Davidson?', optionA: 'USA', optionB: 'Canada', correctAnswer: 'A' },
  { question: 'Quale pilota è soprannominato "Il Dottore" in MotoGP?', optionA: 'Valentino Rossi', optionB: 'Max Biaggi', correctAnswer: 'A' },
  { question: 'Quante ruote ha un quad?', optionA: 'Quattro', optionB: 'Tre', correctAnswer: 'A' },

  // --- DIVERTIMENTO FRA AMICI ---
  { question: 'Quante carte ha un mazzo di carte napoletane?', optionA: '40', optionB: '52', correctAnswer: 'A' },
  { question: 'Quanti giocatori si siedono al tavolo nel poker Texas Hold\'em massimo?', optionA: 'Dieci', optionB: 'Otto', correctAnswer: 'A' },
  { question: 'Quale cocktail è fatto con prosecco e succo di pesca?', optionA: 'Bellini', optionB: 'Spritz', correctAnswer: 'A' },
  { question: 'Quanti punti vale la parola su un bordo doppio in Scarabeo?', optionA: 'Il doppio del valore', optionB: 'Il triplo del valore', correctAnswer: 'A' },
  { question: 'In quale gioco si punta su numeri da 1 a 36?', optionA: 'Roulette', optionB: 'Craps', correctAnswer: 'A' },
  { question: 'Quante boccole ha il bowling?', optionA: 'Dieci', optionB: 'Nove', correctAnswer: 'A' },
  { question: 'Qual è la bevanda base dello Spritz veneziano?', optionA: 'Prosecco', optionB: 'Champagne', correctAnswer: 'A' },
  { question: 'In quale gioco da tavolo si conquista il mondo con le armate?', optionA: 'Risiko', optionB: 'Monopoly', correctAnswer: 'A' },
  { question: 'Quante carte si danno a testa nella Briscola?', optionA: 'Tre', optionB: 'Cinque', correctAnswer: 'A' },
  { question: 'Quale piattaforma è famosa per i video brevi di 60 secondi?', optionA: 'TikTok', optionB: 'Instagram', correctAnswer: 'A' },
  { question: 'Quante persone ha una squadra nel quiz show "Chi vuol essere milionario"?', optionA: 'Una', optionB: 'Due', correctAnswer: 'A' },
  { question: 'In che anno è stato fondato Facebook?', optionA: '2004', optionB: '2006', correctAnswer: 'A' },
]

export function getShuffledQuestions(count = 21): Question[] {
  return [...QUESTIONS]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map(q => {
      // Randomly swap A/B so the "wrong" answer isn't always the same option
      if (Math.random() > 0.5) {
        return {
          ...q,
          optionA: q.optionB,
          optionB: q.optionA,
          correctAnswer: q.correctAnswer === 'A' ? 'B' : 'A',
        }
      }
      return q
    })
}
