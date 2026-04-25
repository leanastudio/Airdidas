import { createContext, useContext, useState, ReactNode } from 'react'

export interface CartItem {
  uid: string
  modelName: string
  colorLabel: string
  colorHex: string
  size: number
  price: number
  glb: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'uid'>) => void
  removeItem: (uid: string) => void
  count: number
  total: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  function addItem(item: Omit<CartItem, 'uid'>) {
    setItems((prev) => [...prev, { ...item, uid: crypto.randomUUID() }])
  }

  function removeItem(uid: string) {
    setItems((prev) => prev.filter((i) => i.uid !== uid))
  }

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      count: items.length,
      total: items.reduce((sum, i) => sum + i.price, 0),
      isOpen,
      openCart:  () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
