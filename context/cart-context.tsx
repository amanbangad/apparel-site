"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "@/lib/data"
import { trackFbEvent } from "@/lib/analytics"

export type CartItem = {
  product: Product
  quantity: number
  size?: string
  color?: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const itemCount = items.reduce((total: number, item: CartItem) => total + item.quantity, 0)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to parse cart:", error)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, quantity = 1, size?: string, color?: string) => {
    setItems((prev: CartItem[]) => {
      const existing = prev.findIndex(
        (item: CartItem) => item.product.id === product.id && item.size === size && item.color === color,
      )

      if (existing >= 0) {
        const updated = [...prev]
        updated[existing].quantity += quantity
        return updated
      }

      return [...prev, { product, quantity, size, color }]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev: CartItem[]) => prev.filter((item: CartItem) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setItems((prev: CartItem[]) => prev.map((item: CartItem) => (item.product.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => setItems([])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}
