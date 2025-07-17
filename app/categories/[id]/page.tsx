import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductCard, type Product } from "@/components/product-card"
import { cn } from "@/lib/utils"
import { products as ALL_PRODUCTS, categories } from "@/lib/data"

export default function CategoryPage({
  params,
}: {
  params: { id: string }
}) {
  const id = params.id
  const category = categories.find((cat) => cat.id === id)

  if (!category) {
    notFound()
  }

  const filtered: Product[] = ALL_PRODUCTS.filter((p) => p.category === id)

  return (
    <main className={cn("container mx-auto px-4 py-16")}>
      <h1 className="mb-8 text-3xl font-bold">{category.name}</h1>
      <p className="mb-8 text-muted-foreground">{category.description}</p>

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

export function generateMetadata({
  params,
}: {
  params: { id: string }
}): Metadata {
  const category = categories.find((cat) => cat.id === params.id)
  return {
    title: category ? `${category.name} – Apparel Shop` : "Category – Apparel Shop",
    description: category?.description,
  }
}
