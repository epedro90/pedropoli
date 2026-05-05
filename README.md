# 🎲 Pedropoli — Il party game show dei tuoi sogni

Raccolta di giochi da fare tra amici, ispirata ai grandi quiz show televisivi. Basato su React + Vite + TypeScript, pubblicabile su GitHub Pages.

## Giochi inclusi

| Gioco | Descrizione |
|---|---|
| 🧠 **Intesa Vincente** | Due suggeritori si alternano parola per parola per far indovinare la parola segreta al compagno di squadra |
| 🎯 **Avanti un Altro – Finale al Contrario** | 21 domande a cui bisogna rispondere **sempre in modo sbagliato** |
| 🔤 **Completamento** | Le lettere della risposta si rivelano con il tempo — indovina prima che finisca il tuo cronometro |

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

### 1. Configura il base path

In `vite.config.ts`, imposta `base` con il nome del tuo repository:

```ts
// Se il repository si chiama "pedropoli":
base: '/pedropoli/'

// Se usi username.github.io come root:
base: '/'
```

### 2. Deploy

```bash
npm run deploy
```

Questo comando esegue la build e pubblica la cartella `dist/` sul branch `gh-pages`.

### 3. Abilita GitHub Pages

Nel repository GitHub → **Settings** → **Pages** → scegli il branch `gh-pages` come sorgente.

## Struttura del progetto

```
src/
  components/       # Componenti riutilizzabili (Button, Timer, ScoreBoard, Modal…)
  games/
    intesa-vincente/
    avanti-un-altro/
    completamento/
  pages/            # HomePage
  styles/           # CSS globale
  types/            # Definizioni tipi (GameDefinition, ecc.)
  App.tsx
  main.tsx
```

## Aggiungere un nuovo gioco

1. Crea `src/games/nuovo-gioco/` con `NuovoGioco.tsx`, `data.ts`, `types.ts`
2. Aggiungi la definizione in `src/types/game.ts` nell'array `GAMES`
3. Aggiungi la `<Route>` in `src/App.tsx`

La homepage genera automaticamente le card dai dati in `GAMES`.
