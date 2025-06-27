"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/data"
import { useState } from "react"
import ProductQuickView from "@/components/product-quick-view"
import { motion } from "framer-motion"
import { cardVariants } from "@/lib/animations"
import { useCart } from "@/context/cart-context"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product, 1)
  }

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg"
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
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex flex-col gap-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowQuickView(true)}
                className="bg-white/90 text-black hover:bg-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleAddToCart}
                className="bg-white/90 text-black hover:bg-white"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-semibold leading-tight">
              <Link href={`/products/${product.id}`} className="hover:underline">
                {product.name}
              </Link>
            </h3>
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
                    style={{ backgroundColor: color.toLowerCase() }}
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

      <ProductQuickView product={product} isOpen={showQuickView} onClose={() => setShowQuickView(false)} />
    </>
  )
}
