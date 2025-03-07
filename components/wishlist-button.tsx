"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import type { Product } from "@/lib/data"
import { useWishlist } from "@/context/wishlist-context"

interface WishlistButtonProps {
  product: Product
  variant?: "default" | "outline" | "ghost"
  showText?: boolean
}

export default function WishlistButton({ product, variant = "outline", showText = true }: WishlistButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  const handleToggleWishlist = () => {
    setIsAdding(true)

    // Add or remove item from wishlist
    if (inWishlist) {
      removeItem(product.id)
    } else {
      addItem(product)
    }

    // Show animation
    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  return (
    <Button
      variant={variant}
      onClick={handleToggleWishlist}
      disabled={isAdding}
      className={inWishlist ? "text-red-500 hover:text-red-600" : ""}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={`${showText ? "mr-2" : ""} h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
      {showText && (inWishlist ? "Remove from Wishlist" : "Add to Wishlist")}
    </Button>
  )
}

