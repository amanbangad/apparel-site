import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
    <Card className="group overflow-hidden">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative h-56 w-full overflow-hidden bg-muted">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <CardContent className="p-4 flex flex-col gap-2">
        <h3 className={cn("text-lg font-medium truncate")}>{product.name}</h3>
        <p className="text-muted-foreground">${product.price.toFixed(2)}</p>

        <Button asChild size="sm" className="mt-auto">
          <Link href={`/products/${product.id}`}>View product</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* Default export keeps backwards-compatibility                               */
/* -------------------------------------------------------------------------- */
export default ProductCard
