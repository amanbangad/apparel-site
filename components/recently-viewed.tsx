"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProductById, type Product } from "@/lib/data"

const STORAGE_KEY = "recently-viewed-products"
const MAX_RECENT_ITEMS = 6

function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function addToRecentlyViewed(productId: string) {
  if (typeof window === "undefined") return

  try {
    const recent = getRecentlyViewed()
    const filtered = recent.filter((id: string) => id !== productId)
    const updated = [productId, ...filtered].slice(0, MAX_RECENT_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // Silently fail if localStorage is not available
  }
}

export function addProductToRecentlyViewed(productId: string) {
  addToRecentlyViewed(productId)
}

export default function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([])

  useEffect(() => {
    const recentlyViewed = getRecentlyViewed()

    if (recentlyViewed.length === 0) {
      setRecentProducts([])
      return
    }

    // Get product details for recently viewed items
    const products = recentlyViewed
      .map((id: string) => getProductById(id))
      .filter((product): product is Product => product !== undefined)

    setRecentProducts(products)
  }, [])

  if (recentProducts.length === 0) {
    return null
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Recently Viewed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {recentProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <Badge className="absolute top-2 left-2" variant="destructive">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
