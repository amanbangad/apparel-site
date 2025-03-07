"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { products } from "@/lib/data"
import { Check, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductQuickView from "@/components/product-quick-view"

// Define filter types
type PriceRange = {
  label: string
  min: number
  max: number | null
}

export default function ShopPage() {
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [sortOption, setSortOption] = useState("featured")

  // Quick view state
  const [quickViewProduct, setQuickViewProduct] = useState<string | null>(null)

  // Filtered products state
  const [filteredProducts, setFilteredProducts] = useState(products)

  // Price range options
  const priceRanges: PriceRange[] = [
    { label: "Under $25", min: 0, max: 25 },
    { label: "$25 to $50", min: 25, max: 50 },
    { label: "$50 to $100", min: 50, max: 100 },
    { label: "Over $100", min: 100, max: null },
  ]

  // All available sizes from products
  const allSizes = Array.from(new Set(products.flatMap((product) => product.sizes))).sort()

  // All available colors from products
  const allColors = Array.from(new Set(products.flatMap((product) => product.colors))).sort()

  // Color mapping for UI display
  const colorMap: Record<string, string> = {
    Black: "bg-black",
    White: "bg-white",
    Navy: "bg-blue-900",
    Gray: "bg-gray-500",
    Blue: "bg-blue-600",
    Beige: "bg-amber-100",
    Olive: "bg-olive-600",
    Khaki: "bg-yellow-700",
    Cream: "bg-amber-50",
    Red: "bg-red-600",
    Green: "bg-green-600",
  }

  // Apply filters whenever filter states change
  useEffect(() => {
    let result = [...products]

    // Filter by category
    if (selectedCategory) {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Filter by price
    if (selectedPriceRanges.length > 0) {
      result = result.filter((product) => {
        return selectedPriceRanges.some((rangeLabel) => {
          const range = priceRanges.find((r) => r.label === rangeLabel)
          if (!range) return false

          if (range.max === null) {
            return product.price >= range.min
          }
          return product.price >= range.min && product.price < range.max
        })
      })
    }

    // Filter by size
    if (selectedSizes.length > 0) {
      result = result.filter((product) => product.sizes.some((size) => selectedSizes.includes(size)))
    }

    // Filter by color
    if (selectedColors.length > 0) {
      result = result.filter((product) => product.colors.some((color) => selectedColors.includes(color)))
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high-low":
        result.sort((a, b) => b.price - a.price)
        break
      case "newest":
        // For demo purposes, we'll just reverse the array
        result.reverse()
        break
      default:
        // Featured is default, no additional sorting needed
        break
    }

    setFilteredProducts(result)
  }, [selectedCategory, selectedPriceRanges, selectedSizes, selectedColors, sortOption])

  // Toggle price range selection
  const togglePriceRange = (range: string) => {
    setSelectedPriceRanges((prev) => (prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]))
  }

  // Toggle size selection
  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  // Toggle color selection
  const toggleColor = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedPriceRanges([])
    setSelectedSizes([])
    setSelectedColors([])
    setSortOption("featured")
  }

  // Get the product for quick view
  const quickViewProductData = quickViewProduct ? products.find((p) => p.id === quickViewProduct) : null

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-20 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Filters</h2>
              {(selectedCategory ||
                selectedPriceRanges.length > 0 ||
                selectedSizes.length > 0 ||
                selectedColors.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear All
                </Button>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">Categories</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    className={`text-sm ${selectedCategory === "t-shirts" ? "text-foreground font-medium" : "text-muted-foreground"} hover:text-foreground w-full text-left`}
                    onClick={() => setSelectedCategory((prev) => (prev === "t-shirts" ? null : "t-shirts"))}
                  >
                    T-Shirts
                  </button>
                </li>
                <li>
                  <button
                    className={`text-sm ${selectedCategory === "pants" ? "text-foreground font-medium" : "text-muted-foreground"} hover:text-foreground w-full text-left`}
                    onClick={() => setSelectedCategory((prev) => (prev === "pants" ? null : "pants"))}
                  >
                    Pants
                  </button>
                </li>
                <li>
                  <button
                    className={`text-sm ${selectedCategory === "hoodies" ? "text-foreground font-medium" : "text-muted-foreground"} hover:text-foreground w-full text-left`}
                    onClick={() => setSelectedCategory((prev) => (prev === "hoodies" ? null : "hoodies"))}
                  >
                    Hoodies
                  </button>
                </li>
                <li>
                  <button
                    className={`text-sm ${selectedCategory === "shirts" ? "text-foreground font-medium" : "text-muted-foreground"} hover:text-foreground w-full text-left`}
                    onClick={() => setSelectedCategory((prev) => (prev === "shirts" ? null : "shirts"))}
                  >
                    Shirts
                  </button>
                </li>
                <li>
                  <button
                    className={`text-sm ${selectedCategory === "jackets" ? "text-foreground font-medium" : "text-muted-foreground"} hover:text-foreground w-full text-left`}
                    onClick={() => setSelectedCategory((prev) => (prev === "jackets" ? null : "jackets"))}
                  >
                    Jackets
                  </button>
                </li>
                <li>
                  <button
                    className={`text-sm ${selectedCategory === "sweaters" ? "text-foreground font-medium" : "text-muted-foreground"} hover:text-foreground w-full text-left`}
                    onClick={() => setSelectedCategory((prev) => (prev === "sweaters" ? null : "sweaters"))}
                  >
                    Sweaters
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Price</h3>
              <div className="space-y-1">
                {priceRanges.map((range) => (
                  <label key={range.label} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedPriceRanges.includes(range.label)}
                      onChange={() => togglePriceRange(range.label)}
                    />
                    <span
                      className={`text-sm ${selectedPriceRanges.includes(range.label) ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <div className="space-y-1">
                {allSizes.map((size) => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedSizes.includes(size)}
                      onChange={() => toggleSize(size)}
                    />
                    <span
                      className={`text-sm ${selectedSizes.includes(size) ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {size}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {allColors.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full ${colorMap[color] || "bg-gray-300"} border ${selectedColors.includes(color) ? "border-primary ring-2 ring-primary/30" : "border-gray-300"} relative`}
                    onClick={() => toggleColor(color)}
                    title={color}
                  >
                    {selectedColors.includes(color) && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check size={14} className={color === "White" ? "text-black" : "text-white"} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}
            </h1>
            <select
              className="border rounded-md p-2"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">No products found</h2>
              <p className="text-muted-foreground mb-6">Try adjusting your filters to find what you're looking for.</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative">
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="overflow-hidden rounded-lg border bg-card">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        {/* Quick view button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="z-10"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setQuickViewProduct(product.id)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Quick View
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {product.colors.map((color) => (
                            <span
                              key={`${product.id}-${color}`}
                              className={`w-3 h-3 rounded-full ${colorMap[color] || "bg-gray-300"} border border-gray-300`}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProductData && (
        <ProductQuickView
          product={quickViewProductData}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  )
}

