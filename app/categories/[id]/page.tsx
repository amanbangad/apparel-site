import { notFound } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { products, categories } from "@/lib/data"

interface CategoryPageProps {
  params: Promise<{ id: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params

  const category = categories.find((cat) => cat.id === id)

  if (!category) {
    notFound()
  }

  const categoryProducts = products.filter((product) => product.category === id)

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-muted-foreground">{category.description}</p>
      </div>

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
    </div>
  )
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    id: category.id,
  }))
}
