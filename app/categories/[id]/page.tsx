import type { Metadata } from "next"
import { notFound } from "next/navigation"

import ProductCard, { type Product } from "@/components/product-card"
import { getProductsByCategory, getCategoryById } from "@/lib/data"

/* -------------------------------------------------------------------------- */
/*                             Static Site Data                               */
/* -------------------------------------------------------------------------- */

export const dynamicParams = false // pre-generate all category pages

export async function generateStaticParams() {
  return getCategoryById("*").map((cat) => ({ id: cat.id }))
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const category = getCategoryById(params.id)
  if (!category) notFound()

  return {
    title: `${category.name} • Apparel`,
    description: `Browse all ${category.name} in our store`,
  }
}

/* -------------------------------------------------------------------------- */
/*                                 Page Component                             */
/* -------------------------------------------------------------------------- */

export default function CategoryPage({
  params,
}: {
  params: { id: string }
}) {
  const products: Product[] = getProductsByCategory(params.id)

  if (!products?.length) notFound()

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold mb-8 capitalize">{params.id}</h1>

      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </section>
    </main>
  )
}
