export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  sizes?: string[]
  colors?: string[]

  /**
   * Average star rating from 0–5.
   * Optional because not every product has reviews yet.
   */
  rating?: number

  /**
   * If the item is on sale, `originalPrice` holds the price before discount.
   */
  originalPrice?: number

  /**
   * Small label that appears next to the price (e.g. "Sale", "New").
   */
  badge?: string
}
