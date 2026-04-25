import { useState, useRef, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { gsap } from 'gsap'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ShoeModel from '../components/ShoeModel'
import { useCart } from '../context/CartContext'
import { asset } from '../utils/base'
import styles from './Shop.module.css'

/* ── Data ── */
const MODELS = [
  {
    id: 'airlift',
    name: 'Air Lift 01',
    glb: asset('airlift.glb'),
    price: 249,
    tag: 'Flagship',
    desc: 'Engineered for those who refuse to stay grounded. The Air Lift 01 features a single-layer engineered mesh upper, reactive air cushioning, and translucent sole pods for a zero-gravity feel on every stride.',
    details: [
      { label: 'Upper', value: 'Single-layer engineered mesh' },
      { label: 'Sole', value: 'Dual-compound air cushion' },
      { label: 'Weight', value: '87g (upper only)' },
      { label: 'Drop', value: '8mm heel-to-toe' },
    ],
  },
  {
    id: 'cloudrun',
    name: 'Cloud Run X',
    glb: asset('shoe.glb'),
    price: 189,
    tag: 'Performance',
    desc: 'Built for the long run. Cloud foam pods disperse impact across the full length of each stride, while the adaptive mesh hugs your foot without restriction.',
    details: [
      { label: 'Upper', value: 'Adaptive knit mesh' },
      { label: 'Sole', value: 'Cloud foam pod system' },
      { label: 'Weight', value: '112g (upper only)' },
      { label: 'Drop', value: '10mm heel-to-toe' },
    ],
  },
  {
    id: 'void',
    name: 'Void Runner',
    glb: asset('airlift.glb'),
    price: 329,
    tag: 'Limited Edition',
    desc: 'Only 200 pairs. The Void Runner takes the Air Lift silhouette into darkness — reflective panels catch light in any condition, while the deep-space colorway makes a statement before you even move.',
    details: [
      { label: 'Upper', value: 'Reflective engineered mesh' },
      { label: 'Sole', value: 'Dual-compound air cushion' },
      { label: 'Edition', value: 'Limited — 200 pairs worldwide' },
      { label: 'Drop', value: '8mm heel-to-toe' },
    ],
  },
]

const COLORS = [
  { label: 'White',  hex: '#ffffff' },
  { label: 'Lilac',  hex: '#c8a8ff' },
  { label: 'Noir',   hex: '#1a1a2e' },
  { label: 'Sky',    hex: '#7ec8e3' },
  { label: 'Ember',  hex: '#ff6b4a' },
  { label: 'Sage',   hex: '#9ec89a' },
]

const EU_SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]

const ALL_PRODUCTS = MODELS.flatMap((model) =>
  COLORS.map((color) => ({ id: `${model.id}-${color.hex}`, model, color }))
)

