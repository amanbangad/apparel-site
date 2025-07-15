import type { Metadata } from "next"
import Link from "next/link"

import { products } from "@/lib/data"
import { ProductCard } from "@/components/product-card"

interface CategoryPageProps {
  params: {
    id: string
  }
}

/**
 * Simple category listing page.
 * Only minimal UI so it compiles; adjust as required.
 */
export default function CategoryPage({ params }: CategoryPageProps) {
  const { id } = params
  const categoryProducts = products.filter((p) => p.category === id)

  return (
    <main className="container mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold capitalize">{id}</h1>

      {categoryProducts.length === 0 ? (
        <p>
          No products found. <Link href="/shop">Go back to shop</Link>.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}

/* ------------ Optional: set a nice <title> for SEO ----------------------- */
export function generateMetadata({ params }: CategoryPageProps): Metadata {
  return {
    title: `${params.id} – Shop`,
  }
}
