# Design System PS5 - Guida Implementazione Completa

## 📋 Contesto

Sito di party games interattivi (Pedropoli) che necessita di **refactoring completo del design system** da stile arcade/retrò a **stile PS5 moderno**.

## ✅ Cosa è stato fatto

### 1. **Tema PS5 creato** (`src/styles/global.css`)
Un nuovo tema `ps5` è stato aggiunto con:
- Colore primario: **#0078d4 → #00d4ff** (blu/ciano)
- Background: nero profondo (#050505)
- Effetti: glassmorphism, blur, ombre profonde
- Font: Poppins (sostituisce Orbitron arcade)
- Button: gradient ciano uniforme (no colori variopinti)
- Titolo: bianco puro (no cyan/pink separati)

### 2. **HomePage completamente ridisegnata**
- Nuovo header elaborato con background gradient
- Sezione "Giochi Disponibili" semplificata (no featured/popular)
- Background decorativo: orbs animate e grid pattern
- Footer rinnovato

### 3. **ThemeContext aggiornato**
Theme selector espanso a:
```typescript
type Theme = 'arcade' | 'modern' | 'ember' | 'minimalist' | 'colorful' | 'glass' | 'combined' | 'ps5'
```

## 🎯 Cosa devi fare

### **FASE 1: Cleanup (Priority: Alta)**

1. **Eliminare temi vecchi** da ThemeContext.tsx:
   - Rimuovere 'arcade', 'modern', 'ember', 'minimalist', 'colorful', 'glass', 'combined'
   - Mantenere solo 'ps5'
   - Aggiornare tipo `Theme` a: `type Theme = 'ps5'`
   - Impostare default a 'ps5'

2. **Pulire global.css**:
   - Rimuovere tutti i css dei vecchi temi (arcade, modern, ember, minimalist, colorful, glass, combined)
   - Mantenere:
     - Variabili CSS root (aggiornate a ps5)
     - Utility classes (.card-glass, .neon-border, .text-glow, etc.)
     - Animazioni globali
     - Il tema ps5

### **FASE 2: Redesign UI Components (Priority: Alta)**

Applicare stile PS5 a tutti i componenti. Modifica i file .module.css:

#### **Button.module.css**
```css
/* Tema ps5: tutti i bottoni diventano gradient ciano */
.primary {
  background: linear-gradient(135deg, #0078d4 0%, #00a8cc 100%);
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 120, 212, 0.3);
  border-radius: 12px;
}

.primary:hover {
  background: linear-gradient(135deg, #00a8cc 0%, #00d4ff 100%);
  box-shadow: 0 12px 40px rgba(0, 212, 255, 0.4);
  transform: translateY(-3px);
}

/* Tutti gli altri variant (.secondary, .success, .danger, etc.) = stesso stile del primary */
.secondary, .success, .danger, .warning {
  background: linear-gradient(135deg, #0078d4 0%, #00a8cc 100%);
  color: #ffffff;
  border: none;
  box-shadow: 0 8px 24px rgba(0, 120, 212, 0.3);
  border-radius: 12px;
}

.secondary:hover, .success:hover, .danger:hover, .warning:hover {
  background: linear-gradient(135deg, #00a8cc 0%, #00d4ff 100%);
  box-shadow: 0 12px 40px rgba(0, 212, 255, 0.4);
  transform: translateY(-3px);
}
```

#### **GameCard.module.css**
```css
.card {
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(15, 15, 15, 0.95));
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 212, 255, 0.1);
  backdrop-filter: blur(10px);
  /* Keep animations on hover */
}

.card:hover {
  border-color: rgba(0, 212, 255, 0.3);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 212, 255, 0.2);
}

/* Remove arcade glow effect - keep it minimal */
.glow {
  opacity: 0; /* Disable */
}

.title {
  color: #ffffff;
  text-shadow: none; /* Remove arcade glow */
  font-weight: 900;
}

.subtitle {
  color: #00d4ff; /* Keep accent cyan */
}
```

#### **GameCard.tsx - Modifica (IMPORTANTE)**
Nel file `src/components/GameCard.tsx`, riga ~40, rimuovere lo style inline dal button:

**PRIMA:**
```tsx
<Button
  variant="primary"
  size="lg"
  fullWidth
  onClick={() => navigate(game.route)}
  style={{ background: `linear-gradient(135deg, ${game.accentColor}, ${game.secondaryColor})`, color: '#06142e' } as React.CSSProperties}
>
  🎮 Gioca!
</Button>
```

**DOPO:**
```tsx
<Button
  variant="primary"
  size="lg"
  fullWidth
  onClick={() => navigate(game.route)}
>
  🎮 Gioca!
</Button>
```

**Perché:** Rimuovendo lo style inline, il CSS di Button.module.css per PS5 avrà la giusta specificity e non avrà bisogno di `!important`.

#### **Layout.module.css**
```css
/* Main layout container */
.layout {
  background: #050505;
  /* Keep minimal styling */
}

/* Se esiste header/nav: */
.header {
  background: linear-gradient(180deg, rgba(5, 5, 5, 0.95) 0%, rgba(5, 5, 5, 0.7) 100%);
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
}
```

### **FASE 3: Game Pages (Priority: Alta)**

Redesign delle pagine game:

#### **ScoreBoard.module.css**
```css
.scoreboard {
  background: linear-gradient(135deg, rgba(0, 120, 212, 0.1), rgba(0, 30, 60, 0.2));
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  padding: 2rem;
}

.teamScore {
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
}

.score {
  color: #00d4ff;
  font-weight: 900;
  font-size: 2.5rem;
}
```

#### **Timer.module.css**
```css
.timer {
  color: #00d4ff;
  font-weight: 900;
  font-size: 3rem;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
}

/* Pulse animation on low time */
.timerWarning {
  animation: pulse-cyan 0.5s ease-in-out infinite;
}

@keyframes pulse-cyan {
  0%, 100% { color: #00d4ff; text-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }
  50% { color: #ff4444; text-shadow: 0 0 20px rgba(255, 68, 68, 0.3); }
}
```

#### **Modal.module.css**
```css
.modal {
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(15, 15, 15, 0.98));
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 212, 255, 0.15);
}

.modalTitle {
  color: #ffffff;
  font-weight: 900;
}

.modalContent {
  color: #b0b0b0;
}
```

### **FASE 4: Game-Specific Pages (Priority: Media)**

Per ogni game page (`src/games/[game-name]/[Game].module.css`):

**Linee guida:**
- Background: `#050505`
- Card: `rgba(26, 26, 26, 0.85)` con `border: 1px solid rgba(0, 212, 255, 0.15)`
- Testo heading: `#ffffff`
- Testo accent: `#00d4ff`
- Button: sempre gradient ciano (non variare per gioco)
- Border-radius: almeno 12-16px (no bordi spigolosi)
- Shadow: profonde e scure (`rgba(0,0,0,0.8)`)

**Files da modificare:**
- `src/games/intesa-vincente/IntesaVincente.module.css`
- `src/games/avanti-un-altro/AvantiUnAltro.module.css`
- `src/games/completamento/Completamento.module.css`
- `src/games/chi-sono/ChiSono.module.css`
- `src/games/taboo-sprint/TabooSprint.module.css`
- `src/games/il-falso/IlFalso.module.css`
- `src/pages/PlayerSetup.module.css`

### **FASE 5: Animations & Polish (Priority: Bassa)**

Aggiungi animazioni sofisticate in global.css:

```css
@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.2); }
  50% { box-shadow: 0 0 40px rgba(0, 212, 255, 0.4); }
}

/* Aggiungi `animation-delay` progressivo ai componenti game-card */
```

## 🎨 Palette di Colori PS5

```
Primary: #0078d4 (blu profondo)
Secondary: #00a8cc (blu medio)
Accent: #00d4ff (ciano vivace)

Background: #050505 (nero profondo)
Surface: #1a1a1a (grigio scuro)
Surface-Light: rgba(26, 26, 26, 0.85) (semi-trasparente)

Text Primary: #ffffff (bianco)
Text Secondary: #b0b0b0 (grigio)
Text Muted: #808080 (grigio scuro)

Accent: #00d4ff (ciano - per highlight)
Warning: #ff4444 (rosso - per warning/timeout)
Success: #10b981 (verde - già in variabili)
```

## 📝 Checklist Implementazione

### FASE 1 - Cleanup
- [ ] Rimuovere temi vecchi da ThemeContext.tsx
- [ ] Pulire global.css dai vecchi temi
- [ ] Testare che tema 'ps5' sia default e funzionante

### FASE 2 - UI Components
- [ ] Button.module.css → gradient ciano uniforme
- [ ] GameCard.module.css → glassmorphism PS5
- [ ] Layout.module.css → background e header
- [ ] Testare HomePage con nuovo design

### FASE 3 - Game Pages
- [ ] ScoreBoard.module.css
- [ ] Timer.module.css
- [ ] Modal.module.css
- [ ] PlayerSetup.module.css

### FASE 4 - Game-Specific
- [ ] IntesaVincente.module.css
- [ ] AvantiUnAltro.module.css
- [ ] Completamento.module.css
- [ ] ChiSono.module.css
- [ ] TabooSprint.module.css
- [ ] IlFalso.module.css

### FASE 5 - Polish
- [ ] Animazioni
- [ ] Transizioni hover
- [ ] Testing responsive design

## 🧪 Testing

Dopo ogni fase:
1. **Visuale**: controlla HomePage, accedi a un gioco, verifica colori e animazioni
2. **Funzionalità**: assicurati che logica giochi non sia alterata
3. **Responsive**: testa mobile (480px, 768px, desktop)

## ⚠️ Attenzione

- **Non toccare logica giochi** - solo CSS
- **Mantenere animazioni Framer Motion** - aggiungi solo CSS animations
- **No breaking changes**: tutti i componenti devono restare funzionali
- **CSS fatto bene**: NO `!important` a meno che indispensabili. Risolvere inline styles modificando i React components (es. GameCard.tsx) piuttosto che usare `!important`
- **GameCard.tsx**: rimuovere lo style inline dal Button (vedi sezione GameCard.tsx in FASE 2)

## 📂 File da NON toccare

- `src/games/*/logic.ts` (logica giochi)
- `src/games/*/types.ts` (tipi)
- `src/games/*/data.ts` (dati)
- Componenti React logic (solo CSS modules)
- `src/types/game.ts`
- `src/context/ThemeContext.tsx` (dopo cleanup iniziale)

## 🚀 Come procedere

1. Inizia con FASE 1 (Cleanup)
2. Poi FASE 2 (UI Components principali)
3. Testa HomePage completamente
4. Procedi con FASE 3-4 in parallelo
5. FASE 5 (Polish) è opzionale se il tempo è limitato

---

**Nota finale**: L'obiettivo è mantenere il design PS5 moderno e sofisticato in TUTTA l'app, con coerenza visiva completa. Tutti i button sono ciano, tutti i background sono neri/scuri, tutte le card hanno glassmorphism.
