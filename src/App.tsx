import { lazy, Suspense } from 'react'
import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'

// Lazy-load every page except Home so the initial bundle stays small.
// Each page (+ its Three.js / GSAP deps) only downloads when the user navigates there.
const Shop     = lazy(() => import('./pages/Shop'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Stories  = lazy(() => import('./pages/Stories'))
const Contact  = lazy(() => import('./pages/Contact'))
const Impressum = lazy(() => import('./pages/Impressum'))

function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f0eb',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.8rem',
      letterSpacing: '0.15em',
      color: '#1a1a2e',
      opacity: 0.5,
    }}>
      LOADING
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <CartDrawer />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/shop"      element={<Shop />} />
            <Route path="/checkout"  element={<Checkout />} />
            <Route path="/stories"   element={<Stories />} />
            <Route path="/contact"   element={<Contact />} />
            <Route path="/impressum" element={<Impressum />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </CartProvider>
  )
}
