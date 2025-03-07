"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useWishlist } from "@/context/wishlist-context"
import AddToCartButton from "@/components/add-to-cart-button"

export default function WishlistPage() {
  const { items, removeItem } = useWishlist()

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">Save items you love to your wishlist.</p>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {items.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 flex flex-col md:flex-row gap-6">
              <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold">
                    <Link href={`/products/${product.id}`} className="hover:underline">
                      {product.name}
                    </Link>
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(product.id)}
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-lg font-medium mt-1">${product.price.toFixed(2)}</p>
                <p className="text-muted-foreground mt-2 mb-4">{product.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <AddToCartButton product={product} />
                  <Button variant="outline" asChild>
                    <Link href={`/products/${product.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

