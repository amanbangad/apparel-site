import type { Metadata } from "next"
import { notFound } from "next/navigation"

import ProductCard from "@/components/product-card"
import { getProductsByCategory, getCategoryById, categories, type Product } from "@/lib/data"

/* -------------------------------------------------------------------------- */
/* Static generation helpers                                                  */
/* -------------------------------------------------------------------------- */

export const dynamicParams = false // pre-render at build time

export function generateStaticParams() {
  return categories.map((cat) => ({ id: cat.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const category = getCategoryById(params.id)
  if (!category) return {}

  return {
    title: `${category.name} • Apparel`,
    description: `Browse all ${category.name.toLowerCase()} available in our store.`,
  }
}

/* -------------------------------------------------------------------------- */
/* Page component                                                             */
/* -------------------------------------------------------------------------- */

export default function CategoryPage({ params }: { params: { id: string } }) {
  const category = getCategoryById(params.id)
  if (!category) notFound()

  const products: Product[] = getProductsByCategory(params.id)

  return (
    <main className="container py-10">
      <h1 className="mb-8 text-3xl font-bold">{category.name}</h1>

      {products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>
      )}
    </main>
  )
}
