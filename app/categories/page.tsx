import Image from "next/image"
import Link from "next/link"
import { categories } from "@/lib/data"

export default function CategoriesPage() {
  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Shop by Category</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse our collection by category to find exactly what you're looking for.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`} className="group">
            <div className="overflow-hidden rounded-lg border bg-card">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