/* ── Lazy Canvas wrapper ── */
function LazyCanvas({ children, className }: { children: React.ReactNode; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { rootMargin: '300px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className={className}>
      {inView && children}
    </div>
  )
}

/* ── Static shoe card ── */
function ShoeCard({
  product,
  onClick,
}: {
  product: typeof ALL_PRODUCTS[0]
  onClick: () => void
}) {
  const { model, color } = product
  return (
    <div
      className={styles.card}
      onClick={onClick}
    >
      <LazyCanvas className={styles.cardCanvas}>
        <Canvas
          camera={{ position: [0.6, 0.3, 3.4], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={2.4} color="#ffffff" />
          <directionalLight position={[-2, 4, 3]} intensity={2.5} color="#ffffff" />
          <pointLight position={[2, 0, -2]} intensity={3.0} color="#d8b8ff" />
          <pointLight position={[0, 0, -4]} intensity={2.0} color="#a0c8ff" />
          <Suspense fallback={null}>
            <ShoeModel file={model.glb} color={color.hex} />
          </Suspense>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            autoRotate={false}
          />
        </Canvas>
      </LazyCanvas>

      <div className={styles.cardInfo}>
        <div className={styles.cardColorDot} style={{ background: color.hex }} />
        <div className={styles.cardText}>
          <span className={styles.cardModel}>{model.name}</span>
          <span className={styles.cardColor}>{color.label}</span>
        </div>
        <span className={styles.cardPrice}>€{model.price}</span>
      </div>
    </div>
  )
}

/* ── Accordion item ── */
function AccordionItem({
  title, children, open, onToggle,
}: {
  title: string; children: React.ReactNode; open: boolean; onToggle: () => void
}) {
  return (
    <div className={styles.accordion}>
      <button className={styles.accordionBtn} onClick={onToggle}>
        <span>{title}</span>
        <span className={`${styles.accordionIcon} ${open ? styles.accordionIconOpen : ''}`}>+</span>
      </button>
      {open && <div className={styles.accordionBody}>{children}</div>}
    </div>
  )
}

/* ── Main page ── */
export default function Shop() {
  const { addItem, openCart } = useCart()
  const [searchParams] = useSearchParams()
  const [filter, setFilter] = useState<string>(searchParams.get('filter') ?? 'all')
  const [selected, setSelected]     = useState<typeof ALL_PRODUCTS[0] | null>(null)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [addedMsg, setAddedMsg]     = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>('description')
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef   = useRef<HTMLDivElement>(null)

  const filtered = filter === 'all'
    ? ALL_PRODUCTS
    : ALL_PRODUCTS.filter((p) => p.model.id === filter)

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
    }
  }, [])

  // Re-animate grid when filter changes
  useEffect(() => {
    if (!gridRef.current) return
    gsap.fromTo(
      gridRef.current.querySelectorAll(`.${styles.card}`),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.04 }
    )
  }, [filter])

  // Lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected])

  function handleAddToCart() {
    if (!selectedSize || !selected) return
    addItem({
      modelName:  selected.model.name,
      colorLabel: selected.color.label,
      colorHex:   selected.color.hex,
      size:       selectedSize,
      price:      selected.model.price,
      glb:        selected.model.glb,
    })
    setAddedMsg(true)
    setTimeout(() => {
      setAddedMsg(false)
      setSelected(null)
      openCart()
    }, 1000)
  }

  function openProduct(product: typeof ALL_PRODUCTS[0]) {
    setSelected(product)
    setSelectedSize(null)
    setAddedMsg(false)
    setOpenAccordion('description')
  }

  return (
    <>
      <Navbar />

      <main className={styles.page}>
        {/* ── Header ── */}
        <div ref={headerRef} className={styles.header}>
          <span className={styles.headerTag}>THE COLLECTION</span>
          <h1 className={styles.headerTitle}>Shop</h1>
          <p className={styles.headerDesc}>Every model. Every color.</p>
        </div>

        {/* ── Filter bar ── */}
        <div className={styles.filterBar}>
          {[
            { id: 'all',      label: `All (${ALL_PRODUCTS.length})` },
            { id: 'airlift',  label: 'Air Lift 01' },
            { id: 'cloudrun', label: 'Cloud Run X' },
            { id: 'void',     label: 'Void Runner' },
          ].map((f) => (
            <button
              key={f.id}
              className={`${styles.filterBtn} ${filter === f.id ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Product grid ── */}
        <div ref={gridRef} className={styles.grid}>
          {filtered.map((product) => (
            <ShoeCard
              key={product.id}
              product={product}
              onClick={() => openProduct(product)}
            />
          ))}
        </div>
      </main>

      <Footer />

      {/* ── Product detail modal ── */}
      {selected && (
        <div className={styles.modal} onClick={() => setSelected(null)}>
          <div className={styles.modalInner} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelected(null)}>✕</button>

            {/* Top: 3D + info */}
            <div className={styles.modalTop}>
              {/* 3D Canvas */}
              <div className={styles.modalCanvas}>
                <Canvas
                  camera={{ position: [0, 0.1, 4.0], fov: 40 }}
                  gl={{ antialias: true, alpha: true }}
                >
                  <ambientLight intensity={2.5} color="#ffffff" />
                  <directionalLight position={[-3, 5, 4]} intensity={3.0} color="#ffffff" />
                  <pointLight position={[2, 1, -3]} intensity={4.0} color="#d8b8ff" />
                  <pointLight position={[-2, 2, 3]} intensity={2.0} color="#ffffff" />
                  <pointLight position={[0, 0, -4]} intensity={3.5} color="#a0c8ff" />
                  <Suspense fallback={null}>
                    <ShoeModel file={selected.model.glb} color={selected.color.hex} />
                  </Suspense>
                  <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
                </Canvas>
                <span className={styles.dragHint}>Drag to rotate</span>
              </div>

              {/* Info panel */}
              <div className={styles.modalInfo}>
                <div className={styles.modalMeta}>
                  <span className={styles.modalTag}>{selected.model.tag}</span>
                  <h2 className={styles.modalName}>{selected.model.name}</h2>
                  <div className={styles.modalColorRow}>
                    <div className={styles.modalColorDot} style={{ background: selected.color.hex }} />
                    <span className={styles.modalColorName}>{selected.color.label}</span>
                  </div>
                  <p className={styles.modalPrice}>€{selected.model.price}</p>
                </div>

                {/* Size selector */}
                <div className={styles.sizeSection}>
                  <div className={styles.sizeLabelRow}>
                    <span className={styles.sizeLabel}>EU Size</span>
                    {selectedSize && (
                      <span className={styles.sizeSelected}>Selected: {selectedSize}</span>
                    )}
                  </div>
                  <div className={styles.sizeGrid}>
                    {EU_SIZES.map((s) => (
                      <button
                        key={s}
                        className={`${styles.sizeBtn} ${selectedSize === s ? styles.sizeBtnActive : ''}`}
                        onClick={() => setSelectedSize(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add to cart */}
                <button
                  className={`${styles.addToCart} ${!selectedSize ? styles.addToCartDisabled : ''} ${addedMsg ? styles.addToCartDone : ''}`}
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                >
                  {addedMsg ? '✓ Added to Cart' : selectedSize ? 'Add to Cart' : 'Select a Size'}
                </button>

                {/* Accordion */}
                <div className={styles.accordions}>
                  <AccordionItem
                    title="Description"
                    open={openAccordion === 'description'}
                    onToggle={() => setOpenAccordion(openAccordion === 'description' ? null : 'description')}
                  >
                    <p className={styles.accordionText}>{selected.model.desc}</p>
                  </AccordionItem>

                  <AccordionItem
                    title="Product Details"
                    open={openAccordion === 'details'}
                    onToggle={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}
                  >
                    <ul className={styles.detailList}>
                      {selected.model.details.map((d) => (
                        <li key={d.label}>
                          <span className={styles.detailKey}>{d.label}</span>
                          <span className={styles.detailVal}>{d.value}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionItem>

                  <AccordionItem
                    title="Shipping & Returns"
                    open={openAccordion === 'shipping'}
                    onToggle={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                  >
                    <p className={styles.accordionText}>
                      Free shipping on all orders over €100. Standard delivery 3–5 business days.
                      Express delivery available at checkout. Free returns within 30 days —
                      unworn, in original packaging.
                    </p>
                  </AccordionItem>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
