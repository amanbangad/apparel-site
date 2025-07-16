"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/data"

export interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={500}
          height={500}
          className="h-64 w-full object-cover"
        />
      </Link>

      <CardContent className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold">{product.name}</h3>
        <span className="text-sm text-muted-foreground">${product.price}</span>
        <Button asChild>
          <Link href={`/products/${product.id}`}>View details</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

/* Named and default export to satisfy every import style */
export default ProductCard
