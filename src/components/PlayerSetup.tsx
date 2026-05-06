import { useState } from 'react'
import styles from './PlayerSetup.module.css'
import Button from './Button'

interface Props {
  label?: string
  players: string[]
  onChange: (players: string[]) => void
  min?: number
  max?: number
  placeholder?: string
}

export default function PlayerSetup({
  label = 'Giocatori',
  players,
  onChange,
  min = 1,
  max = 8,
  placeholder = 'Nome giocatore',
}: Props) {
  const [input, setInput] = useState('')

  const add = () => {
    const name = input.trim()
    if (!name || players.length >= max) return
    onChange([...players, name])
    setInput('')
  }

  const remove = (idx: number) => {
    onChange(players.filter((_, i) => i !== idx))
  }

  const update = (idx: number, value: string) => {
    const copy = [...players]
    copy[idx] = value
    onChange(copy)
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.list}>
        {players.map((p, idx) => (
          <div key={idx} className={styles.item}>
            <span className={styles.num}>{idx + 1}</span>
            <input
              className={styles.input}
              value={p}
              onChange={e => update(idx, e.target.value)}
              placeholder={`${placeholder} ${idx + 1}`}
            />
            {players.length > min && (
              <button className={styles.remove} onClick={() => remove(idx)} title="Rimuovi">✕</button>
            )}
          </div>
        ))}
      </div>
      {players.length < max && (
        <div className={styles.addRow}>
          <input
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder={`Aggiungi ${label.toLowerCase()}...`}
          />
          <Button variant="secondary" size="sm" onClick={add}>+ Aggiungi</Button>
        </div>
      )}
    </div>
  )
}
