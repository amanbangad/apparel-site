"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/data"
import { useCart } from "@/context/cart-context"
import { trackFbEvent } from "@/lib/analytics"

interface AddToCartButtonProps {
  product: Product
  selectedSize?: string
  selectedColor?: string
}

export default function AddToCartButton({ product, selectedSize, selectedColor }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    setIsAdding(true)

    // Add item to cart
    addItem(product, 1, selectedSize, selectedColor)

    // Track the Add to Cart event with enhanced microdata
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
        },
      ],
      // Enhanced microdata
      content_category: product.category,
      product_catalog_id: product.category,
      product_variant: selectedColor || "",
      product_size: selectedSize || "",
      product_availability: "in stock",
      product_brand: "Moo Deng",
    })

    // Show adding animation
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  return (
    <Button className="flex-1" onClick={handleAddToCart} disabled={isAdding}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isAdding ? "Adding..." : "Add to Cart"}
    </Button>
  )
}

