import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const { items, removeItem, total, isOpen, closeCart } = useCart()
  const navigate = useNavigate()

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className={styles.backdrop} onClick={closeCart} />}

      {/* Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Cart</h2>
          <span className={styles.itemCount}>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
          <button className={styles.closeBtn} onClick={closeCart}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🛒</span>
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <>
            <ul className={styles.list}>
              {items.map((item) => (
                <li key={item.uid} className={styles.item}>
                  {/* Color dot */}
                  <div
                    className={styles.colorDot}
                    style={{ background: item.colorHex }}
                  />
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.modelName}</span>
                    <span className={styles.itemMeta}>
                      {item.colorLabel} · EU {item.size}
                    </span>
                  </div>
                  <div className={styles.itemRight}>
                    <span className={styles.itemPrice}>€{item.price}</span>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.uid)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalPrice}>€{total}</span>
              </div>
              <p className={styles.shipping}>Free shipping on this order</p>
              <button className={styles.checkoutBtn} onClick={() => { closeCart(); navigate('/checkout') }}>
                Proceed to Checkout
              </button>
              <button className={styles.continueBtn} onClick={closeCart}>
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
