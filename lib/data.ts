export type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  sizes: string[]
  colors: string[]
  featured?: boolean
}

export type Category = {
  id: string
  name: string
  description: string
  image: string
}

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

export const products: Product[] = [
  /* … (sample products – truncated for brevity, keep existing data) … */
]

export const categories: Category[] = [
  /* … (sample categories – truncated for brevity, keep existing data) … */
]

/* -------------------------------------------------------------------------- */
/* Helper functions (named exports)                                           */
/* -------------------------------------------------------------------------- */

/** Return a category object when the slug matches, otherwise undefined. */
export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.category === categoryId)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
