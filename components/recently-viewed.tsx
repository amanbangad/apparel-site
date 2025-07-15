"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getProductById } from "@/lib/data"
import type { Product } from "@/lib/data"

export default function RecentlyViewed({ currentProductId }: { currentProductId?: string }) {
  const [recentProducts, setRecentProducts] = useState<Product[]>([])

  useEffect(() => {
    // Get recently viewed products from localStorage
    const getRecentlyViewed = () => {
      try {
        const recentlyViewed = localStorage.getItem("recentlyViewed")
        return recentlyViewed ? JSON.parse(recentlyViewed) : []
      } catch (error) {
        console.error("Error parsing recently viewed products", error)
        return []
      }
    }

    // Add current product to recently viewed
    const addToRecentlyViewed = (productId: string) => {
      if (!productId) return

      const recentlyViewed = getRecentlyViewed()

      // Remove if already exists (to move it to the front)
      const filtered = recentlyViewed.filter((id: string) => id !== productId)

      // Add to front of array
      const updated = [productId, ...filtered].slice(0, 4)

      // Save to localStorage
      localStorage.setItem("recentlyViewed", JSON.stringify(updated))

      // Get product details and update state
      const products = updated
        .map((id) => getProductById(id))
        .filter((product): product is Product => product !== undefined)

      setRecentProducts(products)
    }

    // Initialize
    const recentlyViewed = getRecentlyViewed()

    // Add current product if provided
    if (currentProductId) {
      addToRecentlyViewed(currentProductId)
    } else {
      // Just display existing recently viewed products
      const products = recentlyViewed
        .map((id) => getProductById(id))
        .filter((product): product is Product => product !== undefined)

      setRecentProducts(products)
    }
  }, [currentProductId])

  // Don't show if there are no products or only the current product
  if (recentProducts.length === 0 || (recentProducts.length === 1 && recentProducts[0].id === currentProductId)) {
    return null
  }

  // Filter out current product from display
  const productsToShow = currentProductId
    ? recentProducts.filter((product) => product.id !== currentProductId)
    : recentProducts

  if (productsToShow.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {productsToShow.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="group">
            <div className="overflow-hidden rounded-lg border bg-card">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
