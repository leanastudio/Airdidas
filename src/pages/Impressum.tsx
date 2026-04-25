import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from './Impressum.module.css'

export default function Impressum() {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
  }, [])

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div ref={contentRef} className={styles.inner}>

          <Link to="/" className={styles.back}>← Back</Link>

          <h1 className={styles.heading}>Impressum</h1>
          <p className={styles.note}>
            This is a fictional company created for portfolio purposes only.
            No real products, services, or legal entities are represented.
          </p>

          <section className={styles.section}>
            <h2>Angaben gemäß § 5 TMG</h2>
            <p>
              Airdidas GmbH<br />
              Laufstraße 42<br />
              80331 München<br />
              Deutschland
            </p>
          </section>

          <section className={styles.section}>
            <h2>Vertreten durch</h2>
            <p>Anna Müller (Geschäftsführerin)</p>
          </section>

          <section className={styles.section}>
            <h2>Kontakt</h2>
            <p>
              Telefon: +49 89 123 456 78<br />
              E-Mail: hello@airdidas.com
            </p>
          </section>

          <section className={styles.section}>
            <h2>Registereintrag</h2>
            <p>
              Eintragung im Handelsregister<br />
              Registergericht: Amtsgericht München<br />
              Registernummer: HRB 987654
            </p>
          </section>

          <section className={styles.section}>
            <h2>Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:<br />
              DE 123 456 789
            </p>
          </section>

          <section className={styles.section}>
            <h2>Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <span className={styles.fakeLink}>https://ec.europa.eu/consumers/odr</span>.<br />
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
              Tätigkeit hinweisen.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

          <div className={styles.portfolio}>
            ⚠️ Dieses Impressum gehört zu einem fiktiven Portfolio-Projekt und hat keine rechtliche Gültigkeit.
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
