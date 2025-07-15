"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import AddToCartButton from "@/components/add-to-cart-button"

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  sizes?: string[]
  colors?: string[]
}

/* -------------------------------------------------------------------------- */
/*                                ProductCard                                 */
/* -------------------------------------------------------------------------- */

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article
      className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Link href={`/products/${product.id}`} className="relative aspect-square w-full overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
        />
      </Link>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-lg font-medium line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>

        <div className="mt-auto flex gap-2">
          <Button asChild className="w-full">
            <Link href={`/products/${product.id}`}>View</Link>
          </Button>

          {/* Minimal Add-to-Cart (default size/color if omitted) */}
          <AddToCartButton
            product={product}
            selectedSize={product.sizes?.[0] ?? ""}
            selectedColor={product.colors?.[0] ?? ""}
          />
        </div>
      </div>
    </motion.article>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Default export                                */
/* -------------------------------------------------------------------------- */

export default ProductCard
