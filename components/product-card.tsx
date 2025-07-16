"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export function ProductCard({ product }: { product: Product }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md",
      )}
    >
      <Link href={`/products/${product.id}`} className="relative block h-56 w-full">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm font-medium">{product.name}</h3>
        <p className="mt-auto text-base font-semibold">${product.price.toFixed(2)}</p>
      </div>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/* Default export (for backwards-compat)                                      */
/* -------------------------------------------------------------------------- */
export default ProductCard
