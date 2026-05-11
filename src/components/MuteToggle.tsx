import { useSoundMuted } from '../hooks/useSoundMuted'
import styles from './MuteToggle.module.css'

export default function MuteToggle() {
  const [muted, toggle] = useSoundMuted()
  return (
    <button
      className={[styles.toggle, muted ? styles.muted : ''].filter(Boolean).join(' ')}
      onClick={toggle}
      aria-label={muted ? 'Attiva audio' : 'Disattiva audio'}
      title={muted ? 'Audio disattivato' : 'Audio attivo'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
