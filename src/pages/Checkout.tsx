import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'
import styles from './Checkout.module.css'

const COUNTRIES = [
  'Germany', 'Austria', 'Switzerland', 'France', 'Netherlands',
  'Belgium', 'Italy', 'Spain', 'United Kingdom', 'United States',
]

type Step = 'form' | 'confirmed'

export default function Checkout() {
  const { items, total, removeItem } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('form')
  const [orderNumber] = useState(() => Math.floor(100000 + Math.random() * 900000).toString())
  const [shipping, setShipping] = useState<'standard' | 'express'>('standard')
  const shippingCost = shipping === 'express' ? 9.9 : 0
  const grandTotal = total + shippingCost

  // Form state
  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '',
    address: '', city: '', postal: '', country: 'Germany',
    cardNumber: '', expiry: '', cvv: '', cardName: '',
  })

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function formatCard(val: string) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }

  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStep('confirmed')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (items.length === 0 && step === 'form') {
    return (
      <>
        <Navbar />
        <div className={styles.empty}>
          <p>Your cart is empty.</p>
          <Link to="/shop" className={styles.backLink}>Back to Shop</Link>
        </div>
      </>
    )
  }

  /* ── Confirmation screen ── */
  if (step === 'confirmed') {
    return (
      <>
        <Navbar />
        <div className={styles.confirmed}>
          <div className={styles.confirmedInner}>
            <div className={styles.checkCircle}>✓</div>
            <span className={styles.confirmedTag}>Order Confirmed</span>
            <h1 className={styles.confirmedTitle}>Thank you,<br />{form.firstName || 'Runner'}.</h1>
            <p className={styles.confirmedSub}>
              Your order <strong>#{orderNumber}</strong> has been placed.
              We'll send a confirmation to <strong>{form.email || 'your email'}</strong>.
            </p>
            <div className={styles.confirmedItems}>
              {items.map((item) => (
                <div key={item.uid} className={styles.confirmedItem}>
                  <div className={styles.confirmedDot} style={{ background: item.colorHex }} />
                  <span>{item.modelName} · {item.colorLabel} · EU {item.size}</span>
                  <span>€{item.price}</span>
                </div>
              ))}
              {shippingCost > 0 && (
                <div className={styles.confirmedItem}>
                  <div className={styles.confirmedDot} style={{ background: '#e0e0e0' }} />
                  <span>Express Shipping</span>
                  <span>€{shippingCost.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className={styles.confirmedTotal}>
              <span>Total paid</span>
              <span>€{grandTotal.toFixed(2)}</span>
            </div>
            <p className={styles.deliveryNote}>
              Estimated delivery:{' '}
              {shipping === 'express' ? '1–2 business days' : '3–5 business days'}
            </p>
            <Link to="/" className={styles.homeLink}>Back to Home</Link>
          </div>
        </div>
      </>
    )
  }

  /* ── Checkout form ── */
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.inner}>

          {/* ── Left: form ── */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <Link to="/shop" className={styles.backLink}>← Back to Shop</Link>
            <h1 className={styles.pageTitle}>Checkout</h1>

            {/* Contact */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Contact</legend>
              <label className={styles.field}>
                <span>Email address</span>
                <input type="email" placeholder="anna@example.com" value={form.email} onChange={set('email')} required />
              </label>
            </fieldset>

            {/* Shipping address */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Shipping Address</legend>
              <div className={styles.row}>
                <label className={styles.field}>
                  <span>First name</span>
                  <input type="text" placeholder="Anna" value={form.firstName} onChange={set('firstName')} required />
                </label>
                <label className={styles.field}>
                  <span>Last name</span>
                  <input type="text" placeholder="Müller" value={form.lastName} onChange={set('lastName')} required />
                </label>
              </div>
              <label className={styles.field}>
                <span>Street address</span>
                <input type="text" placeholder="Laufstraße 42" value={form.address} onChange={set('address')} required />
              </label>
              <div className={styles.row}>
                <label className={styles.field}>
                  <span>Postal code</span>
                  <input type="text" placeholder="80331" value={form.postal} onChange={set('postal')} required />
                </label>
                <label className={styles.field}>
                  <span>City</span>
                  <input type="text" placeholder="München" value={form.city} onChange={set('city')} required />
                </label>
              </div>
              <label className={styles.field}>
                <span>Country</span>
                <select value={form.country} onChange={set('country')}>
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
            </fieldset>

            {/* Shipping method */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Shipping Method</legend>
              <div className={styles.shippingOptions}>
                <label className={`${styles.shippingOption} ${shipping === 'standard' ? styles.shippingOptionActive : ''}`}>
                  <input type="radio" name="shipping" checked={shipping === 'standard'} onChange={() => setShipping('standard')} />
                  <div className={styles.shippingInfo}>
                    <span className={styles.shippingName}>Standard</span>
                    <span className={styles.shippingTime}>3–5 business days</span>
                  </div>
                  <span className={styles.shippingPrice}>Free</span>
                </label>
                <label className={`${styles.shippingOption} ${shipping === 'express' ? styles.shippingOptionActive : ''}`}>
                  <input type="radio" name="shipping" checked={shipping === 'express'} onChange={() => setShipping('express')} />
                  <div className={styles.shippingInfo}>
                    <span className={styles.shippingName}>Express</span>
                    <span className={styles.shippingTime}>1–2 business days</span>
                  </div>
                  <span className={styles.shippingPrice}>€9.90</span>
                </label>
              </div>
            </fieldset>

            {/* Payment */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Payment</legend>
              <div className={styles.cardIcons}>
                {['VISA', 'MC', 'AMEX'].map((b) => (
                  <span key={b} className={styles.cardIcon}>{b}</span>
                ))}
              </div>
              <label className={styles.field}>
                <span>Card number</span>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={form.cardNumber}
                  onChange={(e) => setForm((f) => ({ ...f, cardNumber: formatCard(e.target.value) }))}
                  required
                  maxLength={19}
                />
              </label>
              <div className={styles.row}>
                <label className={styles.field}>
                  <span>Expiry</span>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={form.expiry}
                    onChange={(e) => setForm((f) => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                    required
                    maxLength={5}
                  />
                </label>
                <label className={styles.field}>
                  <span>CVV</span>
                  <input
                    type="text"
                    placeholder="···"
                    value={form.cvv}
                    onChange={(e) => setForm((f) => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    required
                    maxLength={4}
                  />
                </label>
              </div>
              <label className={styles.field}>
                <span>Name on card</span>
                <input type="text" placeholder="ANNA MÜLLER" value={form.cardName} onChange={set('cardName')} required />
              </label>
            </fieldset>

            <button type="submit" className={styles.placeOrder}>
              Place Order · €{grandTotal.toFixed(2)}
            </button>

            <p className={styles.legal}>
              By placing your order you agree to our fictional Terms of Service.
              This is a portfolio project — no real transaction will occur.
            </p>
          </form>

          {/* ── Right: order summary ── */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <ul className={styles.summaryItems}>
              {items.map((item) => (
                <li key={item.uid} className={styles.summaryItem}>
                  <div className={styles.summaryDot} style={{ background: item.colorHex }} />
                  <div className={styles.summaryItemInfo}>
                    <span className={styles.summaryItemName}>{item.modelName}</span>
                    <span className={styles.summaryItemMeta}>{item.colorLabel} · EU {item.size}</span>
                  </div>
                  <div className={styles.summaryItemRight}>
                    <span className={styles.summaryItemPrice}>€{item.price}</span>
                    <button className={styles.summaryRemove} onClick={() => removeItem(item.uid)} title="Remove">✕</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.summaryLines}>
              <div className={styles.summaryLine}>
                <span>Subtotal</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className={styles.summaryLine}>
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `€${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className={`${styles.summaryLine} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>€{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </>
  )
}
