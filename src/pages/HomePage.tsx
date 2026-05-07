import { GAMES } from '../types/game'
import GameCard from '../components/GameCard'
import styles from './HomePage.module.css'

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Background decorative elements */}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
      <div className={styles.bgGrid} />

      {/* Main header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🎲</span>
          </div>
          <h1 className={styles.mainTitle}>
            <span className={[styles.titleWord, styles.titlePedro].join(' ')}>PEDRO</span>
            <span className={[styles.titleWord, styles.titlePoli].join(' ')}>POLI</span>
          </h1>
          <p className={styles.headerTagline}>Il party game show dei tuoi sogni</p>
          <p className={styles.headerSubtitle}>
            Sfida i tuoi amici con giochi esclusivi ispirati ai più grandi quiz show televisivi
          </p>
        </div>
      </header>

      {/* All Games Grid */}
      <section className={styles.allGamesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Giochi Disponibili</h2>
          <div className={styles.headerLine} />
        </div>
        <div className={styles.grid}>
          {GAMES.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            🎲 <strong>Pedropoli</strong> - Il party game show dei tuoi sogni
          </p>
          <p className={styles.footerSub}>Realizzato con ❤️ per le serate tra amici</p>
        </div>
      </footer>
    </div>
  )
}
