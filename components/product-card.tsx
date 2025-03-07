"use client"

import Link from "next/link"
import Image from "next/image"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/data"

interface ProductCardProps {
  product: Product
  onQuickView: (productId: string) => void
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  // Color mapping for UI display
  const colorMap: Record<string, string> = {
    Black: "bg-black",
    White: "bg-white",
    Navy: "bg-blue-900",
    Gray: "bg-gray-500",
    Blue: "bg-blue-600",
    Beige: "bg-amber-100",
    Olive: "bg-olive-600",
    Khaki: "bg-yellow-700",
    Cream: "bg-amber-50",
    Red: "bg-red-600",
    Green: "bg-green-600",
  }

  return (
    <div className="group relative">
      <Link href={`/products/${product.id}`} className="block">
        <div className="overflow-hidden rounded-lg border bg-card">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform group-hover:scale-105"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2QVQp0QAAAABJRU5ErkJggg=="
            />
            {/* Quick view button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <Button
                variant="secondary"
                size="sm"
                className="z-10"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onQuickView(product.id)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Quick View
              </Button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {product.colors.map((color) => (
                <span
                  key={`${product.id}-${color}`}
                  className={`w-3 h-3 rounded-full ${colorMap[color] || "bg-gray-300"} border border-gray-300`}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

