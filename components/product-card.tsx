"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/data"
import { motion } from "framer-motion"
import { cardVariants } from "@/lib/animations"
import { mapColorToHex } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="block">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg cursor-pointer"
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg?height=400&width=400"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.featured && (
            <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground">Featured</Badge>
          )}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-semibold leading-tight">{product.name}</h3>
          </div>
          <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            {product.colors && product.colors.length > 0 && (
              <div className="flex gap-1">
                {product.colors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="h-4 w-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: mapColorToHex(color) }}
                    title={color}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{product.colors.length - 3}</span>
                )}
              </div>
            )}
          </div>
          {product.sizes && product.sizes.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {product.sizes.length} size{product.sizes.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  )
}

export { ProductCard }
export default ProductCard
