import { useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ShoeModel from '../components/ShoeModel'
import { asset } from '../utils/base'
import styles from './Stories.module.css'

gsap.registerPlugin(ScrollTrigger)

function Lights() {
  return (
    <>
      <ambientLight intensity={2.5} color="#ffffff" />
      <directionalLight position={[-3, 5, 4]} intensity={3.0} color="#ffffff" />
      <pointLight position={[2, 1, -3]} intensity={4.0} color="#d8b8ff" />
      <pointLight position={[-2, 2, 3]} intensity={2.0} color="#ffffff" />
      <pointLight position={[0, 0, -4]} intensity={3.5} color="#a0c8ff" />
    </>
  )
}

export default function Stories() {
  const heroRef    = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLElement[]>([])

  useEffect(() => {
    // Hero parallax
    gsap.to(heroRef.current, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
    })

    // Fade-in each section
    sectionsRef.current.forEach((el) => {
      if (!el) return
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        }
      )
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  const addSection = (el: HTMLElement | null, i: number) => {
    if (el) sectionsRef.current[i] = el
  }

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <div className={styles.hero}>
        <div ref={heroRef} className={styles.heroBg} style={{ backgroundImage: `url(${asset('stories/sketch-desk.png')})` }} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.tag}>BEHIND THE DESIGN</span>
          <h1 className={styles.heroTitle}>Air Lift 01</h1>
          <p className={styles.heroSub}>From pencil to polygon — the full story.</p>
        </div>
        <div className={styles.scrollHint}>
          <span>Scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </div>

      <main className={styles.main}>

        {/* ── 01 THE IDEA ── */}
        <section ref={(el) => addSection(el, 0)} className={styles.section}>
          <div className={styles.sectionNumber}>01</div>
          <div className={styles.splitLeft}>
            <div className={styles.textBlock}>
              <span className={styles.label}>The Idea</span>
              <h2 className={styles.sectionTitle}>It started<br />with a pencil.</h2>
              <p className={styles.body}>
                No screen. No software. Just paper, a pencil, and the question:
                what does a shoe feel like when it defies gravity?
                The first sketch of the Air Lift 01 was drawn in under 20 minutes —
                but it took three weeks of refinement before a single line felt right.
              </p>
              <p className={styles.body}>
                The translucent sole pods came from watching light refract through a glass
                of water. The padded collar from studying the cross-section of a running track.
                Every detail has a reason.
              </p>
            </div>
          </div>
          <div className={styles.splitRight}>
            <div className={styles.imageWrap}>
              <img src={asset('stories/sketch-clean.png')} alt="First sketch of the Air Lift 01" className={styles.image} />
              <div className={styles.imageCaption}>Iteration 1 — Profile Concept</div>
            </div>
          </div>
        </section>

        {/* ── FULL BLEED QUOTE ── */}
        <div ref={(el) => addSection(el, 1)} className={styles.quoteSection}>
          <blockquote className={styles.quote}>
            "127 iterations.<br />One silhouette."
          </blockquote>
        </div>

        {/* ── 02 MATERIAL ── */}
        <section ref={(el) => addSection(el, 2)} className={styles.section}>
          <div className={styles.splitRight}>
            <div className={styles.imageWrap}>
              <img src={asset('stories/material.png')} alt="Air Lift 01 mesh material close-up" className={styles.image} />
              <div className={styles.imageCaption}>Engineered mesh upper — pre-production sample</div>
            </div>
          </div>
          <div className={styles.splitLeft}>
            <div className={styles.textBlock}>
              <span className={styles.label}>Material Study</span>
              <h2 className={styles.sectionTitle}>Every millimeter<br />matters.</h2>
              <p className={styles.body}>
                The upper is constructed from a single-layer engineered mesh —
                lightweight enough to feel like nothing, structured enough to hold
                your foot precisely in place. The micro-perforations aren't decorative.
                They're positioned to align with pressure points during a full stride cycle.
              </p>
              <div className={styles.specs}>
                <div className={styles.spec}><span>87g</span><small>Upper weight</small></div>
                <div className={styles.spec}><span>0.4mm</span><small>Mesh thickness</small></div>
                <div className={styles.spec}><span>2 layers</span><small>Sole construction</small></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 03 3D PROCESS ── */}
        <section ref={(el) => addSection(el, 3)} className={`${styles.section} ${styles.sectionDark}`}>
          <div className={styles.splitLeft}>
            <div className={styles.textBlock}>
              <span className={`${styles.label} ${styles.labelLight}`}>Digital Prototype</span>
              <h2 className={`${styles.sectionTitle} ${styles.titleLight}`}>From sketch<br />to polygon.</h2>
              <p className={`${styles.body} ${styles.bodyLight}`}>
                The hand sketch was scanned and used as a reference layer in 3D software.
                Every curve from the paper became a bezier handle. Every annotation became
                a constraint. The first raw mesh had 473,060 faces — far too many for
                real-time rendering. It took two full rounds of retopology to get
                to a model that runs smoothly in any environment.
              </p>
              <div className={`${styles.specs} ${styles.specsLight}`}>
                <div className={styles.spec}><span>473k</span><small>Initial polygons</small></div>
                <div className={styles.spec}><span>3 weeks</span><small>3D refinement</small></div>
                <div className={styles.spec}><span>v11</span><small>Final mesh version</small></div>
              </div>
            </div>
          </div>
          <div className={styles.splitRight}>
            <div className={`${styles.imageWrap} ${styles.imageWrapDark}`}>
              <img src={asset('stories/meshy.png')} alt="Meshy AI raw 3D model" className={styles.image} />
              <div className={`${styles.imageCaption} ${styles.imageCaptionLight}`}>Raw mesh — Meshy AI, pre-texture</div>
            </div>
          </div>
        </section>

        {/* ── 04 THE RESULT ── */}
        <section ref={(el) => addSection(el, 4)} className={styles.finalSection}>
          <div className={styles.finalText}>
            <span className={styles.label}>The Result</span>
            <h2 className={styles.sectionTitle}>Meet the<br />Air Lift 01.</h2>
            <p className={styles.body}>
              Drag to rotate. Pick your color.
            </p>
            <Link to="/" className={styles.shopLink}>Shop the Air Lift 01 →</Link>
          </div>
          <div className={styles.finalCanvas}>
            <Canvas camera={{ position: [0, 0.1, 4.0], fov: 40 }} gl={{ antialias: true, alpha: true }}>
              <Lights />
              <Suspense fallback={null}>
                <ShoeModel file={asset('airlift.glb')} color="#ffffff" position={[0, 0, 0]} />
              </Suspense>
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} />
            </Canvas>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
