/**
 * In-memory demo data and helper utilities.
 * Replace this with a real database or CMS integration
 * when you move beyond the prototype stage.
 */

export interface Category {
  id: string
  name: string
  description: string
  image: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: Category["id"]
  image: string
  featured?: boolean
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

export const categories: Category[] = [
  {
    id: "shirts",
    name: "Shirts",
    description: "Stylish and comfortable shirts for every occasion.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "hoodies",
    name: "Hoodies",
    description: "Cozy hoodies to keep you warm all year round.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "shorts",
    name: "Shorts",
    description: "Breathable shorts perfect for summer days.",
    image: "/placeholder.svg?height=400&width=600",
  },
]

/* -------------------------------------------------------------------------- */
/* Products                                                                   */
/* -------------------------------------------------------------------------- */

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Tee",
    description: "100 % cotton tee with a relaxed fit.",
    price: 29,
    category: "shirts",
    image: "/placeholder.svg?height=500&width=500",
    featured: true,
  },
  {
    id: "2",
    name: "Logo Hoodie",
    description: "Heavy-weight fleece hoodie with embroidered logo.",
    price: 59,
    category: "hoodies",
    image: "/placeholder.svg?height=500&width=500",
    featured: true,
  },
  {
    id: "3",
    name: "Athletic Shorts",
    description: "Quick-dry shorts with zip pockets.",
    price: 39,
    category: "shorts",
    image: "/placeholder.svg?height=500&width=500",
  },
]

/* -------------------------------------------------------------------------- */
/* Helper functions                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Find a category by its slug/ID.
 */
export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

/**
 * Return all products belonging to a given category.
 */
export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.category === categoryId)
}

/**
 * Get a single product by its ID.
 */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

/**
 * Get an array of products flagged as `featured: true`.
 */
export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}
