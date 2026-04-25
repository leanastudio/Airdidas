import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from './Contact.module.css'
import skyBg from '../assets/sky.png'

export default function Contact() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const formRef    = useRef<HTMLDivElement>(null)
  const infoRef    = useRef<HTMLDivElement>(null)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(headingRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 })
      .fromTo(infoRef.current,    { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7 }, '-=0.4')
      .fromTo(formRef.current,    { opacity: 0, x: 30 },  { opacity: 1, x: 0, duration: 0.7 }, '-=0.6')
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      <Navbar />
      <main className={styles.page} style={{ backgroundImage: `url(${skyBg})` }}>
        <div className={styles.overlay} />
        <div className={styles.inner}>
          <h1 ref={headingRef} className={styles.heading}>Get in Touch</h1>

          <div className={styles.grid}>
            {/* Left — Info */}
            <div ref={infoRef} className={styles.info}>
              <p className={styles.intro}>
                Questions about our collection, partnerships or just want to say hi?
                We'd love to hear from you.
              </p>

              <ul className={styles.details}>
                <li>
                  <span className={styles.detailLabel}>Address</span>
                  <span>Airdidas GmbH<br />Laufstraße 42<br />80331 München</span>
                </li>
                <li>
                  <span className={styles.detailLabel}>Email</span>
                  <span>hello@airdidas.com</span>
                </li>
                <li>
                  <span className={styles.detailLabel}>Phone</span>
                  <span>+49 89 123 456 78</span>
                </li>
                <li>
                  <span className={styles.detailLabel}>Hours</span>
                  <span>Mon – Fri, 9:00 – 18:00</span>
                </li>
              </ul>

              <div className={styles.socials}>
                {['Instagram', 'TikTok', 'Pinterest'].map((s) => (
                  <span key={s} className={styles.social}>{s}</span>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div ref={formRef} className={styles.formWrap}>
              {sent ? (
                <div className={styles.success}>
                  <span className={styles.successIcon}>✓</span>
                  <p>Message received. We'll get back to you within 48 hours.</p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.row}>
                    <label className={styles.field}>
                      <span>First Name</span>
                      <input type="text" placeholder="Anna" required />
                    </label>
                    <label className={styles.field}>
                      <span>Last Name</span>
                      <input type="text" placeholder="Müller" required />
                    </label>
                  </div>
                  <label className={styles.field}>
                    <span>Email</span>
                    <input type="email" placeholder="anna@example.com" required />
                  </label>
                  <label className={styles.field}>
                    <span>Subject</span>
                    <input type="text" placeholder="I have a question about…" />
                  </label>
                  <label className={styles.field}>
                    <span>Message</span>
                    <textarea rows={5} placeholder="Your message…" required />
                  </label>
                  <button type="submit" className={styles.submit}>Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
