import { GAMES } from '../types/game'
import GameCard from '../components/GameCard'
import styles from './HomePage.module.css'

export default function HomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}>🎲</div>
          <div>
            <h1 className={styles.title}>
              <span className={styles.titlePedro}>PEDRO</span>
              <span className={styles.titlePoli}>POLI</span>
            </h1>
            <p className={styles.tagline}>Il party game show dei tuoi sogni</p>
          </div>
        </div>

        <div className={styles.decorRow}>
          {['🎯', '🏆', '⭐', '🎮', '🎉', '🔥', '💫', '🎊'].map((e, i) => (
            <span key={i} className={styles.decorEmoji} style={{ animationDelay: `${i * 0.3}s` }}>{e}</span>
          ))}
        </div>

        <p className={styles.subtitle}>
          Sfida i tuoi amici con giochi esclusivi ispirati ai più grandi quiz show televisivi!<br />
          <span className={styles.subtitleHighlight}>Scegli un gioco e che la festa abbia inizio! 🎉</span>
        </p>
      </header>

      <section className={styles.gamesSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionDecor}>▸</span>
          <h2 className={styles.sectionTitle}>Giochi Disponibili</h2>
          <span className={styles.sectionDecor}>◂</span>
        </div>
        <div className={styles.grid}>
          {GAMES.map((game, idx) => (
            <GameCard key={game.id} game={game} index={idx} />
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerDivider} />
        <p className={styles.footerText}>
          🎲 <strong>Pedropoli</strong> — Il party game show dei tuoi sogni
        </p>
        <p className={styles.footerSub}>Realizzato con ❤️ per le serate tra amici</p>
      </footer>
    </div>
  )
}
