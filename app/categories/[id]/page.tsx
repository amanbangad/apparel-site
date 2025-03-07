import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { categories, getProductsByCategory } from "@/lib/data"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Check if the category ID exists
  const categoryId = params.id
  const category = categories.find((c) => c.id === categoryId)

  // If category doesn't exist, show the not-found page
  if (!category) {
    notFound()
  }

  // Get products for this category
  const products = getProductsByCategory(categoryId)

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-muted-foreground">{category.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="group">
            <div className="overflow-hidden rounded-lg border bg-card">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find any products in this category.</p>
          <Link href="/shop" className="text-primary hover:underline">
            View all products
          </Link>
        </div>
      )}
    </div>
  )
}

