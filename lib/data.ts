/* -------------------------------------------------------------------------- */
/* Simple in-memory demo data & helpers.                                       */
/* Replace with a real database or CMS when you have one.                      */
/* -------------------------------------------------------------------------- */

export interface Category {
  id: string
  name: string
}

export const categories: Category[] = [
  { id: "shirts", name: "Shirts" },
  { id: "hoodies", name: "Hoodies" },
  { id: "shorts", name: "Shorts" },
]

export interface Product {
  id: string
  name: string
  price: number
  category: Category["id"]
  image: string
  description?: string
}

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Tee",
    price: 29,
    category: "shirts",
    image: "/placeholder.svg?height=500&width=500",
  },
  {
    id: "2",
    name: "Logo Hoodie",
    price: 59,
    category: "hoodies",
    image: "/placeholder.svg?height=500&width=500",
  },
  {
    id: "3",
    name: "Athletic Shorts",
    price: 39,
    category: "shorts",
    image: "/placeholder.svg?height=500&width=500",
  },
]

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

export function getProductsByCategory(id: string): Product[] {
  return products.filter((p) => p.category === id)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
