import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { count, openCart } = useCart()

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>AIRDIDAS</Link>
      <ul className={styles.links}>
        <li><a href="#">Technology</a></li>
        <li><Link to="/stories">Stories</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
      <div className={styles.navRight}>
        <Link to="/shop" className={styles.shopLink}>Shop</Link>
        <button className={styles.cartBtn} onClick={openCart}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {count > 0 && <span className={styles.cartBadge}>{count}</span>}
        </button>
      </div>
    </nav>
  )
}
