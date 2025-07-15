"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/data"

type Props = { product: Product }

export function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product.id}`} prefetch={false}>
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative h-56 w-full">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <CardContent className="p-4 space-y-1">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
          {product.featured && <Badge variant="secondary">Featured</Badge>}
        </CardContent>
      </Card>
    </Link>
  )
}

/* Provide default export for legacy imports */
export default ProductCard
