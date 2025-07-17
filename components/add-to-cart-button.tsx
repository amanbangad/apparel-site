"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import type { Product } from "@/lib/data"
import { useCart } from "@/context/cart-context"
import { motion, AnimatePresence } from "framer-motion"
import { trackFbEvent } from "@/lib/analytics"

interface AddToCartButtonProps {
  product: Product
  selectedSize?: string
  selectedColor?: string
}

export default function AddToCartButton({ product, selectedSize, selectedColor }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    setIsAdding(true)

    // Add item to cart
    addItem(product, 1, selectedSize, selectedColor)

    // Track AddToCart event for Meta Pixel
    trackFbEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: product.price,
      currency: "USD",
      contents: [
        {
          id: product.id,
          quantity: 1,
          item_price: product.price,
          name: product.name,
          category: product.category,
          variant: selectedColor || "",
          brand: "Moo Deng",
          size: selectedSize || "",
        },
      ],
    })

    // Show adding animation
    setTimeout(() => {
      setIsAdding(false)
      setShowSuccess(true)

      // Reset success state after a delay
      setTimeout(() => {
        setShowSuccess(false)
      }, 1500)
    }, 600)
  }

  return (
    <Button className="flex-1 relative overflow-hidden" onClick={handleAddToCart} disabled={isAdding || showSuccess}>
      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div
            key="success"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="flex items-center"
          >
            <Check className="mr-2 h-4 w-4" />
            Added to Cart
          </motion.div>
        ) : isAdding ? (
          <motion.div
            key="adding"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center"
          >
            <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Adding...
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
