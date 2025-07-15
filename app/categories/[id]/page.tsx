import { notFound } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { products, categories } from "@/lib/data"
import type { Metadata } from "next"

/**
 * Props for the dynamic /categories/[id] route.
 * Next 15 no longer provides a PageProps helper type,
 * so we declare the shape explicitly.
 */
interface CategoryPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  return {
    title: `Category – ${params.id} | Apparel`,
    description: `Products for category ${params.id}`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = params

  const category = categories.find((cat) => cat.id === id)

  if (!category) {
    notFound()
  }

  const categoryProducts = products.filter((product) => product.category === id)

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Category: {category.name}</h1>
      <p className="text-muted-foreground">{category.description}</p>

      {categoryProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    id: category.id,
  }))
}
