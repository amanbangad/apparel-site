/**
 * Central, **typed** mock-data layer for the demo storefront.
 * In a real application these objects would come from your database / CMS.
 */

export interface Category {
  id: string
  name: string
  image?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  /* --- optional, used by UI but not always present ----------------------- */
  sizes?: string[]
  colors?: string[]
  image?: string
  rating?: number
  originalPrice?: number
  badge?: string
}

/* ------------------------------------------------------------------------ */
/*  CATEGORIES                                                              */
/* ------------------------------------------------------------------------ */

export const categories: Category[] = [
  {
    id: "tshirts",
    name: "T-Shirts",
    image: "/placeholder.svg?height=320&width=640",
  },
  {
    id: "hoodies",
    name: "Hoodies",
    image: "/placeholder.svg?height=320&width=640",
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "/placeholder.svg?height=320&width=640",
  },
]

/* ------------------------------------------------------------------------ */
/*  PRODUCTS                                                                */
/* ------------------------------------------------------------------------ */

export const products: Product[] = [
  {
    id: "classic-tee",
    name: "Classic Tee",
    description: "Our best-selling premium cotton tee. Soft, durable, and perfect for everyday wear.",
    price: 25,
    category: "tshirts",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy"],
    image: "/placeholder.svg?height=640&width=640",
    rating: 4.4,
    badge: "Best Seller",
  },
  {
    id: "oversized-hoodie",
    name: "Oversized Hoodie",
    description: "A cozy oversized hoodie made from recycled cotton and polyester blend.",
    price: 65,
    originalPrice: 80,
    category: "hoodies",
    sizes: ["S", "M", "L"],
    colors: ["Grey", "Olive"],
    image: "/placeholder.svg?height=640&width=640",
    rating: 4.8,
    badge: "Sale",
  },
  {
    id: "canvas-tote",
    name: "Canvas Tote Bag",
    description: "Heavy-duty organic canvas tote for groceries, books, or beach days.",
    price: 18,
    category: "accessories",
    colors: ["Natural"],
    image: "/placeholder.svg?height=640&width=640",
    rating: 4.2,
  },
]

/* ------------------------------------------------------------------------ */
/*  HELPERS                                                                 */
/* ------------------------------------------------------------------------ */

/**
 * Find a single product by its `id`.
 */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

/**
 * All products belonging to a given category id.
 */
export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.category === categoryId)
}
