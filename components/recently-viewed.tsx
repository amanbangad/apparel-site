"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getProductById } from "@/lib/data"
import type { Product } from "@/lib/data"

export default function RecentlyViewed({
  currentProductId,
}: {
  currentProductId?: string
}) {
  const [recentProducts, setRecentProducts] = useState<Product[]>([])

  useEffect(() => {
    /* ---------------- helpers ---------------- */
    const getRecentlyViewed = (): string[] => {
      try {
        const json = localStorage.getItem("recentlyViewed")
        return json ? (JSON.parse(json) as string[]) : []
      } catch {
        return []
      }
    }

    const saveRecentlyViewed = (ids: string[]) => localStorage.setItem("recentlyViewed", JSON.stringify(ids))

    const addToRecentlyViewed = (id: string) => {
      const withoutCurrent = getRecentlyViewed().filter((pid) => pid !== id)
      const updated = [id, ...withoutCurrent].slice(0, 4)
      saveRecentlyViewed(updated)
      setRecentProducts(updated.map((pid) => getProductById(pid)).filter((p): p is Product => Boolean(p)))
    }

    /* --------------- logic --------------- */
    if (currentProductId) {
      addToRecentlyViewed(currentProductId)
    } else {
      setRecentProducts(
        getRecentlyViewed()
          .map((pid) => getProductById(pid))
          .filter((p): p is Product => Boolean(p)),
      )
    }
  }, [currentProductId])

  /* no products? ----------------------------------------------------------- */
  const productsToShow = currentProductId ? recentProducts.filter((p) => p.id !== currentProductId) : recentProducts

  if (productsToShow.length === 0) return null

  /* render ----------------------------------------------------------------- */
  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-bold">Recently Viewed</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {productsToShow.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="group">
            <div className="overflow-hidden rounded-lg border bg-card">
              <div className="relative aspect-square">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  sizes="(max-width:640px) 50vw, 25vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="truncate text-sm font-medium">{product.name}</h3>
                <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
