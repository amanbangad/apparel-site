import type { Metadata } from "next"
import { notFound } from "next/navigation"

import ProductCard from "@/components/product-card"
import { categories, getCategoryById, getProductsByCategory, type Product } from "@/lib/data"

/* -------------------------------------------------------------------------- */
/* Static-generation helpers                                                  */
/* -------------------------------------------------------------------------- */

export const dynamicParams = false

export function generateStaticParams() {
  return categories.map((c) => ({ id: c.id }))
}

export function generateMetadata({
  params,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  params: any
  /* eslint-enable @typescript-eslint/no-explicit-any */
}): Metadata {
  const category = getCategoryById(String(params.id))
  return category
    ? {
        title: `${category.name} • Apparel`,
        description: `Browse all ${category.name.toLowerCase()} in our store.`,
      }
    : {}
}

/* -------------------------------------------------------------------------- */
/* Page component                                                             */
/* -------------------------------------------------------------------------- */

export default function CategoryPage({
  /* eslint-disable @typescript-eslint/no-explicit-any */
  params,
}: {
  params: any
  /* eslint-enable @typescript-eslint/no-explicit-any */
}) {
  const categoryId = String(params.id)
  const category = getCategoryById(categoryId)
  if (!category) notFound()

  const products: Product[] = getProductsByCategory(categoryId)

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
