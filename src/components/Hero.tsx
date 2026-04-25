import { useEffect, useRef, Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { gsap } from 'gsap'
import ShoeModel from './ShoeModel'
import styles from './Hero.module.css'
import skyBg from '../assets/sky.png'
import { asset } from '../utils/base'

const COLORS = [
  { label: 'White',    hex: '#ffffff' },
  { label: 'Lilac',    hex: '#c8a8ff' },
  { label: 'Noir',     hex: '#1a1a2e' },
  { label: 'Sky',      hex: '#7ec8e3' },
  { label: 'Ember',    hex: '#ff6b4a' },
  { label: 'Sage',     hex: '#9ec89a' },
]


function Lights() {
  return (
    <>
      <ambientLight intensity={2.5} color="#ffffff" />
      <directionalLight position={[-3, 5, 4]} intensity={3.0} color="#ffffff" />
      <pointLight position={[2, 1, -3]} intensity={4.0} color="#d8b8ff" />
      <pointLight position={[-2, 2, 3]} intensity={2.0} color="#ffffff" />
      {/* Rim light from behind — gives white shoe definition against bright sky */}
      <pointLight position={[0, 0, -4]} intensity={3.5} color="#a0c8ff" />
    </>
  )
}

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef      = useRef<HTMLParagraphElement>(null)
  const ctaRef      = useRef<HTMLButtonElement>(null)
  const tagRef      = useRef<HTMLSpanElement>(null)
  const [activeColor, setActiveColor] = useState(COLORS[0].hex)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(tagRef.current,      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 })
      .fromTo(headlineRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.3')
      .fromTo(subRef.current,      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
      .fromTo(ctaRef.current,      { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 }, '-=0.3')
  }, [])

  return (
    <section className={styles.hero} style={{ backgroundImage: `url(${skyBg})` }}>
      <div className={styles.overlay} />

      <div className={styles.canvas}>
          <Canvas
            camera={{ position: [0, 0.1, 4.0], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
          >
            <Lights />
            <Suspense fallback={null}>
              <ShoeModel file={asset('airlift.glb')} color={activeColor} position={[0, 0, 0]} />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
          </Canvas>
      </div>

      <div className={styles.content}>
        <span ref={tagRef} className={styles.tag}>NEW COLLECTION 2025</span>
        <h1 ref={headlineRef} className={styles.headline}>
          Run Above<br />Reality
        </h1>
        <p ref={subRef} className={styles.sub}>
          Engineered for those who refuse to stay grounded.
        </p>
        <button ref={ctaRef} className={styles.cta} onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>Explore Collection</button>

        <div className={styles.colorPicker}>
          <span className={styles.colorLabel}>Color</span>
          <div className={styles.swatches}>
            {COLORS.map((c) => (
              <button
                key={c.hex}
                className={styles.swatch}
                title={c.label}
                style={{ background: c.hex }}
                data-active={activeColor === c.hex}
                onClick={() => setActiveColor(c.hex)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}
