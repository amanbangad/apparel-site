import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import AddToCartButton from "@/components/add-to-cart-button"

export type Product = {
  id: string
  name: string
  price: number
  image: string
  category?: string
}

export interface ProductCardProps {
  product: Product
}

/**
 * Displays a single product with image, name & price.
 * Exposes a named export *and* the default export for maximum compatibility.
 */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border">
      <Link href={`/products/${product.id}`} className="relative block aspect-square">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width:768px) 50vw, 33vw"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex-1">
          <h3 className="text-lg font-medium">{product.name}</h3>
          <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
        </div>

        <AddToCartButton product={product} className="w-full" icon={<ShoppingCart className="mr-2 h-4 w-4" />}>
          Add to cart
        </AddToCartButton>
      </div>
    </article>
  )
}

export default ProductCard
