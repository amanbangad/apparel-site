import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductCard, type Product } from "@/components/product-card"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/* Dummy data – replace with a real DB/API call in production                 */
/* -------------------------------------------------------------------------- */
const products: Product[] = [
  {
    id: "1",
    name: "Classic Tee",
    price: 29.99,
    image: "/placeholder.jpg",
    category: "shirts",
  },
  {
    id: "2",
    name: "Comfy Hoodie",
    price: 49.99,
    image: "/placeholder.jpg",
    category: "hoodies",
  },
  {
    id: "3",
    name: "Athletic Shorts",
    price: 39.99,
    image: "/placeholder.jpg",
    category: "shorts",
  },
]

const categories = {
  shirts: "Shirts",
  hoodies: "Hoodies",
  shorts: "Shorts",
} as const

/* -------------------------------------------------------------------------- */
/* Page component                                                             */
/* -------------------------------------------------------------------------- */
export default function CategoryPage({ params }: { params: { id: keyof typeof categories } }) {
  const categoryName = categories[params.id]

  if (!categoryName) {
    notFound()
  }

  const filtered = products.filter((p) => p.category === params.id)

  return (
    <main className={cn("container mx-auto px-4 py-16")}>
      <h1 className="mb-8 text-3xl font-bold">{categoryName}</h1>

      {filtered.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}

/* -------------------------------------------------------------------------- */
/* SEO                                                                        */
/* -------------------------------------------------------------------------- */
export function generateMetadata({ params }: { params: { id: keyof typeof categories } }): Metadata {
  const name = categories[params.id]
  if (!name) return {}
  return {
    title: `${name} – Apparel Shop`,
    description: `Browse all ${name.toLowerCase()} in our store.`,
  }
}
