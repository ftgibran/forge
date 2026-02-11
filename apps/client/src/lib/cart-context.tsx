'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import type { Cart } from '@/types'

import { cartApi } from './api/cart'
import { useAuth } from './auth-context'

interface CartContextValue {
  cart: Cart | null
  cartCount: number
  isLoading: boolean
  addToCart: (variantId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refresh: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  const refresh = useCallback(async () => {
    if (!user) {
      setCart(null)

      return
    }

    try {
      setIsLoading(true)
      const data = await cartApi.get()

      setCart(data)
    } catch {
      setCart(null)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addToCart = useCallback(
    async (variantId: string, quantity = 1) => {
      await cartApi.addItem(variantId, quantity)
      await refresh()
    },
    [refresh],
  )

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      await cartApi.updateItem(itemId, quantity)
      await refresh()
    },
    [refresh],
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      await cartApi.removeItem(itemId)
      await refresh()
    },
    [refresh],
  )

  const clearCart = useCallback(async () => {
    await cartApi.clear()
    setCart(null)
  }, [])

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)

  if (!ctx) throw new Error('useCart must be used within CartProvider')

  return ctx
}
