import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Impressum from './pages/Impressum'
import Stories from './pages/Stories'
import Shop from './pages/Shop'
import Checkout from './pages/Checkout'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
        <Route path="/checkout" element={<Checkout />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/impressum" element={<Impressum />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
