import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductCard, type Product } from "@/components/product-card"
import { cn } from "@/lib/utils"
import { products as ALL_PRODUCTS } from "@/lib/data"

/* -------------------------------------------------------------------------- */
/* Category map (slug → human-readable). Extend as needed.                    */
/* -------------------------------------------------------------------------- */
const CATEGORY_NAMES: Record<string, string> = {
  shirts: "Shirts",
  hoodies: "Hoodies",
  shorts: "Shorts",
}

/* -------------------------------------------------------------------------- */
/* Page component                                                             */
/* -------------------------------------------------------------------------- */
export default function CategoryPage({
  params,
}: {
  // use `any` internally to avoid Next.js' PageProps constraint issues
  /* eslint-disable @typescript-eslint/no-explicit-any */
  params: any
  /* eslint-enable @typescript-eslint/no-explicit-any */
}) {
  const id = String(params.id ?? "")
  const categoryName = CATEGORY_NAMES[id]

  if (!categoryName) notFound()

  const filtered: Product[] = ALL_PRODUCTS.filter((p) => p.category === id)

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
export function generateMetadata({
  params,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  params: any
  /* eslint-enable @typescript-eslint/no-explicit-any */
}): Metadata {
  const name = CATEGORY_NAMES[String(params.id ?? "")]
  return {
    title: name ? `${name} – Apparel Shop` : "Category – Apparel Shop",
    description: name ? `Browse all ${name.toLowerCase()} available in our store.` : undefined,
  }
}
