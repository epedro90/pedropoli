# 🎲 Pedropoli — Il party game show dei tuoi sogni

Raccolta di giochi da fare tra amici, ispirata ai grandi quiz show televisivi. Basato su React + Vite + TypeScript, pubblicabile su GitHub Pages.

## Giochi inclusi

| Gioco | Descrizione |
|---|---|
| 🧠 **Intesa Vincente** | Due suggeritori si alternano parola per parola per far indovinare la parola segreta al compagno di squadra |
| 🎯 **Avanti un Altro – Finale al Contrario** | 21 domande a cui bisogna rispondere **sempre in modo sbagliato** |
| 🔤 **Completamento** | Le lettere della risposta si rivelano con il tempo — indovina prima che finisca il tuo cronometro |
| ❓ **Chi Sono?** | Indovina il personaggio o l’oggetto partendo da indizi progressivi e da un timer che stringe |
| 🚫 **Taboo Sprint** | Fai indovinare la parola senza dire i taboo: ogni turno corre veloce e ogni errore pesa |
| 🕵️ **Il Falso** | Tra quattro affermazioni una sola è inventata: scoprila prima che finisca il turno |

## Documentazione giochi

### Taboo Sprint

Gioco a tempo in cui un giocatore deve far indovinare una parola senza usare una lista di parole vietate.

- Obiettivo: totalizzare piu punti possibili entro il tempo del turno.
- Ritmo: molto rapido, con round brevi e punteggio immediato.
- Regola chiave: se il suggeritore usa una parola vietata, il round si interrompe o perde punti, a seconda della variante scelta.
- Varianti utili: penalita per salti, bonus per serie consecutive, modalita squadre o tutti contro tutti.

### Chi Sono?

Gioco di deduzione in cui bisogna indovinare un personaggio, un oggetto o un concetto partendo da indizi progressivi.

- Obiettivo: capire la soluzione nel minor numero di indizi possibile.
- Ritmo: cresce con il passare del turno, da indizi generici a dettagli sempre piu specifici.
- Struttura tipica: una carta nascosta, una serie di domande o suggerimenti, e un sistema di punti basato sulla rapidita.
- Varianti utili: giocatore singolo, sfida a squadre, oppure modalita con tempo fisso e numero limitato di tentativi.

### Il Falso

Gioco di osservazione e logica in cui tra piu opzioni una sola e falsa o inventata.

- Obiettivo: individuare l'opzione falsa prima degli altri.
- Ritmo: piu lento degli altri due, ma molto adatto a domande curiose e a un punteggio basato sulla precisione.
- Struttura tipica: 3 o 4 affermazioni, una sola e falsa, le altre sono vere.
- Varianti utili: risposta rapida con timer, classifica per percentuale di errori, modalita eliminazione dopo tot sbagli.

## Avvio in locale

```bash
npm install
npm run dev
```

Apri [http://localhost:5173](http://localhost:5173) nel browser.

## Build di produzione

```bash
npm run build
```

I file statici vengono generati nella cartella `dist/`.

## Pubblicazione su GitHub Pages

### 1. Deploy

```bash
npm run deploy
```

Questo comando esegue la build e pubblica la cartella `dist/` sul branch `gh-pages`.

### 2. Abilita GitHub Pages

Nel repository GitHub → **Settings** → **Pages** → scegli il branch `gh-pages` come sorgente.

## Struttura del progetto

```
src/
  components/       # Componenti riutilizzabili (Button, Timer, ScoreBoard, Modal, ...)
  games/
    intesa-vincente/
    avanti-un-altro/
    completamento/
    chi-sono/
    taboo-sprint/
    il-falso/
  pages/            # HomePage
  styles/           # CSS globale
  types/            # Definizioni tipi (GameDefinition, ecc.)
  App.tsx
  main.tsx
```

## Aggiungere un nuovo gioco

1. Crea `src/games/nuovo-gioco/` con `NuovoGioco.tsx`, `data.ts`, `types.ts`
2. Aggiungi la definizione in `src/types/game.ts` nell'array `GAMES`
3. La route si aggiunge in automatico: importa il componente in `src/App.tsx` e registralo in `GAME_COMPONENTS`

La homepage genera automaticamente le card dai dati in `GAMES`.
