"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"

export type Product = {
  id: string
  name: string
  price: number
  image: string
  category: string
}

/**
 * Single product card used across category & home pages.
 */
export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
    <div
      className="group rounded-lg border p-4 transition-shadow hover:shadow-md"
      data-product-id={product.id}
      data-product-category={product.category}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-md">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <h3 className="mb-1 font-medium">{product.name}</h3>
        <p className="mb-3 text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
      </Link>

      <Button variant="secondary" size="sm" className="w-full" onClick={() => addItem({ product, quantity: 1 })}>
        <ShoppingCart className="mr-2 h-4 w-4" />
        Add to cart
      </Button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Default export for backward-compatibility                                   */
/* -------------------------------------------------------------------------- */
export default ProductCard
