import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <span className={styles.logo}>AIRDIDAS</span>
        <p className={styles.tagline}>Run Above Reality</p>
      </div>
      <div className={styles.bottom}>
        <span>© 2025 Airdidas. Portfolio concept project.</span>
        <div className={styles.legal}>
          <Link to="/impressum" className={styles.legalLink}>Impressum</Link>
          <Link to="/contact" className={styles.legalLink}>Contact</Link>
        </div>
      </div>
    </footer>
  )
}
