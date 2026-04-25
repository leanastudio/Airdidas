import { useRef, useEffect, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ShoeModel from './ShoeModel'
import styles from './Showcase.module.css'
import { asset } from '../utils/base'



gsap.registerPlugin(ScrollTrigger)

const models = [
  {
    id: 'airlift',
    name: 'Air Lift 01',
    tag: 'Flagship',
    bg: '#e8f5fd',
    dark: false,
    flip: false,
    desc: 'Ultra-light mesh with reactive air cushioning. Zero gravity feel.',
    spec: ['87g', 'Upper weight'],
    glb: asset('airlift.glb'),
    tint: '#ffffff',
    ambientColor: '#c8e8ff',
    glowColor: '#90ccff',
    rimColor: '#a0d8ff',
  },
  {
    id: 'cloudrun',
    name: 'Cloud Run X',
    tag: 'Performance',
    bg: '#ede0ff',
    dark: false,
    flip: true,            // shoe left, text right
    desc: 'Engineered for distance. Cloud foam disperses impact across every stride.',
    spec: ['42km', 'Tested range'],
    glb: asset('shoe.glb'),
    tint: '#c8a8ff',
    ambientColor: '#e0d0ff',
    glowColor: '#c8a8ff',
    rimColor: '#b080ff',
  },
  {
    id: 'void',
    name: 'Void Runner',
    tag: 'Limited Edition',
    bg: '#0e0b1e',
    dark: true,
    flip: false,
    desc: 'Dark matter aesthetic. Reflective panels for visibility in any condition.',
    spec: ['Limited', '200 pairs'],
    glb: asset('airlift.glb'),
    tint: '#ffffff',
    ambientColor: '#080612',
    glowColor: '#4444dd',
    rimColor: '#6060ff',
  },
]

function ShoeCanvas({
  glb, tint, ambientColor, glowColor, rimColor,
}: {
  glb: string; tint: string
  ambientColor: string; glowColor: string; rimColor: string
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 3.6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={2.2} color={ambientColor} />
      <directionalLight position={[-2, 4, 3]} intensity={2.8} color="#ffffff" />
      <pointLight position={[2, 0, -2]} intensity={3.5} color={glowColor} />
      <pointLight position={[-2, 2, 2]} intensity={1.8} color="#ffffff" />
      <pointLight position={[0, -1, -3]} intensity={2.5} color={rimColor} />
      <Suspense fallback={null}>
        <ShoeModel file={glb} color={tint} />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  )
}

export default function Showcase() {
  const textRefs   = useRef<(HTMLDivElement | null)[]>([])
  const canvasRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    models.forEach((m, i) => {
      const textEl   = textRefs.current[i]
      const canvasEl = canvasRefs.current[i]
      if (!textEl || !canvasEl) return

      const fromX = m.flip ? 60 : -60

      gsap.fromTo(textEl,
        { opacity: 0, x: -fromX },
        { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: textEl, start: 'top 78%' } }
      )
      gsap.fromTo(canvasEl,
        { opacity: 0, x: fromX },
        { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: canvasEl, start: 'top 78%' } }
      )
    })
    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  return (
    <>
      {/* ── Section header ── */}
      <div id="collection" className={styles.header}>
        <span className={styles.label}>THE COLLECTION</span>
        <h2 className={styles.title}>Engineered for Lift</h2>
        <p className={styles.desc}>Three models. One obsession: defying gravity.</p>
      </div>

      {/* ── One full-width section per model ── */}
      {models.map((m, i) => (
        <section
          key={m.name}
          className={`${styles.modelSection} ${m.dark ? styles.modelSectionDark : ''}`}
          style={{ background: m.bg }}
        >
          {/* Shoe side */}
          <div
            ref={(el) => { canvasRefs.current[i] = el }}
            className={`${styles.canvasWrap} ${m.flip ? styles.orderFirst : styles.orderLast}`}
          >
            <ShoeCanvas
              glb={m.glb}
              tint={m.tint}
              ambientColor={m.ambientColor}
              glowColor={m.glowColor}
              rimColor={m.rimColor}
            />
          </div>

          {/* Text side */}
          <div
            ref={(el) => { textRefs.current[i] = el }}
            className={`${styles.textWrap} ${m.flip ? styles.orderLast : styles.orderFirst}`}
          >
            <span className={`${styles.modelTag} ${m.dark ? styles.modelTagLight : ''}`}>
              {m.tag}
            </span>
            <h2 className={`${styles.modelName} ${m.dark ? styles.modelNameLight : ''}`}>
              {m.name}
            </h2>
            <p className={`${styles.modelDesc} ${m.dark ? styles.modelDescLight : ''}`}>
              {m.desc}
            </p>
            <div className={`${styles.specRow} ${m.dark ? styles.specRowLight : ''}`}>
              <span className={styles.specVal}>{m.spec[0]}</span>
              <span className={styles.specKey}>{m.spec[1]}</span>
            </div>
            <Link
              to={`/shop?filter=${m.id}`}
              className={`${styles.modelCta} ${m.dark ? styles.modelCtaLight : ''}`}
            >
              View Model
            </Link>
          </div>
        </section>
      ))}

    </>
  )
}
