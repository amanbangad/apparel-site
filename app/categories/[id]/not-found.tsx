import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CategoryNotFound() {
  return (
    <div className="container py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
        We couldn&apos;t find the category you&apos;re looking for. It may have been removed or doesn&apos;t exist.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/categories">Browse Categories</Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/shop">Shop All Products</Link>
        </Button>
      </div>
    </div>
  )
}
