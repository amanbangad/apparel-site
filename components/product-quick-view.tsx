"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import type { Product } from "@/lib/data"
import AddToCartButton from "@/components/add-to-cart-button"
import { motion } from "framer-motion"

interface ProductQuickViewProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const [selectedSize, setSelectedSize] = useState<string>()
  const [selectedColor, setSelectedColor] = useState<string>()
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  // Reset selections when product changes
  useEffect(() => {
    setSelectedSize(undefined)
    setSelectedColor(undefined)
    setIsImageLoaded(false)
  }, [product.id])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
        <DialogClose className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Image */}
          <div className="relative aspect-square bg-muted">
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${isImageLoaded ? "opacity-0" : "opacity-100"} flex items-center justify-center`}
            >
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-300 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setIsImageLoaded(true)}
              priority
            />
          </div>

          {/* Product Details */}
          <div className="p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <p className="text-xl font-semibold mb-4">${product.price.toFixed(2)}</p>
              <p className="text-muted-foreground mb-6">{product.description}</p>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      className="h-8 px-3 transition-all hover:scale-105"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      className="h-8 px-3 transition-all hover:scale-105"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <AddToCartButton product={product} selectedSize={selectedSize} selectedColor={selectedColor} />
                <Button variant="outline" asChild className="transition-transform hover:scale-105 bg-transparent">
                  <Link href={`/products/${product.id}`}>View Details</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
